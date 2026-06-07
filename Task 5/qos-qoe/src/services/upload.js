import { apiRequest } from './api';
import { loadMeasurements, markUploaded } from './database';

export async function uploadPendingMeasurements(settings, token) {
  if (!settings.autoUpload || !token) return 0;
  const rows = await loadMeasurements();
  const pending = rows.filter((record) => !record.uploaded_at);
  if (pending.length === 0) return 0;
  await apiRequest('/measurements/bulk', {
    method: 'POST',
    token,
    body: JSON.stringify({ measurements: pending }),
  });
  await markUploaded(pending.map((record) => record.id));
  return pending.length;
}
