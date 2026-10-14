# 1 · Data — what an expense is and where it lives

Every other folder reads from or writes to this one. Start here.

Read in this order:

1. `types.ts` — a `Transaction` (amount, category, date, note, exported flag)
2. `LedgerContext.tsx` — the single store. Screens call `useLedger()` to get
   `txs`/`budget` and the actions `addTx`, `deleteTx`, `setBudget`,
   `markAllExported`, `clearAll`
3. `storage.ts` — load on startup, save after every change (AsyncStorage),
   repairing bad records instead of crashing
4. `derived.ts` — pure math on the data: month totals, per-category sums,
   safe-to-spend-today, budget pace

Flow: `loadLedger()` → React state → any change → `saveLedger()`
