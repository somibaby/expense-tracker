import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { dateLabel } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { colors, radius } from '../../../2-ui-kit/theme';

// One day's transactions: a date + total header above a card of rows, each
// with a delete button.
export default function DayGroup({
  date,
  total,
  items,
  now,
  onDelete,
}: {
  date: string;
  total: number;
  items: Transaction[];
  now: Date;
  onDelete: (id: string) => void;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.date}>{dateLabel(date, now)}</Text>
        <Text style={styles.total}>{formatCurrency(total)}</Text>
      </View>
      <View style={styles.card}>
        {items.map((t, idx) => (
          <View key={t.id} style={[styles.row, idx > 0 && styles.rowDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowName}>{t.name || t.cat}</Text>
              <Text style={styles.rowMeta}>
                {t.cat} · {t.time}
              </Text>
            </View>
            <Text style={styles.rowAmount}>{formatCurrency(t.amount)}</Text>
            <TouchableOpacity
              style={styles.deleteHit}
              onPress={() => {
                onDelete(t.id);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 13, fontFamily: 'Manrope_700Bold', color: colors.text2 },
  total: { fontSize: 13, fontFamily: 'IBMPlexMono_600SemiBold', color: colors.text2 },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
  rowName: { fontSize: 14, fontFamily: 'Manrope_600SemiBold', color: colors.ink },
  rowMeta: { fontSize: 11, color: colors.text2, marginTop: 2, fontFamily: 'Manrope_500Medium' },
  rowAmount: { fontSize: 14, fontFamily: 'IBMPlexMono_600SemiBold', color: colors.ink, marginRight: 4 },
  deleteHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontSize: 20, color: colors.text3 },
});
