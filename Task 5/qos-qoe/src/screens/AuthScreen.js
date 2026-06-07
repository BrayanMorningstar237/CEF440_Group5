import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { API_BASE_URL } from '../config/constants';
import { apiRequest } from '../services/api';
import { saveSession } from '../services/storage';
import { styles } from '../styles';
import { translate } from '../config/i18n';

const logoImg = require('../../assets/logo.png');

export function AuthScreen({ language = 'en', onAuthenticated, onToggleLanguage }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const payload =
        mode === 'register'
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password };
      const data = await apiRequest(mode === 'register' ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await saveSession(data);
      onAuthenticated(data);
    } catch (error) {
      Alert.alert('Authentication failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.authScreen, { flex: 1 }]}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={[styles.authContent, { flexGrow: 1 }]} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* The Hero now bleeds into the status bar area */}
        <View style={[styles.authHero, { paddingTop: insets.top + 20 }]}>
          <View style={styles.authBlobLarge} />
          <View style={styles.authBlobSmall} />
          <View style={styles.authWave} />

          <Pressable onPress={onToggleLanguage} style={styles.authLanguageButton}>
            <Text style={styles.authLanguageText}>{language === 'en' ? 'FR' : 'EN'}</Text>
          </Pressable>

         
          <View style={styles.brandHeader}>
            <View style={styles.brandLogo}>
              <Image source={logoImg} style={styles.brandLogoImage} resizeMode="contain" />
            </View>
            <Text style={styles.brandName}>KILObYTES</Text>
          </View>

          <Text style={styles.authTitle}>{translate(language, 'welcomeTitle')}</Text>
           <Text style={styles.authEyebrow}>QoS/QoE intelligence</Text>
          
          <Text style={styles.authCopy}>
            Collect subscriber experience samples, visualize coverage quality, and review network signals in one clean App.
          </Text>
          <View style={styles.authPreview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Live Speed</Text>
              <Text style={styles.previewBadge}>Online</Text>
            </View>
            <View style={styles.previewGauge}>
              <View style={styles.previewGaugeInner}>
                <Text style={styles.previewGaugeValue}>92</Text>
                <Text style={styles.previewGaugeLabel}>MB</Text>
              </View>
            </View>
            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>54.2</Text>
                <Text style={styles.previewStatLabel}>Mbps</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>18.5</Text>
                <Text style={styles.previewStatLabel}>Up Mbps</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>12</Text>
                <Text style={styles.previewStatLabel}>lat ms</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>4</Text>
                <Text style={styles.previewStatLabel}>jit ms</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatValue}>0.8</Text>
                <Text style={styles.previewStatLabel}>loss</Text>
              </View>
            </View>
          </View>
        </View>
        {/* The Panel stretches to handle the bottom safe area */}
        <View style={[styles.authPanel, { paddingBottom: insets.bottom + 40, flex: 1 }]}>
          <View style={styles.modeSwitch}>
            {['login', 'register'].map((item) => (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                style={[styles.modeButton, mode === item && styles.modeButtonActive]}
              >
                <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>
                  {item === 'login' ? translate(language, 'login') : translate(language, 'signUp')}
                </Text>
              </Pressable>
            ))}
          </View>
          {mode === 'register' && (
            <TextInput
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor="#8090a6"
              style={styles.input}
              value={name}
            />
          )}
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#8090a6"
            style={styles.input}
            value={email}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder={translate(language, 'password')}
            placeholderTextColor="#8090a6"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <Pressable disabled={loading} onPress={submit} style={styles.primaryButton}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{mode === 'login' ? translate(language, 'login') : translate(language, 'signUp')}</Text>}
          </Pressable>
          <Text style={styles.smallPrint}>API: {API_BASE_URL}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
