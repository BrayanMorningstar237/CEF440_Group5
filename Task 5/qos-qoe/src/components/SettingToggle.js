import { Switch, Text, View } from 'react-native';

import { styles } from '../styles';

export function SettingToggle({ label, description, value, onChange }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
