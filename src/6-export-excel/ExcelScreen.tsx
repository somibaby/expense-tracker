import React from 'react';
import Screen from '../2-ui-kit/components/Screen';
import ExportCard from './components/ExportCard';
import BudgetCard from './components/BudgetCard';
import ColumnsCard from './components/ColumnsCard';
import DataCard from './components/DataCard';

export default function ExcelScreen() {
  return (
    <Screen title="Excel">
      <ExportCard />
      <BudgetCard />
      <ColumnsCard />
      <DataCard />
    </Screen>
  );
}
