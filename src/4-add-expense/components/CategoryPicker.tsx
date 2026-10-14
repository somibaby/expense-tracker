import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CATEGORY_NAMES, type CategoryName } from '../../1-data/types';
import { categoryColors, colors, radius } from '../../2-ui-kit/theme';

// A horizontal row with one pill per category, each with its color dot.
export default function CategoryPicker({ value, onChange }: { value: CategoryName; onChange: (cat: CategoryName) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CATEGORY_NAMES.map((c) => {
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
            <View style={[styles.dot, { backgroundColor: categoryColors[c] }]} />
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{c}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  pillSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pillText: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  pillTextSelected: { color: colors.paper },
});
