import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Transaction } from '../../../1-data/types';
import { formatAbbrev, formatCurrency } from '../../../2-ui-kit/format';
import { colors } from '../../../2-ui-kit/theme';
import Card from '../../../2-ui-kit/components/Card';

const WEEKDAY_COUNT = 7;

// A bar per day for the last seven days, today highlighted.
export default function WeekChartCard({ txs, now }: { txs: Transaction[]; now: Date }) {
  const last7 = useMemo(() => {
    const days: { key: string; label: string; total: number; isToday: boolean }[] = [];
    for (let i = WEEKDAY_COUNT - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const total = txs.filter((t) => t.date === key).reduce((s, t) => s + t.amount, 0);
      days.push({ key, label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3), total, isToday: i === 0 });
    }
    return days;
  }, [txs, now]);
  const max7 = Math.max(...last7.map((d) => d.total), 1);
  const total7 = last7.reduce((s, d) => s + d.total, 0);

  return (
    <Card title={`Last 7 days · ${formatCurrency(total7)}`}>
      <View style={styles.chart}>
        {last7.map((d) => {
          const height = 10 + 80 * (d.total / max7);
          return (
            <View key={d.key} style={styles.column}>
              <Text style={styles.value}>{formatAbbrev(d.total)}</Text>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { height, backgroundColor: d.isToday ? colors.ink : 'rgba(31,111,74,0.35)' },
                  ]}
                />
              </View>
              <Text style={styles.label}>{d.label}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 },
  column: { alignItems: 'center', flex: 1 },
  value: { fontSize: 10, color: colors.text2, fontFamily: 'IBMPlexMono_500Medium', marginBottom: 4 },
  track: { height: 90, justifyContent: 'flex-end' },
  fill: { width: 16, borderRadius: 4 },
  label: { fontSize: 11, color: colors.text3, marginTop: 6, fontFamily: 'Manrope_500Medium' },
});
