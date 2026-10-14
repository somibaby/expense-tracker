# 4 · Add an expense

The main write path: **+** → fill form → save.

1. `SheetContext.tsx` — `open()` / `close()`; the **+** button calls `open()`
2. `AddExpenseSheet.tsx` — the form; `save()` does the whole workflow:
   `addTx(...)` (step 1 data) → `close()` → `navigateToHome()` → `showToast(...)`
3. `useSheetAnimation.ts` — the slide-up / fade animation
4. `components/` — `Keypad` (amount), `CategoryPicker`, `DateField`
