import { Text, TextInput, View } from 'react-native';

import { styles } from '../styles';

export function ThresholdInput({ label, value, suffix, onChange }) {
  return (
    <View style={styles.thresholdRow}>
      <Text style={styles.thresholdLabel}>{label}</Text>
      <View style={styles.thresholdInputWrap}>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => onChange(Number(text) || 0)}
          style={styles.thresholdInput}
          value={String(value)}
        />
        <Text style={styles.thresholdSuffix}>{suffix}</Text>
      </View>
    </View>
  );
}
