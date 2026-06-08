export const DB_NAME = 'qos_qoe.db';
export const BACKGROUND_TASK = 'qos-qoe-background-sampler';
export const PROBE_URL = 'https://www.google.com/generate_204';
export const DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=150000';
export const SETTINGS_KEY = 'qos-qoe-settings';
export const SESSION_KEY = 'qos-qoe-session';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.105:4000/api';

export const DEFAULT_SETTINGS = {
  autoCollect: false,
  backgroundConsent: false,
  autoUpload: false,
  notifyOnPoorNetwork: true,
  latencyThresholdMs: 250,
  downloadThresholdMbps: 2,
  packetLossThresholdPercent: 10,
};
