# Implementation Checklist: Database Schema Refactoring

## Status: ✅ BACKEND & DATABASE LAYER COMPLETE

The backend schemas, models, and database layer have been fully refactored. This checklist tracks remaining implementation tasks.

---

## Phase 1: Backend Infrastructure (✅ COMPLETED)

- [x] Create NetworkCell schema and model
- [x] Update Measurement schema with new fields
- [x] Add GeoJSON coordinates field
- [x] Remove denormalized user data (userName, userEmail)
- [x] Remove individual location fields (country, region, city, etc.)
- [x] Add geospatial index (2dsphere) on coordinates
- [x] Add 4 new network attribute fields:
  - [x] networkGeneration
  - [x] isRoaming
  - [x] deviceModel
  - [x] osVersion
- [x] Update mapMeasurement() function
- [x] Refactor admin/measurements endpoint with proper population
- [x] Update SQLite schema to include new columns
- [x] Add migration logic for schema changes

---

## Phase 2: Frontend Data Collection (⏳ PENDING)

### 2.1 Device Information Capture

**File:** `src/tasks/backgroundSampler.js` or main metrics collection

- [ ] Import device info library
  ```javascript
  import * as Device from 'expo-device';
  ```
- [ ] Capture device model
  ```javascript
  deviceModel: Device.modelName || Device.deviceName
  ```
- [ ] Capture OS version
  ```javascript
  osVersion: Device.osVersion
  ```

**Status:** ⏳ Pending  
**Difficulty:** Easy (5 mins)  
**Priority:** High

### 2.2 Network Generation Detection

**File:** `src/services/metrics.js` or network detection module

- [ ] Create function to detect network generation
  ```javascript
  export async function detectNetworkGeneration(netInfo) {
    // Detect '2G', '3G', '4G', '5G', 'WiFi-5', 'WiFi-6'
    if (netInfo.type === 'wifi') {
      // Use wifi frequency/signal to infer WiFi generation
      return 'WiFi-5' or 'WiFi-6'
    }
    if (netInfo.type === 'cellular') {
      // Map cellular generation based on netInfo subtype
      // Use platform-specific APIs for accurate detection
    }
  }
  ```
- [ ] Call detection function during measurement capture
- [ ] Include `networkGeneration` in metrics object

