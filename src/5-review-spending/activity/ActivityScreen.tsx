import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLedger } from '../../1-data/LedgerContext';
import { monthTxs, totalsByCategory } from '../../1-data/derived';
import type { Transaction } from '../../1-data/types';
import { colors } from '../../2-ui-kit/theme';
import Screen from '../../2-ui-kit/components/Screen';
import CategoryFilter from './components/CategoryFilter';
import DayGroup from './components/DayGroup';

const FILTER_CATEGORY_COUNT = 4;

export default function ActivityScreen() {
  const { txs, deleteTx } = useLedger();
  const [filter, setFilter] = useState<string>('All');
  const now = useMemo(() => new Date(), []);

  // The filter pills offer this month's biggest categories, not all seven.
  const topCategories = useMemo(
    () =>
      totalsByCategory(monthTxs(txs, now))
        .slice(0, FILTER_CATEGORY_COUNT)
        .map((c) => c.cat),
    [txs, now]
  );

  const filtered = useMemo(
    () => (filter === 'All' ? txs : txs.filter((t) => t.cat === filter)),
    [txs, filter]
  );

  // One group per day, newest day first, newest entry first within a day.
  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const arr = map.get(t.date) ?? [];
      arr.push(t);
      map.set(t.date, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({
        date,
        total: items.reduce((s, t) => s + t.amount, 0),
        items: [...items].sort((a, b) => (a.time < b.time ? 1 : -1)),
      }));
  }, [filtered]);

  return (
    <Screen title="Transactions">
      <CategoryFilter options={['All', ...topCategories]} value={filter} onChange={setFilter} />

      {groups.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No transactions to show.</Text>
        </View>
      ) : (
        groups.map((g) => (
          <DayGroup key={g.date} date={g.date} total={g.total} items={g.items} now={now} onDelete={deleteTx} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyBox: { borderWidth: 1, borderColor: colors.hairline, borderStyle: 'dashed', borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyText: { color: colors.text2, fontSize: 13, fontFamily: 'Manrope_500Medium' },
});
