export function formatNumber(value, suffix = '') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  return `${Number(value).toFixed(1)}${suffix}`;
}

export function qualityColor(record) {
  const rating = record.overall_rating ?? record.overallRating;
  const latency = record.latency_ms ?? record.latencyMs;
  const download = record.download_mbps ?? record.downloadMbps;
  if (rating) return rating >= 4 ? '#138a52' : rating >= 3 ? '#d9911f' : '#c43c4e';
  if (latency !== null && latency !== undefined && latency > 250) return '#c43c4e';
  if (download !== null && download !== undefined && download < 2) return '#d9911f';
  return '#138a52';
}

export function normalizePoint(record) {
  return {
    id: record.id ?? record._id,
    latitude: record.latitude,
    longitude: record.longitude,
    latency: record.latency_ms ?? record.latencyMs,
    download: record.download_mbps ?? record.downloadMbps,
    provider: record.isp_provider ?? record.ispProvider,
    network: record.network_type ?? record.networkType,
    userName: record.userName,
    userEmail: record.userEmail,
    city: record.city,
    region: record.region,
    country: record.country,
    color: qualityColor(record),
  };
}
