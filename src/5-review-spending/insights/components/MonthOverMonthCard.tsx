import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { monthKey } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { colors } from '../../../2-ui-kit/theme';
import Card from '../../../2-ui-kit/components/Card';

const MONTH_COUNT = 3;

// Totals for the latest few months that have any spending, oldest on top.
export default function MonthOverMonthCard({ txs, now }: { txs: Transaction[]; now: Date }) {
  const months = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of txs) map.set(t.date.slice(0, 7), (map.get(t.date.slice(0, 7)) ?? 0) + t.amount);
    const newestFirst = Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
    return newestFirst.slice(0, MONTH_COUNT).reverse();
  }, [txs]);
  const maxMonth = Math.max(...months.map(([, v]) => v), 1);
  const currentKey = monthKey(now);

  return (
    <Card title="Month over month">
      {months.map(([key, value]) => {
        const isCurrent = key === currentKey;
        const label = new Date(key + '-01T00:00:00').toLocaleDateString(undefined, { month: 'long' });
        return (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${(value / maxMonth) * 100}%`, backgroundColor: isCurrent ? colors.accent : 'rgba(0,0,0,0.16)' },
                ]}
              />
            </View>
            <Text style={styles.amount}>{formatCurrency(value)}</Text>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 70, fontSize: 12, color: colors.text2, fontFamily: 'Manrope_600SemiBold' },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.divider, overflow: 'hidden', marginHorizontal: 8 },
  fill: { height: '100%', borderRadius: 5 },
  amount: { width: 82, textAlign: 'right', fontSize: 12, fontFamily: 'IBMPlexMono_500Medium', color: colors.ink },
});
