// Use your machine's local IP (e.g., 192.168.1.5) instead of localhost for mobile devices
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.171.176.89:4000/api';

export const DB_NAME = 'qos_qoe.db';
export const SETTINGS_KEY = 'qos-qoe-settings';
export const SESSION_KEY = 'qos-qoe-session';

export const BACKGROUND_TASK = 'qos-qoe-background-sampler';
export const PROBE_URL = 'https://www.google.com/generate_204';
export const DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=150000';

export const DEFAULT_SETTINGS = {
  autoCollect: false,
  autoUpload: false,
  notifyOnPoorNetwork: true,
  latencyThresholdMs: 250,
  downloadThresholdMbps: 2,
  packetLossThresholdPercent: 10,
};