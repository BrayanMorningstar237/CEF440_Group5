import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

export function RatingRow({ label, value, onChange }) {
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingButtons}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Pressable
            key={rating}
            onPress={() => onChange(rating)}
            style={[styles.ratingButton, value === rating && styles.ratingButtonActive]}
          >
            <Text style={[styles.ratingText, value === rating && styles.ratingTextActive]}>{rating}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
