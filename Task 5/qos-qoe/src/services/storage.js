import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, SESSION_KEY, SETTINGS_KEY } from '../config/constants';

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSession(session) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
