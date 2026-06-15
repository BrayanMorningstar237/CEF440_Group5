import * as SQLite from 'expo-sqlite';

import { DB_NAME } from '../config/constants';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

async function ensureColumn(db, table, column, type) {
  const columns = await db.getAllAsync(`PRAGMA table_info(${table})`);
  if (!columns.some((item) => item.name === column)) {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
  }
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      network_type TEXT,
      network_generation TEXT,
      is_connected INTEGER,
      is_internet_reachable INTEGER,
      is_roaming INTEGER,
      ip_address TEXT,
      isp_provider TEXT,
      connection_label TEXT,
      device_model TEXT,
      os_version TEXT,
      latency_ms REAL,
      jitter_ms REAL,
      packet_loss_percent REAL,
      download_mbps REAL,
      signal_strength_dbm REAL,
      latitude REAL,
      longitude REAL,
      accuracy_m REAL,
      country TEXT,
      region TEXT,
      city TEXT,
      district TEXT,
      street TEXT,
      cell_id TEXT,
      overall_rating INTEGER,
      response_time_rating INTEGER,
      usability_rating INTEGER,
      comment TEXT,
      source TEXT NOT NULL,
      uploaded_at TEXT
    );
  `);
  // Ensure new columns exist for migration
  await ensureColumn(db, 'measurements', 'network_generation', 'TEXT');
  await ensureColumn(db, 'measurements', 'is_roaming', 'INTEGER');
  await ensureColumn(db, 'measurements', 'device_model', 'TEXT');
  await ensureColumn(db, 'measurements', 'os_version', 'TEXT');
  await ensureColumn(db, 'measurements', 'cell_id', 'TEXT');
  await ensureColumn(db, 'measurements', 'isp_provider', 'TEXT');
  await ensureColumn(db, 'measurements', 'connection_label', 'TEXT');
  await ensureColumn(db, 'measurements', 'uploaded_at', 'TEXT');
  await ensureColumn(db, 'measurements', 'country', 'TEXT');
  await ensureColumn(db, 'measurements', 'region', 'TEXT');
  await ensureColumn(db, 'measurements', 'city', 'TEXT');
  await ensureColumn(db, 'measurements', 'district', 'TEXT');
  await ensureColumn(db, 'measurements', 'street', 'TEXT');
}

export async function saveMeasurement(metrics, feedback = {}, source = 'manual') {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO measurements (
      created_at, network_type, network_generation, is_connected, is_internet_reachable, is_roaming,
      ip_address, isp_provider, connection_label, device_model, os_version,
      latency_ms, jitter_ms, packet_loss_percent, download_mbps, signal_strength_dbm,
      latitude, longitude, accuracy_m, cell_id,
      country, region, city, district, street,
      overall_rating, response_time_rating, usability_rating, comment, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      metrics.createdAt,
      metrics.networkType,
      metrics.networkGeneration ?? null,
      metrics.isConnected,
      metrics.isInternetReachable,
      metrics.isRoaming ? 1 : 0,
      metrics.ipAddress,
      metrics.ispProvider,
      metrics.connectionLabel,
      metrics.deviceModel ?? null,
      metrics.osVersion ?? null,
      metrics.latencyMs,
      metrics.jitterMs,
      metrics.packetLossPercent,
      metrics.downloadMbps,
      metrics.signalStrengthDbm,
      metrics.latitude,
      metrics.longitude,
      metrics.accuracyM,
      metrics.cellId ?? null,
      metrics.country,
      metrics.region,
      metrics.city,
      metrics.district,
      metrics.street,
      feedback.overallRating ?? null,
      feedback.responseTimeRating ?? null,
      feedback.usabilityRating ?? null,
      feedback.comment ?? '',
      source,
    ]
  );
  return result.lastInsertRowId;
}

export async function loadMeasurements() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM measurements ORDER BY datetime(created_at) DESC LIMIT 250');
}

export async function markUploaded(ids) {
  if (ids.length === 0) return;
  const db = await getDb();
  const uploadedAt = new Date().toISOString();
  await Promise.all(
    ids.map((id) => db.runAsync('UPDATE measurements SET uploaded_at = ? WHERE id = ?', [uploadedAt, id]))
  );
}
