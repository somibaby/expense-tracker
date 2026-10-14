import React, { useMemo } from 'react';
import { useLedger } from '../../1-data/LedgerContext';
import Screen from '../../2-ui-kit/components/Screen';
import MonthOverMonthCard from './components/MonthOverMonthCard';
import HeatmapCard from './components/HeatmapCard';
import CategoryBreakdownCard from './components/CategoryBreakdownCard';

export default function InsightsScreen() {
  const { txs } = useLedger();
  const now = useMemo(() => new Date(), []);

  return (
    <Screen title="Insights">
      <MonthOverMonthCard txs={txs} now={now} />
      <HeatmapCard txs={txs} now={now} />
      <CategoryBreakdownCard txs={txs} now={now} />
    </Screen>
  );
}
