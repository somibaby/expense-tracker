export function formatCurrency(n: number) {
  return '₩' + Math.round(n).toLocaleString('en-US');
}

// "62k", "8.9k", "–" for zero
export function formatAbbrev(n: number) {
  if (n === 0) return '–';
  if (n >= 10000) return Math.round(n / 1000) + 'k';
  return (n / 1000).toFixed(1) + 'k';
}
