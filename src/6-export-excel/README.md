# 6 · Export to Excel (and settings)

Getting data out, plus the monthly budget and the clear-data option.

1. `ExcelScreen.tsx` — stacks the four cards
2. `components/ExportCard.tsx` — Download CSV / Copy rows →
   `markAllExported()` (clears the tab badge) → toast
3. `csv.ts` — builds the file (Korean-safe BOM, CRLF, quoting) and
   shares / copies it
4. `components/BudgetCard.tsx` — `setBudget()`
5. `components/DataCard.tsx` — `clearAll()`
6. `components/ColumnsCard.tsx` — static explanation of the CSV columns
