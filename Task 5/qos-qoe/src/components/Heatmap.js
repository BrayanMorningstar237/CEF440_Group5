import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { styles } from '../styles';
import { formatNumber, normalizePoint } from '../utils/format';

export function Heatmap({ fullScreen, points, title = 'Heat Mapping Tool' }) {
  const mapRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const validPoints = points.map(normalizePoint).filter((point) => point.latitude && point.longitude);
  const initialRegion = useMemo(() => {
    if (validPoints.length === 0) {
      return { latitude: 6.5244, longitude: 3.3792, latitudeDelta: 0.08, longitudeDelta: 0.08 };
    }
    const bounds = validPoints.reduce(
      (acc, point) => ({
        minLat: Math.min(acc.minLat, point.latitude),
        maxLat: Math.max(acc.maxLat, point.latitude),
        minLng: Math.min(acc.minLng, point.longitude),
        maxLng: Math.max(acc.maxLng, point.longitude),
      }),
      {
        minLat: validPoints[0].latitude,
        maxLat: validPoints[0].latitude,
        minLng: validPoints[0].longitude,
        maxLng: validPoints[0].longitude,
      }
    );
    return {
      latitude: (bounds.minLat + bounds.maxLat) / 2,
      longitude: (bounds.minLng + bounds.maxLng) / 2,
      latitudeDelta: Math.max(bounds.maxLat - bounds.minLat, 0.02) * 1.8,
      longitudeDelta: Math.max(bounds.maxLng - bounds.minLng, 0.02) * 1.8,
    };
  }, [validPoints]);

  // Automatically pan/zoom the map to the filtered results
  useEffect(() => {
    if (validPoints.length > 0 && mapRef.current) {
      const bounds = validPoints.reduce(
        (acc, point) => ({
          minLat: Math.min(acc.minLat, point.latitude),
          maxLat: Math.max(acc.maxLat, point.latitude),
          minLng: Math.min(acc.minLng, point.longitude),
          maxLng: Math.max(acc.maxLng, point.longitude),
        }),
        {
          minLat: validPoints[0].latitude,
          maxLat: validPoints[0].latitude,
          minLng: validPoints[0].longitude,
          maxLng: validPoints[0].longitude,
        }
      );

      mapRef.current.animateToRegion({
        latitude: (bounds.minLat + bounds.maxLat) / 2,
        longitude: (bounds.minLng + bounds.maxLng) / 2,
        latitudeDelta: Math.max(bounds.maxLat - bounds.minLat, 0.02) * 1.8,
        longitudeDelta: Math.max(bounds.maxLng - bounds.minLng, 0.02) * 1.8,
      }, 1000);
    }
    // Clear selection when points change (filter applied)
    setSelectedPoint(null);
  }, [validPoints]);

  return (
    <View style={[styles.mapFrame, fullScreen && styles.mapFrameFull]}>
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        mapType="hybrid"
        showsCompass={false}
        showsUserLocation
        style={styles.map}
        toolbarEnabled={false}
      >
        {validPoints.map((point) => (
          <Fragment key={`hotspot-${point.id}`}>
            <Circle
              center={{ latitude: point.latitude, longitude: point.longitude }}
              fillColor="rgba(18, 230, 39, 0.34)"
              radius={Math.max(180, Math.min(760, (point.latency ?? 80) * 4.2))}
              strokeColor="rgba(18, 230, 39, 0.18)"
              strokeWidth={1}
            />
            <Circle
              center={{ latitude: point.latitude, longitude: point.longitude }}
              fillColor="rgba(255, 224, 30, 0.58)"
              radius={Math.max(105, Math.min(460, (point.latency ?? 80) * 2.55))}
              strokeColor="rgba(255, 224, 30, 0.2)"
              strokeWidth={1}
            />
            <Circle
              center={{ latitude: point.latitude, longitude: point.longitude }}
              fillColor="rgba(255, 35, 35, 0.76)"
              radius={Math.max(52, Math.min(230, (point.latency ?? 80) * 1.25))}
              strokeColor="rgba(255, 255, 255, 0.65)"
              strokeWidth={1}
            />
          </Fragment>
        ))}
        {validPoints.slice(0, 60).map((point) => (
          <Marker
            key={`marker-${point.id}`}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            description={`${formatNumber(point.latency, ' ms')} latency, ${formatNumber(point.download, ' Mbps')} download`}
            onPress={() => setSelectedPoint(point)}
            pinColor={point.color}
            title={point.userName ?? point.provider ?? point.network ?? 'Network sample'}
          />
        ))}
      </MapView>
      <View style={styles.mapToolbar}>
        <Text style={styles.mapToolbarTitle}>{title}</Text>
        <Text style={styles.mapToolbarMeta}>{validPoints.length} samples</Text>
      </View>
      {validPoints.length === 0 && (
        <View style={styles.mapEmpty}>
          <Text style={styles.emptyText}>Collect or upload location samples to populate the map</Text>
        </View>
      )}
      <View style={styles.mapLegend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.legendDense]} />
          <Text style={styles.legendText}>Dense</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.legendMedium]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.legendLight]} />
          <Text style={styles.legendText}>Light</Text>
        </View>
      </View>
      {selectedPoint && (
        <View style={styles.mapInspector}>
          <View style={styles.inspectorTop}>
            <View>
              <Text style={styles.inspectorName}>{selectedPoint.userName ?? 'Unknown user'}</Text>
              <Text style={styles.inspectorEmail}>{selectedPoint.userEmail ?? selectedPoint.provider ?? 'Network sample'}</Text>
            </View>
            <Pressable onPress={() => setSelectedPoint(null)} style={styles.inspectorClose}>
              <Text style={styles.inspectorCloseText}>x</Text>
            </Pressable>
          </View>
          <View style={styles.inspectorStats}>
            <Text style={styles.inspectorStat}>{formatNumber(selectedPoint.download, ' Mbps')}</Text>
            <Text style={styles.inspectorStat}>{formatNumber(selectedPoint.latency, ' ms')}</Text>
            <Text style={styles.inspectorStat}>{formatNumber(selectedPoint.jitterMs ?? selectedPoint.jitter_ms, ' ms')}</Text>
          </View>
          <Text style={styles.inspectorLocation}>
            {[selectedPoint.city, selectedPoint.region, selectedPoint.country].filter(Boolean).join(', ') || 'No location label yet'}
          </Text>
        </View>
      )}
    </View>
  );
}
