import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { monthTxs, totalsByCategory } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { categoryColors, colors } from '../../../2-ui-kit/theme';
import Card from '../../../2-ui-kit/components/Card';

// Every category spent in this month, each bar sized against the biggest.
export default function CategoryBreakdownCard({ txs, now }: { txs: Transaction[]; now: Date }) {
  const byCategory = useMemo(() => totalsByCategory(monthTxs(txs, now)), [txs, now]);
  const maxCategory = byCategory[0]?.total ?? 1;

  return (
    <Card title="Where it goes · this month">
      {byCategory.length === 0 ? (
        <Text style={styles.empty}>No spending yet this month.</Text>
      ) : (
        byCategory.map((c) => (
          <View key={c.cat} style={styles.row}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{c.cat}</Text>
              <Text style={styles.amount}>{formatCurrency(c.total)}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${(c.total / maxCategory) * 100}%`, backgroundColor: categoryColors[c.cat] },
                ]}
              />
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.text2, fontSize: 13, fontFamily: 'Manrope_500Medium' },
  row: { marginBottom: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 13, fontFamily: 'Manrope_600SemiBold', color: colors.ink },
  amount: { fontSize: 13, fontFamily: 'IBMPlexMono_500Medium', color: colors.text2 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
