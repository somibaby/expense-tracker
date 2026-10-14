import type { CategoryName, Transaction } from './types';

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function monthTxs(txs: Transaction[], d: Date) {
  const key = monthKey(d);
  return txs.filter((t) => t.date.startsWith(key));
}

export function monthSpent(txs: Transaction[], d: Date) {
  return monthTxs(txs, d).reduce((sum, t) => sum + t.amount, 0);
}

// Sum per category, biggest first.
export function totalsByCategory(txs: Transaction[]) {
  const map = new Map<CategoryName, number>();
  for (const t of txs) map.set(t.cat, (map.get(t.cat) ?? 0) + t.amount);
  return Array.from(map.entries())
    .map(([cat, total]) => ({ cat, total }))
    .sort((a, b) => b.total - a.total);
}

export function daysLeftInMonth(d: Date) {
  return daysInMonth(d) - d.getDate() + 1;
}

export function safeToSpendToday(budget: number, spent: number, d: Date) {
  return Math.max(0, (budget - spent) / daysLeftInMonth(d));
}

export function budgetPct(spent: number, budget: number) {
  if (budget <= 0) return 0;
  return Math.min(100, (spent / budget) * 100);
}

// true when on/under pace for the month so far.
export function isUnderPace(spent: number, budget: number, d: Date) {
  const paceTarget = (budget / daysInMonth(d)) * d.getDate();
  return spent <= paceTarget;
}

export function dateLabel(dateStr: string, d = new Date()) {
  const today = d.toISOString().slice(0, 10);
  const yesterday = new Date(d.getTime() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const parsed = new Date(dateStr + 'T00:00:00');
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function greeting(hour: number) {
  if (hour < 11) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
