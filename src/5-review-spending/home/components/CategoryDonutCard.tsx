import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { monthTxs, totalsByCategory } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { categoryColors, colors } from '../../../2-ui-kit/theme';
import Card from '../../../2-ui-kit/components/Card';
import DonutChart from './DonutChart';

// This month's spending split by category: a donut plus the top three.
export default function CategoryDonutCard({ txs, now }: { txs: Transaction[]; now: Date }) {
  const byCategory = useMemo(() => totalsByCategory(monthTxs(txs, now)), [txs, now]);

  return (
    <Card title="By category">
      {byCategory.length === 0 ? (
        <Text style={styles.empty}>No spending yet this month.</Text>
      ) : (
        <View style={styles.row}>
          <DonutChart
            slices={byCategory.map((c) => ({ color: categoryColors[c.cat], value: c.total }))}
            centerLabel={String(byCategory.length)}
          />
          <View style={styles.legend}>
            {byCategory.slice(0, 3).map((c) => (
              <View key={c.cat} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: categoryColors[c.cat] }]} />
                <Text style={styles.legendName}>{c.cat}</Text>
                <Text style={styles.legendAmount}>{formatCurrency(c.total)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.text2, fontSize: 13, fontFamily: 'Manrope_500Medium' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  legend: { flex: 1, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 8 },
  legendName: { flex: 1, fontSize: 13, color: colors.ink, fontFamily: 'Manrope_600SemiBold' },
  legendAmount: { fontSize: 13, color: colors.text2, fontFamily: 'IBMPlexMono_500Medium' },
});
