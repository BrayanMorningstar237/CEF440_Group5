import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { BACKGROUND_TASK } from '../config/constants';
import { initDb, saveMeasurement } from '../services/database';
import { collectMetrics, isGoodConnection } from '../services/metrics';
import { loadSession, loadSettings } from '../services/storage';
import { uploadPendingMeasurements } from '../services/upload';

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    await initDb();
    const settings = await loadSettings();
    const session = await loadSession();
    if (!settings.autoCollect || session?.user?.role !== 'user') {
      return BackgroundTask.BackgroundTaskResult.Success;
    }
    const metrics = await collectMetrics();
    await saveMeasurement(metrics, {}, 'background');
    if (isGoodConnection(metrics, settings)) {
      await uploadPendingMeasurements(settings, session.token).catch(() => 0);
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