**Status:** ⏳ Pending  
**Difficulty:** Medium (15 mins)  
**Priority:** High  
**Reference:** See [Network Generation Mapping](#network-generation-mapping) below

### 2.3 Roaming Status Detection

**File:** `src/services/metrics.js`

- [ ] Detect roaming status from platform APIs
  ```javascript
  // React Native / Expo
  const netInfo = await import('@react-native-community/netinfo');
  const isRoaming = netInfo.details?.isConnectionExpensive; // approximate
  // OR platform-specific roaming detection
  ```
- [ ] Include `isRoaming` in metrics object
- [ ] Store in SQLite as `is_roaming INTEGER`

**Status:** ⏳ Pending  
**Difficulty:** Easy (5 mins)  
**Priority:** Medium  
**Reference:** React Native NetInfo API

### 2.4 Cell ID Generation

**File:** `src/services/metrics.js`

- [ ] Create `cellId` from network metadata (optional but recommended)
  ```javascript
  // Format: MCC-MNC-LAC-CID or generated ID
  // If available: ${MCC}-${MNC}-${LAC}-${CID}
  // Otherwise: CELL-${networkType}-${timestamp}
  const cellId = generateCellId(netInfo);
  ```
- [ ] Include in metrics object

**Status:** ⏳ Pending  
**Difficulty:** Easy (3 mins)  
**Priority:** Low (server generates fallback)

---

## Phase 3: API Integration (⏳ PENDING)

### 3.1 Upload Endpoint Testing

**File:** `src/services/upload.js`

- [ ] Test bulk upload with new field structure
  ```javascript
  const payload = {
    measurements: [
      {
        id: 1,
        created_at: "2026-06-15T10:30:00Z",
        network_type: "Mobile",
        network_generation: "5G",      // ← NEW
        is_roaming: false,              // ← NEW
        device_model: "iPhone 15",      // ← NEW
        os_version: "iOS 18.0",         // ← NEW
        latency_ms: 45,
        // ... rest of fields
      }
    ]
  };
  ```
- [ ] Verify response: `{ saved: N }`
- [ ] Check NetworkCell auto-creation in backend

**Status:** ⏳ Pending  
**Difficulty:** Easy (5 mins)  
**Priority:** High

### 3.2 Measurement Retrieval

**File:** `src/services/api.js`

- [ ] Test `/api/measurements/mine` endpoint
- [ ] Verify response includes new fields
- [ ] Confirm coordinates are in GeoJSON format (if desired)

**Status:** ⏳ Pending  
**Difficulty:** Easy (3 mins)  
**Priority:** Low

### 3.3 Admin Filters

**File:** Backend only (already updated)

- [x] `/api/admin/measurements?networkGen=5G`
- [x] `/api/admin/measurements?roaming=true`
- [x] Location-based via NetworkCell lookup
- [x] User lookup via User collection

**Status:** ✅ Complete  
**Notes:** Backend handles all filters; frontend UI updates needed

---

## Phase 4: Frontend UI Updates (⏳ PENDING)

### 4.1 Display New Metrics

**Files:** `src/components/MetricCard.js`, `src/screens/UserApp.js`

- [ ] Show `networkGeneration` in UI
- [ ] Show roaming status indicator
- [ ] Show device model in measurement details
- [ ] Show OS version in measurement details

**Status:** ⏳ Pending  
**Difficulty:** Easy (30 mins)  
**Priority:** Medium

### 4.2 Admin Dashboard Filters (New)

**File:** `src/screens/AdminApp.js`

- [ ] Add filter UI for `networkGeneration` dropdown
- [ ] Add filter UI for `isRoaming` toggle
- [ ] Add filter UI for device model search
- [ ] Test each filter with backend endpoint

**Status:** ⏳ Pending  
**Difficulty:** Medium (45 mins)  
**Priority:** Medium

### 4.3 Analytics / Reports

- [ ] Device performance comparison report
- [ ] Network generation analysis report
- [ ] Roaming impact analysis
- [ ] Geospatial heatmap (using coordinates)

**Status:** ⏳ Pending  
**Difficulty:** High (2+ hours)  
**Priority:** Low

---

## Phase 5: Testing & Validation (⏳ PENDING)

### 5.1 Unit Tests

- [ ] Test mapMeasurement() with new fields
- [ ] Test NetworkCell upsert logic
- [ ] Test GeoJSON coordinate transformation

**Status:** ⏳ Pending  
**Difficulty:** Easy (30 mins)  
**Priority:** Medium

### 5.2 Integration Tests

- [ ] Upload measurement → verify NetworkCell created
- [ ] Query measurements → verify population works
- [ ] Filter by networkGeneration → verify results
- [ ] Filter by roaming → verify results
- [ ] Test backward compatibility (old clients)

**Status:** ⏳ Pending  
**Difficulty:** Medium (1 hour)  
**Priority:** High

### 5.3 End-to-End Tests

- [ ] Full flow: collect → store → upload → query → display
- [ ] Verify no data loss from old measurements
- [ ] Verify performance improvements
- [ ] Stress test with large dataset

**Status:** ⏳ Pending  
**Difficulty:** Medium (1 hour)  
**Priority:** High

### 5.4 Geospatial Queries (Optional)

- [ ] Test "find within 5km" query
- [ ] Test heatmap aggregation
- [ ] Verify geospatial index usage

**Status:** ⏳ Pending  
**Difficulty:** Medium (30 mins)  
**Priority:** Low

---

## Network Generation Mapping

### iOS Detection

```javascript
// iOS specific network detection
import NetInfo from '@react-native-community/netinfo';

const state = await NetInfo.fetch();

// Cellular
if (state.type === 'cellular') {
  const subtype = state.details?.cellularGeneration;
  return {
    '2g': '2G',
    '3g': '3G',
    '4g': '4G',
    'lte': '4G',
    '5g': '5G',
    'lte-ca': '4G+',
  }[subtype] || 'Unknown';
}

// WiFi
if (state.type === 'wifi') {
  // WiFi standard from frequency (iOS 14+)
  const standard = state.details?.linkSpeed; // Not standard, needs custom logic
  // Alternative: Use signal strength heuristic or ask user
  return 'WiFi-5'; // Conservative default
}
```

### Android Detection

```javascript
// Android specific network detection
import NetInfo from '@react-native-community/netinfo';
import TelephonyManager from 'react-native-telephony-manager'; // Custom module

const state = await NetInfo.fetch();

// Cellular
if (state.type === 'cellular') {
  const networkType = state.details?.cellularGeneration;
  return {
    'GPRS': '2G',
    'EDGE': '2G',
    'UMTS': '3G',
    'CDMA': '2G',
    'EVDO_0': '3G',
    'EVDO_A': '3G',
    'HSDPA': '3G',
    'HSUPA': '3G',
    'HSPA': '3G',
    'LTE': '4G',
    'EHRPD': '3G',
    'HSPAP': '3G',
    'TD_SCDMA': '3G',
    'IWLAN': 'WiFi',
    'LTE_CA': '4G+',
    'NR': '5G', // New Radio (5G)
  }[networkType] || 'Unknown';
}

// WiFi
if (state.type === 'wifi') {
  // Use WiFi standard info (API 30+)
  // Fallback: frequency detection
  return 'WiFi-5'; // Conservative default
}
```

### Web/Expo Detection

```javascript
// Fallback for web or generic Expo
// Use NetworkInformation API (limited support)
if (navigator?.connection) {
  const effectiveType = navigator.connection.effectiveType;
  return {
    'slow-2g': '2G',
    '2g': '2G',
    '3g': '3G',
    '4g': '4G',
  }[effectiveType] || 'Unknown';
}

// Fallback if no API available
return null; // Server can infer from metrics
```

---

## Code Snippets for Implementation

### 1. Update Metrics Collection

**File:** `src/tasks/backgroundSampler.js`

```javascript
import * as Device from 'expo-device';
import { detectNetworkGeneration } from '../services/metrics';

async function collectMetrics() {
  const netInfo = await getNetworkInfo(); // existing
  const metrics = {
    createdAt: new Date().toISOString(),
    networkType: netInfo.type,
    networkGeneration: await detectNetworkGeneration(netInfo),  // NEW
    isRoaming: await detectRoaming(),                          // NEW
    ipAddress: await getPublicIP(),
    deviceModel: Device.modelName,                            // NEW
    osVersion: Device.osVersion,                              // NEW
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    // ... existing metrics
  };
  
  await saveMeasurement(metrics);
}
```

### 2. Roaming Detection

```javascript
// src/services/metrics.js
export async function detectRoaming() {
  try {
    if (Platform.OS === 'ios') {
      // iOS: use onNetworkStateChange or similar
      // Limited support - may need to ask user
      return false; // Conservative default
    }
    if (Platform.OS === 'android') {
      // Android: TelephonyManager.isNetworkRoaming()
      const isRoaming = await TelephonyManager.isNetworkRoaming();
      return isRoaming;
    }
  } catch (error) {
    console.warn('Could not detect roaming status:', error);
    return false;
  }
}
```

### 3. Network Generation Detection

```javascript
// src/services/metrics.js
export async function detectNetworkGeneration(netInfo) {
  try {
    if (netInfo.type === 'cellular') {
      const subtype = netInfo.details?.cellularGeneration;
      if (Platform.OS === 'ios') {
        return mapIOSGeneration(subtype);
      }
      if (Platform.OS === 'android') {
        return mapAndroidGeneration(subtype);
      }
    }
    if (netInfo.type === 'wifi') {
      // Default to WiFi-5; could enhance with frequency detection
      return 'WiFi-5';
    }
  } catch (error) {
    console.warn('Could not detect network generation:', error);
    return null;
  }
}

function mapIOSGeneration(subtype) {
  const mapping = {
    '2g': '2G', '3g': '3G', '4g': '4G', 'lte': '4G', '5g': '5G'
  };
  return mapping[subtype?.toLowerCase()] || null;
}

function mapAndroidGeneration(networkType) {
  const mapping = {
    'GPRS': '2G', 'EDGE': '2G', 'UMTS': '3G', 'LTE': '4G', 'NR': '5G'
  };
  return mapping[networkType] || null;
}
```

---

## Deployment Steps

### 1. Pre-Deployment
- [ ] Run full test suite
- [ ] Backup existing MongoDB database
- [ ] Review schema migration plan
- [ ] Notify stakeholders of deployment

### 2. Deployment
- [ ] Deploy updated backend code
- [ ] Create indexes in MongoDB (if not auto-created by Mongoose)
- [ ] Deploy updated frontend code
- [ ] Monitor error logs for issues

### 3. Post-Deployment
- [ ] Verify old and new measurements coexist
- [ ] Test API endpoints with both old/new data
- [ ] Monitor query performance
- [ ] Collect metrics on storage savings

### 4. Gradual Rollout
- [ ] Deploy to 10% of users first
- [ ] Monitor for issues (24 hours)
- [ ] Deploy to 50% (24 hours)
- [ ] Deploy to 100% if stable

---

## Verification Checklist

After implementation, verify:

### Database
- [ ] NetworkCell collection exists and has entries
- [ ] Measurement documents have `cellId` references
- [ ] Geospatial index exists on coordinates
- [ ] New fields are present in documents

### API
- [ ] `/api/measurements/bulk` accepts new fields
- [ ] `/api/measurements/mine` returns new fields
- [ ] `/api/admin/measurements` filters work:
  - [ ] `?networkGen=5G`
  - [ ] `?roaming=true`
  - [ ] `?city=NewYork`

### Frontend
- [ ] New fields are captured during measurement
- [ ] SQLite stores new columns
- [ ] Upload includes new fields
- [ ] Display shows new metrics

### Performance
- [ ] Geospatial queries execute in <100ms
- [ ] Storage size reduced significantly
- [ ] Query response times improved
- [ ] No N+1 query issues

---

## Rollback Plan

If critical issues occur:

1. **Immediate:** Disable new feature flags to prevent new data from new fields
2. **Short-term:** Revert backend to previous version (keep data)
3. **Medium-term:** Investigate issues in staging environment
4. **Long-term:** Fix issues and re-deploy with proper testing

Data is never deleted; old measurements remain queryable.

---

## Timeline Estimate

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Backend | ✅ Complete | ✅ Done |
| Frontend Capture | 2.1-2.4 | 30 mins |
| API Integration | 3.1-3.3 | 15 mins |
| UI Updates | 4.1-4.2 | 1.5 hrs |
| Testing | 5.1-5.4 | 2.5 hrs |
| **Total** | — | **4.5 hrs** |

---

## Support & Documentation

- **Reference:** [SCHEMA_REFACTORING.md](SCHEMA_REFACTORING.md)
- **ER Diagram:** [ERD_DOCUMENTATION.md](ERD_DOCUMENTATION.md)
- **Backend Code:** `backend/server.js`
- **Database Code:** `src/services/database.js`

---

**Last Updated:** June 15, 2026  
**Status:** Backend Complete / Frontend Pending
