import * as Location from 'expo-location';
import * as Network from 'expo-network';

import { DOWNLOAD_URL, PROBE_URL } from '../config/constants';
import { formatNumber } from '../utils/format';

async function pingProbe() {
  const start = Date.now();
  const response = await fetch(`${PROBE_URL}?t=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
  });
  return { ok: response.ok || response.status === 204, ms: Date.now() - start };
}

async function measureLatency() {
  const samples = [];
  let failures = 0;
  for (let index = 0; index < 4; index += 1) {
    try {
      const sample = await pingProbe();
      if (sample.ok) samples.push(sample.ms);
      else failures += 1;
    } catch {
      failures += 1;
    }
  }
  const average =
    samples.length > 0 ? samples.reduce((total, value) => total + value, 0) / samples.length : null;
  const jitter =
    samples.length > 1
      ? samples
          .slice(1)
          .reduce((total, value, index) => total + Math.abs(value - samples[index]), 0) /
        (samples.length - 1)
      : null;
  return { latencyMs: average, jitterMs: jitter, packetLossPercent: (failures / 4) * 100 };
}

async function measureDownloadSpeed() {
  const start = Date.now();
  const response = await fetch(`${DOWNLOAD_URL}&t=${Date.now()}`, { cache: 'no-store' });
  const body = await response.arrayBuffer();
  const seconds = Math.max((Date.now() - start) / 1000, 0.001);
  return (body.byteLength * 8) / seconds / 1000000;
}

async function measureUploadSpeed() {
  const size = 250000; // 0.25 MB test payload
  const data = new Uint8Array(size);
  const start = Date.now();
  await fetch(PROBE_URL, {
    method: 'POST',
    body: data,
  }).catch(() => null);
  const seconds = Math.max((Date.now() - start) / 1000, 0.001);
  return (size * 8) / seconds / 1000000;
}

function inferProvider(networkState, ipAddress) {
  if (networkState.type === Network.NetworkStateType.WIFI) return 'Wi-Fi network';
  if (networkState.type === Network.NetworkStateType.CELLULAR) return 'Mobile carrier';
  if (ipAddress) return `IP ${ipAddress}`;
  return 'Unknown provider';
}

export async function collectMetrics() {
  const [networkState, ipAddress] = await Promise.all([
    Network.getNetworkStateAsync(),
    Network.getIpAddressAsync().catch(() => null),
  ]);
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  }).catch(() => null);
  const place =
    location?.coords?.latitude && location?.coords?.longitude
      ? await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }).catch(() => [])
      : [];
  const address = place[0] || {};
  const latency = await measureLatency().catch(() => ({
    latencyMs: null,
    jitterMs: null,
    packetLossPercent: null,
  }));
  const downloadMbps = await measureDownloadSpeed().catch(() => null);
  const uploadMbps = await measureUploadSpeed().catch(() => null);
  const ispProvider = inferProvider(networkState, ipAddress);
  const networkType = networkState.type ?? null;

  return {
    createdAt: new Date().toISOString(),
    networkType,
    isConnected: networkState.isConnected ? 1 : 0,
    isInternetReachable: networkState.isInternetReachable ? 1 : 0,
    ipAddress,
    ispProvider,
    connectionLabel: `${ispProvider} (${String(networkType ?? 'unknown').toLowerCase()})`,
    latencyMs: latency.latencyMs,
    jitterMs: latency.jitterMs,
    packetLossPercent: latency.packetLossPercent,
    uploadMbps,
    downloadMbps,
    signalStrengthDbm: null,
    latitude: location?.coords?.latitude ?? null,
    longitude: location?.coords?.longitude ?? null,
    accuracyM: location?.coords?.accuracy ?? null,
    country: address.country ?? null,
    region: address.region ?? address.subregion ?? null,
    city: address.city ?? address.district ?? address.name ?? null,
    district: address.district ?? null,
    street: address.street ?? null,
  };
}

export function isGoodConnection(metrics, settings) {
  return (
    metrics.isConnected === 1 &&
    metrics.isInternetReachable === 1 &&
    (metrics.latencyMs === null || metrics.latencyMs <= settings.latencyThresholdMs) &&
    (metrics.packetLossPercent === null ||
      metrics.packetLossPercent <= settings.packetLossThresholdPercent) &&
    (metrics.downloadMbps === null || metrics.downloadMbps >= settings.downloadThresholdMbps)
  );
}

export function getNetworkIssue(metrics, settings) {
  if (!metrics.isConnected || !metrics.isInternetReachable) return 'Internet is not reachable';
  if (metrics.latencyMs !== null && metrics.latencyMs > settings.latencyThresholdMs) {
    return `Latency is ${formatNumber(metrics.latencyMs, ' ms')}`;
  }
  if (
    metrics.packetLossPercent !== null &&
    metrics.packetLossPercent > settings.packetLossThresholdPercent
  ) {
    return `Packet loss is ${formatNumber(metrics.packetLossPercent, '%')}`;
  }
  if (metrics.downloadMbps !== null && metrics.downloadMbps < settings.downloadThresholdMbps) {
    return `Download speed is ${formatNumber(metrics.downloadMbps, ' Mbps')}`;
  }
  return null;
}
