import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../2-ui-kit/theme';
import Card from '../../2-ui-kit/components/Card';

// Mirrors the header row that ../csv.ts writes.
const COLUMNS: { col: string; name: string; sample: string }[] = [
  { col: 'A', name: 'Date', sample: '2026-09-07' },
  { col: 'B', name: 'Category', sample: 'Food' },
  { col: 'C', name: 'Description', sample: 'Lunch with team' },
  { col: 'D', name: 'Amount (KRW)', sample: '12000' },
  { col: 'E', name: 'Time', sample: '12:30' },
];

export default function ColumnsCard() {
  return (
    <Card title="Columns exported">
      {COLUMNS.map((c) => (
        <View key={c.col} style={styles.row}>
          <Text style={styles.letter}>{c.col}</Text>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.sample}>{c.sample}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.divider },
  letter: { width: 20, fontSize: 12, color: colors.text3, fontFamily: 'IBMPlexMono_500Medium' },
  name: { flex: 1, fontSize: 13, color: colors.ink, fontFamily: 'Manrope_600SemiBold' },
  sample: { fontSize: 12, color: colors.text2, fontFamily: 'IBMPlexMono_500Medium' },
});
