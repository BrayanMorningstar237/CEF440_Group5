import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { styles } from '../styles';
import { formatNumber } from '../utils/format';

export function Speedometer({ active, metrics }) {
  const spin = useRef(new Animated.Value(0)).current;
  const download = Number(metrics?.downloadMbps ?? 0);
  const latency = metrics?.latencyMs ?? null;
  const score = Math.min(100, Math.max(0, download));

  useEffect(() => {
    if (active) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(spin, { duration: 400, toValue: 0.9, useNativeDriver: true }),
          Animated.timing(spin, { duration: 300, toValue: 0.1, useNativeDriver: true }),
          Animated.timing(spin, { duration: 500, toValue: 0.7, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      Animated.spring(spin, {
        toValue: score / 100,
        useNativeDriver: true,
        stiffness: 60,
        damping: 12,
        mass: 1,
      }).start();
    }
  }, [active, score]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['-118deg', '118deg'],
  });

  const gaugeTicks = [0, 20, 40, 60, 80, 100];

  return (
    <View style={styles.speedPanel}>
      <View style={styles.speedGauge}>
        <View style={styles.speedArc} />
        {gaugeTicks.map((val, i) => {
          const angle = (i * 47.2) - 118; // 236 degrees total / 5 segments
          return (
            <View key={val} style={[styles.speedTick, { transform: [{ rotate: `${angle}deg` }, { translateY: -78 }] }]}>
              <Text style={[styles.speedTickText, { transform: [{ rotate: `${-angle}deg` }] }]}>{val}</Text>
            </View>
          );
        })}
        <Animated.View style={[styles.speedNeedle, { transform: [{ rotate }] }]} />
        <View style={styles.speedHub} />
      </View>
      <View style={styles.speedResult}>
        <Text style={styles.speedValue}>{active ? '...' : formatNumber(download)}</Text>
        <Text style={styles.speedUnit}>{active ? '' : 'Mbps'}</Text>
        <Text style={styles.speedLabel}>{active ? 'Testing network' : 'Download'}</Text>
      </View>
      <View style={styles.speedStats}>
        <View style={styles.speedStat}>
          <Text style={styles.speedStatValue}>{formatNumber(latency, ' ms')}</Text>
          <Text style={styles.speedStatLabel}>Latency</Text>
        </View>
        <View style={styles.speedStat}>
          <Text style={styles.speedStatValue}>{formatNumber(metrics?.uploadMbps, ' Mbps')}</Text>
          <Text style={styles.speedStatLabel}>Upload</Text>
        </View>
        <View style={styles.speedStat}>
          <Text style={styles.speedStatValue}>{formatNumber(metrics?.packetLossPercent, '%')}</Text>
          <Text style={styles.speedStatLabel}>Loss</Text>
        </View>
      </View>
    </View>
  );
}
