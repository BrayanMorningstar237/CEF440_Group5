import * as BackgroundTask from 'expo-background-task';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';

import { AppFrame } from '../components/AppFrame';
import { Heatmap } from '../components/Heatmap';
import { LoadingScreen } from '../components/LoadingScreen';
import { MetricCard } from '../components/MetricCard';
import { RatingRow } from '../components/RatingRow';
import { RecordCard } from '../components/RecordCard';
import { SettingToggle } from '../components/SettingToggle';
import { Speedometer } from '../components/Speedometer';
import { ThresholdInput } from '../components/ThresholdInput';
import { BACKGROUND_TASK, DEFAULT_SETTINGS } from '../config/constants';
import { translate } from '../config/i18n';
import { initDb, loadMeasurements, saveMeasurement } from '../services/database';
import { collectMetrics, getNetworkIssue, isGoodConnection } from '../services/metrics';
import { loadSettings, saveSettings } from '../services/storage';
import { uploadPendingMeasurements } from '../services/upload';
import { styles } from '../styles';
import { formatNumber } from '../utils/format';

export function UserApp({ language = 'en', session, onLogout, onToggleLanguage }) {
  const [activeTab, setActiveTab] = useState('collect');
  const [records, setRecords] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [feedback, setFeedback] = useState({
    stabilityRating: 4,
    browsingRating: 4,
    streamingRating: 4,
    comment: '',
  });

  const refreshRecords = useCallback(async () => setRecords(await loadMeasurements()), []);
  const updateSettings = useCallback((patch) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      saveSettings(next).catch(() => null);
      return next;
    });
  }, []);

  useEffect(() => {
    async function boot() {
      await initDb();
      setSettings(await loadSettings());
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.status !== 'granted') {
        Alert.alert('Location needed', 'Location permission is required for heatmap samples.');
      }
      setBackgroundEnabled(await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK).catch(() => false));
      await refreshRecords();
      setLoading(false);
    }
    boot();
  }, [refreshRecords]);

  async function collectAndSave(source = 'manual') {
    setSaving(true);
    try {
      const metrics = await collectMetrics();
      const issue = getNetworkIssue(metrics, settings);
      await saveMeasurement(metrics, feedback, source);
      setLatestMetrics(metrics);
      setFeedback((current) => ({ ...current, comment: '' }));
      if (issue && settings.notifyOnPoorNetwork) {
        Alert.alert('Poor network detected', `${issue}. Your feedback was saved with this sample.`);
      }
      if (isGoodConnection(metrics, settings)) {
        await uploadPendingMeasurements(settings, session.token).catch(() => 0);
      }
      await refreshRecords();
      Alert.alert('Saved', 'QoS metrics and QoE feedback were stored locally.');
    } catch (error) {
      Alert.alert('Collection failed', error.message);
    } finally {
      setSaving(false);
    }
  }

  async function enableBackgroundCollection() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== 'granted') {
      Alert.alert('Permission denied', 'Foreground location permission is required first.');
      return;
    }

    const background = await Location.requestBackgroundPermissionsAsync().catch(() => null);
    if (!background || background.status !== 'granted') {
      Alert.alert(
        'Background permission needed',
        'Background location permission is required to collect data while the app is not in use.'
      );
      return;
    }

    try {
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK, { minimumInterval: 15 });
      updateSettings({ autoCollect: true, backgroundConsent: true });
      setBackgroundEnabled(true);
      Alert.alert('Automatic collection enabled', 'Background collection requires a development build.');
    } catch (error) {
      Alert.alert('Background registration failed', error.message);
    }
  }

  async function toggleBackground() {
    if (backgroundEnabled) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK);
      updateSettings({ autoCollect: false });
      setBackgroundEnabled(false);
      return;
    }

    Alert.alert(
      'Background data collection',
      'Background data collection collects network samples while the app is not in use. Do you consent?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Opt in', onPress: enableBackgroundCollection },
      ]
    );
  }

  async function uploadNow(force = true) {
    setUploading(true);
    try {
      const uploaded = await uploadPendingMeasurements({ ...settings, autoUpload: force }, session.token);
      await refreshRecords();
      Alert.alert('Upload complete', `${uploaded} pending records uploaded.`);
    } catch (error) {
      Alert.alert('Upload failed', `${error.message}. Check backend/.env and EXPO_PUBLIC_API_URL.`);
    } finally {
      setUploading(false);
    }
  }

  const averages = useMemo(() => {
    const manual = records.filter((record) => record.overall_rating);
    const averageRating = manual.length
      ? manual.reduce((total, record) => total + record.overall_rating, 0) / manual.length
      : null;
    const latencyRecords = records.filter((record) => record.latency_ms !== null);
    const averageLatency = latencyRecords.length
      ? latencyRecords.reduce((total, record) => total + record.latency_ms, 0) / latencyRecords.length
      : null;
    return {
      averageRating,
      averageLatency,
      uploaded: records.filter((record) => record.uploaded_at).length,
    };
  }, [records]);

  if (loading) return <LoadingScreen text="Preparing your collector" />;

  return (
    <AppFrame
      activeTab={activeTab}
      language={language}
      onLogout={onLogout}
      onToggleLanguage={onToggleLanguage}
      roleLabel={translate(language, 'subscriber')}
      setActiveTab={setActiveTab}
      tabs={[
        ['collect', translate(language, 'collect')],
        ['map', translate(language, 'map')],
        ['records', translate(language, 'records')],
        ['settings', translate(language, 'settings')],
      ]}
      user={session.user}
    >
      {activeTab === 'collect' && (
        <>
          <Speedometer active={saving} metrics={latestMetrics} />
          <View style={styles.metricGrid}>
            <MetricCard label={translate(language, 'samples')} value={records.length} />
            <MetricCard label={translate(language, 'uploaded')} value={averages.uploaded} tone="strong" />
            <MetricCard label={translate(language, 'avgLatency')} value={formatNumber(averages.averageLatency, ' ms')} />
            <MetricCard label="Avg Jitter" value={formatNumber(averages.averageJitter, ' ms')} />
            <MetricCard
              label={translate(language, 'provider')}
              value={latestMetrics?.ispProvider ?? records[0]?.isp_provider ?? 'N/A'}
            />
          </View>
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Network experience rating</Text>
            <RatingRow
              label="Signal Stability"
              value={feedback.stabilityRating}
              onChange={(value) => setFeedback((current) => ({ ...current, stabilityRating: value }))}
            />
            <RatingRow
              label="Browsing Speed"
              value={feedback.browsingRating}
              onChange={(value) => setFeedback((current) => ({ ...current, browsingRating: value }))}
            />
            <RatingRow
              label="Streaming Quality"
              value={feedback.streamingRating}
              onChange={(value) => setFeedback((current) => ({ ...current, streamingRating: value }))}
            />
            <TextInput
              multiline
              onChangeText={(text) => setFeedback((current) => ({ ...current, comment: text }))}
              placeholder="Optional feedback about this connection"
              placeholderTextColor="#8090a6"
              style={styles.commentInput}
              value={feedback.comment}
            />
            <Pressable disabled={saving} onPress={() => collectAndSave('manual')} style={styles.primaryButton}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{translate(language, 'collectSample')}</Text>}
            </Pressable>
            <Pressable disabled={uploading} onPress={() => uploadNow(true)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{translate(language, 'upload')}</Text>
            </Pressable>
          </View>
          {latestMetrics && (
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Latest sample</Text>
              <Text style={styles.detail}>Provider: {latestMetrics.ispProvider}</Text>
              <Text style={styles.detail}>Connection: {latestMetrics.connectionLabel}</Text>
              <Text style={styles.detail}>Latency: {formatNumber(latestMetrics.latencyMs, ' ms')}</Text>
              <Text style={styles.detail}>Jitter: {formatNumber(latestMetrics.jitterMs, ' ms')}</Text>
              <Text style={styles.detail}>Download: {formatNumber(latestMetrics.downloadMbps, ' Mbps')}</Text>
              <Text style={styles.detail}>Upload: {formatNumber(latestMetrics.uploadMbps, ' Mbps')}</Text>
              <Text style={styles.detail}>Packet loss: {formatNumber(latestMetrics.packetLossPercent, '%')}</Text>
            </View>
          )}
        </>
      )}
      {activeTab === 'map' && (
        <Heatmap fullScreen points={records} title="Your network heatmap" />
      )}
      {activeTab === 'records' && (
        <View style={styles.records}>
          {records.map((record) => (
            <RecordCard
              expanded={expandedRecordId === record.id}
              key={record.id}
              onToggle={() => setExpandedRecordId((current) => (current === record.id ? null : record.id))}
              record={record}
            />
          ))}
        </View>
      )}
      {activeTab === 'settings' && (
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Collection settings</Text>
          <SettingToggle
            description="Requires explicit opt-in before background data collection. Location permission must also be granted."
            label="Automatic collection"
            onChange={toggleBackground}
            value={backgroundEnabled}
          />
          <SettingToggle
            description="Uploads stored records when the connection is above your thresholds."
            label="Automatic upload"
            onChange={(value) => updateSettings({ autoUpload: value })}
            value={settings.autoUpload}
          />
          <SettingToggle
            description="Shows an in-app pop-up when the current sample crosses a threshold."
            label="Poor network pop-up"
            onChange={(value) => updateSettings({ notifyOnPoorNetwork: value })}
            value={settings.notifyOnPoorNetwork}
          />
          <ThresholdInput
            label="Latency trigger"
            onChange={(value) => updateSettings({ latencyThresholdMs: value })}
            suffix="ms"
            value={settings.latencyThresholdMs}
          />
          <ThresholdInput
            label="Download trigger"
            onChange={(value) => updateSettings({ downloadThresholdMbps: value })}
            suffix="Mbps"
            value={settings.downloadThresholdMbps}
          />
          <ThresholdInput
            label="Packet loss trigger"
            onChange={(value) => updateSettings({ packetLossThresholdPercent: value })}
            suffix="%"
            value={settings.packetLossThresholdPercent}
          />

          <Pressable onPress={onLogout} style={[styles.secondaryButton, { marginTop: 10, borderColor: '#ffccd5', backgroundColor: '#fff5f7' }]}>
            <Text style={[styles.secondaryButtonText, { color: '#e03131' }]}>{translate(language, 'logout')}</Text>
          </Pressable>
        </View>
      )}
    </AppFrame>
  );
}
