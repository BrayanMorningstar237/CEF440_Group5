require('dotenv').config();

const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(
  cors({
    origin(origin, callback) {
      if (CORS_ORIGIN === '*' || !origin) {
        callback(null, true);
        return;
      }
      const allowed = CORS_ORIGIN.split(',').map((item) => item.trim());
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  },
  { timestamps: true }
);

const networkCellSchema = new mongoose.Schema(
  {
    cellId: { type: String, primary: true, required: true }, // MCC-MNC-LAC-CID format
    ispProvider: { type: String, index: true },
    country: String,
    region: String,
    city: String,
    district: String,
    street: String,
  },
  { timestamps: true }
);

const measurementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cellId: { type: String, ref: 'NetworkCell', index: true },
    localId: Number,
    createdAt: { type: Date, required: true, index: true },
    networkType: String, // 'Mobile', 'WiFi', etc.
    networkGeneration: String, // '2G', '3G', '4G', '5G', 'WiFi-5', 'WiFi-6', etc.
    isConnected: Boolean,
    isInternetReachable: Boolean,
    isRoaming: Boolean,
    ipAddress: String,
    connectionLabel: String,
    deviceModel: String, // e.g., 'iPhone 15', 'Samsung Galaxy S24'
    osVersion: String, // e.g., 'iOS 18.0', 'Android 14'
    latencyMs: Number,
    jitterMs: Number,
    packetLossPercent: Number,
    uploadMbps: Number,
    downloadMbps: Number,
    signalStrengthDbm: Number,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    accuracyM: Number,
    stabilityRating: Number,
    browsingRating: Number,
    streamingRating: Number,
    comment: String,
    source: String,
  },
  { timestamps: true }
);

// Geospatial index for location-based queries
measurementSchema.index({ 'coordinates': '2dsphere' });
measurementSchema.index({ userId: 1, localId: 1 }, { unique: true, sparse: true });
measurementSchema.index({ cellId: 1 });
measurementSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
const NetworkCell = mongoose.model('NetworkCell', networkCellSchema);
const Measurement = mongoose.model('Measurement', measurementSchema);

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      res.status(401).json({ message: 'Missing auth token' });
      return;
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
}

async function mapMeasurement(row, user) {
  const coordinates = {
    type: 'Point',
    coordinates: [row.longitude ?? 0, row.latitude ?? 0], // GeoJSON format: [lng, lat]
  };

  // Generate cellId from network metadata (MCC-MNC-LAC-CID format if available)
  const cellId = row.cell_id || `CELL-${row.network_type}-${Date.now()}`;

  // Upsert NetworkCell if needed
  if (row.country || row.city) {
    await NetworkCell.updateOne(
      { cellId },
      {
        cellId,
        ispProvider: row.isp_provider,
        country: row.country,
        region: row.region,
        city: row.city,
        district: row.district,
        street: row.street,
      },
      { upsert: true }
    );
  }

  return {
    userId: user._id,
    cellId,
    localId: row.id,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    networkType: row.network_type,
    networkGeneration: row.network_generation || null,
    isConnected: Boolean(row.is_connected),
    isInternetReachable: Boolean(row.is_internet_reachable),
    isRoaming: Boolean(row.is_roaming) || false,
    ipAddress: row.ip_address,
    connectionLabel: row.connection_label,
    deviceModel: row.device_model || null,
    osVersion: row.os_version || null,
    latencyMs: row.latency_ms,
    jitterMs: row.jitter_ms,
    packetLossPercent: row.packet_loss_percent,
    uploadMbps: row.upload_mbps,
    downloadMbps: row.download_mbps,
    signalStrengthDbm: row.signal_strength_dbm,
    coordinates,
    accuracyM: row.accuracy_m,
    stabilityRating: row.stability_rating,
    browsingRating: row.browsing_rating,
    streamingRating: row.streaming_rating,
    comment: row.comment,
    source: row.source,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    res.status(400).json({ message: 'Name, email, and a 6+ character password are required' });
    return;
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ message: 'Email already exists' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'user' });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  const matches = await bcrypt.compare(password || '', user.passwordHash);
  if (!matches) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post('/api/measurements/bulk', requireAuth, async (req, res) => {
  const rows = Array.isArray(req.body.measurements) ? req.body.measurements : [];
  if (req.user.role !== 'user') {
    res.status(403).json({ message: 'Only normal users can upload measurements' });
    return;
  }
  const docs = await Promise.all(rows.map((row) => mapMeasurement(row, req.user)));
  let saved = 0;
  for (const doc of docs) {
    await Measurement.updateOne(
      { userId: req.user._id, localId: doc.localId },
      { $setOnInsert: doc },
      { upsert: true }
    );
    saved += 1;
  }
  res.status(201).json({ saved });
});

app.get('/api/measurements/mine', requireAuth, async (req, res) => {
  const items = await Measurement.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(250);
  res.json({ measurements: items });
});

app.get('/api/admin/measurements', requireAuth, requireAdmin, async (req, res) => {
  const { city, country, location, provider, network, quality, region, user, networkGen, roaming } = req.query;
  const query = {};
  const and = [];
  if (network) query.networkType = new RegExp(network, 'i');
  if (networkGen) query.networkGeneration = new RegExp(networkGen, 'i');
  if (roaming === 'true') query.isRoaming = true;
  if (roaming === 'false') query.isRoaming = false;

  // Handle location queries via NetworkCell lookup
  if (provider || country || region || city || location) {
    const cellQuery = {};
    if (provider) cellQuery.ispProvider = new RegExp(provider, 'i');
    if (country) cellQuery.country = new RegExp(country, 'i');
    if (region) cellQuery.region = new RegExp(region, 'i');
    if (city) cellQuery.city = new RegExp(city, 'i');
    if (location) {
      const matcher = new RegExp(location, 'i');
      cellQuery.$or = [
        { country: matcher },
        { region: matcher },
        { city: matcher },
        { district: matcher },
        { street: matcher },
      ];
    }
    const matchingCells = await NetworkCell.find(cellQuery).select('cellId');
    const cellIds = matchingCells.map((c) => c.cellId);
    if (cellIds.length > 0) {
      and.push({ cellId: { $in: cellIds } });
    }
  }

  // Handle user search via User collection
  if (user) {
    const users = await User.find({
      $or: [{ name: new RegExp(user, 'i') }, { email: new RegExp(user, 'i') }],
    }).select('_id');
    const userIds = users.map((u) => u._id);
    if (userIds.length > 0) {
      and.push({ userId: { $in: userIds } });
    }
  }

  if (quality === 'poor') {
    and.push({ $or: [{ latencyMs: { $gt: 250 } }, { downloadMbps: { $lt: 2 } }, { jitterMs: { $gt: 50 } }] });
  }
  if (quality === 'good') {
    and.push({ latencyMs: { $lte: 250 }, downloadMbps: { $gte: 2 }, jitterMs: { $lte: 20 } });
  }
  if (quality === 'fair') {
    and.push({ $or: [{ latencyMs: { $gt: 250, $lte: 500 } }, { downloadMbps: { $gte: 1, $lt: 2 } }, { jitterMs: { $gt: 20, $lte: 50 } }] });
  }
  if (and.length > 0) {
    query.$and = and;
  }
  const measurements = await Measurement.find(query)
    .populate('userId', 'name email')
    .populate('cellId')
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ measurements });
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return;
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name: 'System Admin', email, passwordHash, role: 'admin' });
  console.log(`Seeded admin account: ${email}`);
}

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required. Copy backend/.env.example to backend/.env.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected successfully');
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`QoS/QoE API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
