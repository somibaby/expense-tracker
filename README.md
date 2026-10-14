# Expense Tracker (KRW, offline)

A daily expense tracker for a single Korean-won user, built with Expo (React
Native + TypeScript). Everything lives on your device — there's no account,
no login, and no network calls. When you want your data in Excel, export a
CSV or copy rows straight to the clipboard.

## What it does

- Log expenses in a few taps: amount keypad, category, optional note
- **Home** — a dashboard: safe-to-spend-today, this month's budget progress,
  spending by category (donut), the last 7 days, and your most recent entries
- **Activity** — every transaction, grouped by day, filterable by category
- **Insights** — month-over-month totals, a daily spending heatmap, and a
  full category breakdown for the current month
- **Excel** — download a `.csv` (Korean-text-safe, opens cleanly in Excel) or
  copy tab-separated rows to paste directly into a spreadsheet; also where
  you set your monthly budget
- Nothing leaves the device until you tap export

## Run it

```bash
npm install
npm start
```

Scan the QR code with **Expo Go** (iOS/Android) to run it on your phone, or
press `w` in the terminal to try it in a browser via `npm run web`.

## Project structure

The code is grouped by **workflow** and numbered in reading order, so the
file explorer doubles as a learning path. Each folder has its own
`README.md` that walks through its flow file by file.

```
App.tsx                        Entry point: fonts, providers, tabs, sheet, toast
src/
  1-data/                      What an expense is and where it lives
                               types, LedgerContext (the store), storage
                               (AsyncStorage), derived (budget/pace math)
  2-ui-kit/                    Shared building blocks: theme, format,
                               components/ (Screen, Card), hooks/, toast/
  3-app-shell/                 Bottom tabs with the raised "+" button,
                               navigation types and ref
  4-add-expense/               "+" → form → save → back to Home + toast
                               AddExpenseSheet, SheetContext,
                               useSheetAnimation, components/ (Keypad,
                               CategoryPicker, DateField)
  5-review-spending/           The read-only tabs
    home/                        Dashboard: budget, donut, week, recent
    activity/                    All transactions by day, category filter
    insights/                    Month-over-month, heatmap, breakdown
  6-export-excel/              CSV download / copy rows, budget, clear data
```

### Suggested reading order

Follow the numbers:

1. `src/1-data/` — the data model and the single store everything uses
2. `src/2-ui-kit/` — skim; come back when a screen imports from it
3. `App.tsx`, then `src/3-app-shell/` — how the app is assembled
4. `src/4-add-expense/` — the write path: how a new expense gets in
5. `src/5-review-spending/` — the read path: screens → cards → `derived.ts`
6. `src/6-export-excel/` — how data gets out again

## Data & persistence

All data is stored under one AsyncStorage key (`ledger.krw.v2`) as
`{ txs, budget }`, written after every change. On load, every record is
validated and repaired independently — a corrupt or old-format entry is
coerced to something sane or dropped, rather than crashing the app. Bump the
storage key if you ever change the schema.

## Troubleshooting

- **Fonts look like the system default briefly on launch** — Manrope and IBM
  Plex Mono load asynchronously; the app shows a blank loading screen until
  they're ready, which should be near-instant after the first launch.
- **Export button does nothing on web** — the native share sheet isn't
  available in a browser; use "Copy rows" there instead, or test the download
  flow in Expo Go on a real device.
