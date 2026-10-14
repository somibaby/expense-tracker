import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../../../2-ui-kit/theme';

// A horizontal row of pills; exactly one is selected.
export default function CategoryFilter({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (option: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((c) => {
        const selected = value === c;
        return (
          <TouchableOpacity
            key={c}
            onPress={() => {
              onChange(c);
              Haptics.selectionAsync();
            }}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{c}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline },
  pillSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillText: { fontSize: 13, fontFamily: 'Manrope_600SemiBold', color: colors.ink },
  pillTextSelected: { color: colors.paper },
});
