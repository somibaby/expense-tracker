import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CategoryName, Transaction } from './types';
import { DEFAULT_BUDGET, loadLedger, saveLedger, sanitizeTxs } from './storage';

type LedgerContextValue = {
  ready: boolean;
  txs: Transaction[];
  budget: number;
  notExportedCount: number;
  addTx: (input: { name: string; cat: CategoryName; amount: number; date?: string }) => void;
  deleteTx: (id: string) => void;
  setBudget: (amount: number) => void;
  markAllExported: () => void;
  clearAll: () => void;
};

const LedgerContext = createContext<LedgerContextValue | undefined>(undefined);

function nowParts() {
  const d = new Date();
  return {
    date: d.toISOString().slice(0, 10),
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [budget, setBudgetState] = useState(DEFAULT_BUDGET);

  useEffect(() => {
    loadLedger().then((state) => {
      setTxs(state.txs);
      setBudgetState(state.budget);
      setReady(true);
    });
  }, []);

  // Defensive at render time too, in case state was ever set from somewhere
  // that skipped the loader's sanitization -- one bad record must never blank
  // the app.
  const safeTxs = useMemo(() => sanitizeTxs(txs), [txs]);

  useEffect(() => {
    if (!ready) return;
    saveLedger({ txs: safeTxs, budget });
  }, [ready, safeTxs, budget]);

  const addTx = useCallback((input: { name: string; cat: CategoryName; amount: number; date?: string }) => {
    const { date: today, time } = nowParts();
    const tx: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      cat: input.cat,
      amount: input.amount,
      date: input.date ?? today,
      time,
      exported: false,
    };
    setTxs((prev) => [tx, ...prev]);
  }, []);

  const deleteTx = useCallback((id: string) => {
    setTxs((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setBudget = useCallback((amount: number) => {
    setBudgetState(Math.max(100_000, amount));
  }, []);

  const markAllExported = useCallback(() => {
    setTxs((prev) => prev.map((t) => ({ ...t, exported: true })));
  }, []);

  const clearAll = useCallback(() => {
    setTxs([]);
  }, []);

  const notExportedCount = useMemo(() => safeTxs.filter((t) => !t.exported).length, [safeTxs]);

  const value = useMemo<LedgerContextValue>(
    () => ({ ready, txs: safeTxs, budget, notExportedCount, addTx, deleteTx, setBudget, markAllExported, clearAll }),
    [ready, safeTxs, budget, notExportedCount, addTx, deleteTx, setBudget, markAllExported, clearAll]
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error('useLedger must be used within a LedgerProvider');
  return ctx;
}
