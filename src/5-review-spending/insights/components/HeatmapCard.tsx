import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { daysInMonth, monthTxs } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { colors } from '../../../2-ui-kit/theme';
import Card from '../../../2-ui-kit/components/Card';

// Blend two '#rrggbb' colors; t=0 gives `from`, t=1 gives `to`.
function lerpColor(from: string, to: string, t: number) {
  const f = parseInt(from.slice(1), 16);
  const s = parseInt(to.slice(1), 16);
  const fr = (f >> 16) & 255, fg = (f >> 8) & 255, fb = f & 255;
  const sr = (s >> 16) & 255, sg = (s >> 8) & 255, sb = s & 255;
  const r = Math.round(fr + (sr - fr) * t);
  const g = Math.round(fg + (sg - fg) * t);
  const b = Math.round(fb + (sb - fb) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// One cell per day of the current month; the more spent, the darker the cell.
export default function HeatmapCard({ txs, now }: { txs: Transaction[]; now: Date }) {
  const days = useMemo(() => {
    const dayTotals = new Map<number, number>();
    for (const t of monthTxs(txs, now)) {
      const day = Number(t.date.slice(8, 10));
      dayTotals.set(day, (dayTotals.get(day) ?? 0) + t.amount);
    }
    const max = Math.max(...Array.from(dayTotals.values()), 1);
    const today = now.getDate();
    return Array.from({ length: daysInMonth(now) }, (_, i) => {
      const day = i + 1;
      const total = dayTotals.get(day) ?? 0;
      return { day, total, k: Math.min(1, total / max), isFuture: day > today };
    });
  }, [txs, now]);

  return (
    <Card title="Daily heatmap">
      <View style={styles.grid}>
        {days.map((d) => {
          const bg = d.isFuture ? 'rgba(0,0,0,0.03)' : lerpColor('#EFF8F3', colors.accent, d.k);
          const labelColor = !d.isFuture && d.k > 0.55 ? '#fff' : colors.text2;
          return (
            <View key={d.day} style={styles.cellWrap}>
              <View style={[styles.cell, { backgroundColor: bg }]}>
                <Text style={[styles.day, { color: labelColor }]}>{d.day}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: '14.2857%', padding: 3 },
  cell: {
    aspectRatio: 1,
    borderRadius: 6,
    padding: 4,
    alignItems: 'flex-end',
  },
  day: { fontSize: 9, fontFamily: 'IBMPlexMono_500Medium' },
});
