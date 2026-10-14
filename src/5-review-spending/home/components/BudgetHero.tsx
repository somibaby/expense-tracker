import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { budgetPct, daysLeftInMonth, isUnderPace, monthSpent, safeToSpendToday } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { colors, radius } from '../../../2-ui-kit/theme';

// The dark card at the top of Home: how much is safe to spend today, and how
// far through the monthly budget we are.
export default function BudgetHero({ txs, budget, now }: { txs: Transaction[]; budget: number; now: Date }) {
  const spent = useMemo(() => monthSpent(txs, now), [txs, now]);
  const daysLeft = daysLeftInMonth(now);
  const safeToday = safeToSpendToday(budget, spent, now);
  const pct = budgetPct(spent, budget);
  const underPace = isUnderPace(spent, budget, now);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>SAFE TO SPEND TODAY</Text>
          <Text style={styles.value}>{formatCurrency(safeToday)}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.daysLeft}>{daysLeft} days left</Text>
          <Text style={styles.pace}>{underPace ? '↓ under pace' : '↑ over pace'}</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>{formatCurrency(spent)} spent</Text>
        <Text style={styles.bottomText}>of {formatCurrency(budget)} budget</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.ink, borderRadius: radius.hero, padding: 20 },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.5)' },
  value: { fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 36, color: colors.paper, marginTop: 6 },
  right: { alignItems: 'flex-end' },
  daysLeft: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Manrope_500Medium' },
  pace: { color: colors.accentSoft, fontSize: 12, fontFamily: 'Manrope_600SemiBold', marginTop: 4 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden', marginTop: 18 },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.accentSoft },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  bottomText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Manrope_500Medium' },
});
