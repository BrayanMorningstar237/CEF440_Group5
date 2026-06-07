import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { AppFrame } from '../components/AppFrame';
import { Heatmap } from '../components/Heatmap';
import { LoadingScreen } from '../components/LoadingScreen';
import { MetricCard } from '../components/MetricCard';
import { RecordCard } from '../components/RecordCard';
import { translate } from '../config/i18n';
import { apiRequest } from '../services/api';
import { styles } from '../styles';
import { qualityColor } from '../utils/format';

export function AdminApp({ language = 'en', session, onLogout, onToggleLanguage }) {
  const [activeTab, setActiveTab] = useState('map');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    country: '',
    location: '',
    network: '',
    provider: '',
    quality: 'all',
    region: '',
    user: '',
  });

  const loadAdminData = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.provider) params.append('provider', filters.provider);
    if (filters.network) params.append('network', filters.network);
    if (filters.user) params.append('user', filters.user);
    if (filters.country) params.append('country', filters.country);
    if (filters.region) params.append('region', filters.region);
    if (filters.city) params.append('city', filters.city);
    if (filters.location) params.append('location', filters.location);
    if (filters.quality !== 'all') params.append('quality', filters.quality);
    const query = params.toString();
    const data = await apiRequest(`/admin/measurements${query ? `?${query}` : ''}`, {
      token: session.token,
    });
    setRecords(data.measurements || []);
  }, [filters, session.token]);

  useEffect(() => {
    loadAdminData()
      .catch((error) => Alert.alert('Admin data failed', error.message))
      .finally(() => setLoading(false));
  }, [loadAdminData]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadAdminData().catch(() => null);
    }, 10000);
    return () => clearInterval(timer);
  }, [loadAdminData]);

  const stats = useMemo(() => {
    const poor = records.filter((record) => qualityColor(record) === '#c43c4e').length;
    const users = new Set(records.map((record) => record.userEmail).filter(Boolean)).size;
    return { poor, users };
  }, [records]);

  if (loading) return <LoadingScreen text="Loading admin dashboard" />;

  return (
    <AppFrame
      activeTab={activeTab}
      language={language}
      onLogout={onLogout}
      onToggleLanguage={onToggleLanguage}
      roleLabel={translate(language, 'admin')}
      setActiveTab={setActiveTab}
      tabs={[
        ['dashboard', translate(language, 'dashboard')],
        ['map', translate(language, 'heatmap')],
        ['records', translate(language, 'records')],
      ]}
      user={session.user}
    >
      {activeTab === 'dashboard' && (
        <>
          <View style={styles.metricGrid}>
            <MetricCard label={translate(language, 'samples')} value={records.length} />
            <MetricCard label="Users" value={stats.users} tone="strong" />
            <MetricCard label="Poor samples" value={stats.poor} />
            <MetricCard label={translate(language, 'provider')} value={new Set(records.map((item) => item.ispProvider).filter(Boolean)).size} />
          </View>
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>{translate(language, 'filters')}</Text>
            <TextInput
              onChangeText={(text) => setFilters((current) => ({ ...current, user: text }))}
              placeholder="Search user name or email"
              placeholderTextColor="#8090a6"
              style={styles.input}
              value={filters.user}
            />
            <TextInput
              onChangeText={(text) => setFilters((current) => ({ ...current, provider: text }))}
              placeholder="Search ISP/provider"
              placeholderTextColor="#8090a6"
              style={styles.input}
              value={filters.provider}
            />
            <TextInput
              onChangeText={(text) => setFilters((current) => ({ ...current, network: text }))}
              placeholder="Search network type"
              placeholderTextColor="#8090a6"
              style={styles.input}
              value={filters.network}
            />
            <TextInput
              onChangeText={(text) => setFilters((current) => ({ ...current, location: text }))}
              placeholder="Location search: Cameroon, Littoral, Douala"
              placeholderTextColor="#8090a6"
              style={styles.input}
              value={filters.location}
            />
            <View style={styles.filterGrid}>
              <TextInput
                onChangeText={(text) => setFilters((current) => ({ ...current, country: text }))}
                placeholder={translate(language, 'country')}
                placeholderTextColor="#8090a6"
                style={[styles.input, styles.filterGridInput]}
                value={filters.country}
              />
              <TextInput
                onChangeText={(text) => setFilters((current) => ({ ...current, region: text }))}
                placeholder={translate(language, 'region')}
                placeholderTextColor="#8090a6"
                style={[styles.input, styles.filterGridInput]}
                value={filters.region}
              />
              <TextInput
                onChangeText={(text) => setFilters((current) => ({ ...current, city: text }))}
                placeholder={translate(language, 'city')}
                placeholderTextColor="#8090a6"
                style={[styles.input, styles.filterGridInput]}
                value={filters.city}
              />
            </View>
            <View style={styles.filterChips}>
              {['all', 'good', 'fair', 'poor'].map((quality) => (
                <Pressable
                  key={quality}
                  onPress={() => setFilters((current) => ({ ...current, quality }))}
                  style={[styles.filterChip, filters.quality === quality && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, filters.quality === quality && styles.filterChipTextActive]}>
                    {quality}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={loadAdminData} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Refresh results</Text>
            </Pressable>

            <Pressable onPress={onLogout} style={[styles.secondaryButton, { marginTop: 10, borderColor: '#ffccd5', backgroundColor: '#fff5f7' }]}>
              <Text style={[styles.secondaryButtonText, { color: '#e03131' }]}>{translate(language, 'logout')}</Text>
            </Pressable>
          </View>
        </>
      )}
      {activeTab === 'map' && (
        <View style={styles.adminMapScreen}>
          <View style={styles.mapQuickFilters}>
            <TextInput
              onBlur={() => setFocusedField(null)}
              onChangeText={(text) => setFilters((current) => ({ ...current, location: text }))}
              onFocus={() => setFocusedField('location')}
              placeholder="Cameroon, region, city"
              placeholderTextColor={focusedField === 'location' ? '#8090a6' : '#ffffff'}
              style={[styles.mapSearchInput, focusedField === 'location' && styles.mapSearchInputActive]}
              value={filters.location}
            />
            <TextInput
              onBlur={() => setFocusedField(null)}
              onChangeText={(text) => setFilters((current) => ({ ...current, user: text }))}
              onFocus={() => setFocusedField('user')}
              placeholder="User"
              placeholderTextColor={focusedField === 'user' ? '#8090a6' : '#ffffff'}
              style={[styles.mapSearchInput, focusedField === 'user' && styles.mapSearchInputActive]}
              value={filters.user}
            />
          </View>
          <Heatmap fullScreen points={records} title={translate(language, 'allUsersHeatmap')} />
        </View>
      )}
      {activeTab === 'records' && (
        <View style={styles.records}>
          {records.map((record) => (
            <RecordCard
              expanded={expandedRecordId === record._id}
              key={record._id}
              onToggle={() => setExpandedRecordId((current) => (current === record._id ? null : record._id))}
              record={record}
              showUser
            />
          ))}
        </View>
      )}
    </AppFrame>
  );
}
