# 3 · App shell — how the app is put together

Start at `/App.tsx`: it loads fonts, then wraps everything in providers
(Ledger → Toast → Sheet) and renders the tabs, the add-expense sheet and
the toast on top.

- `AppTabs.tsx` — the bottom tabs: Home, Activity, **+**, Insights, Excel.
  The **+** isn't a real screen; it opens the add-expense sheet
  (step 4). The Excel tab shows a badge with the count of unexported entries.
- `types.ts` — the list of tab names (for typed navigation)
- `navigationRef.ts` — lets the sheet, which sits outside the tabs, jump
  back to Home after saving
