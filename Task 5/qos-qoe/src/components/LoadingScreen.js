import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../styles';

export function LoadingScreen({ text }) {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <ActivityIndicator color="#1769e0" size="large" />
      <Text style={styles.loadingText}>{text}</Text>
    </SafeAreaView>
  );
}
