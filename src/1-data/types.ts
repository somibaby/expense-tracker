export const CATEGORY_NAMES = [
  'Food',
  'Groceries',
  'Transport',
  'Cafe',
  'Home',
  'Health',
  'Fun',
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export type Transaction = {
  id: string;
  name: string;
  cat: CategoryName;
  amount: number; // integer KRW
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h, local)
  exported: boolean;
};

export type NewTransaction = {
  name: string;
  cat: CategoryName;
  amount: number;
};

export type LedgerState = {
  txs: Transaction[];
  budget: number;
};
