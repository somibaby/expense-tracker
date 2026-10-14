# 5 · Review spending

Three read-only tabs over the same data. Each screen calls `useLedger()`,
then hands `txs`/`budget` to small cards as props; the cards use
`1-data/derived.ts` for the math.

- `home/` — today's dashboard: budget hero, category donut, last 7 days,
  recent entries
- `activity/` — every transaction grouped by day, filterable by category
- `insights/` — month-over-month, daily heatmap, category breakdown
