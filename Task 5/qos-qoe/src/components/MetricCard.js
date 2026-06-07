import { Text, View } from 'react-native';

import { styles } from '../styles';

export function MetricCard({ label, value, tone }) {
  const strong = tone === 'strong';
  return (
    <View style={[styles.metricCard, strong && styles.metricCardStrong]}>
      <View style={[styles.metricAccent, strong && styles.metricAccentStrong]} />
      <View>
        <Text style={[styles.metricLabel, strong && styles.metricTextStrong]}>{label}</Text>
        <Text style={[styles.metricValue, strong && styles.metricTextStrong]}>{value}</Text>
      </View>
    </View>
  );
}
