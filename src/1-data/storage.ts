import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORY_NAMES, type CategoryName, type LedgerState, type Transaction } from './types';

const STORAGE_KEY = 'ledger.krw.v2';
export const DEFAULT_BUDGET = 1_800_000;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

function isCategoryName(v: unknown): v is CategoryName {
  return typeof v === 'string' && (CATEGORY_NAMES as readonly string[]).includes(v);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Never trust the stored blob. Coerce or drop each field independently so one
// corrupt record can't blank the whole app -- the prototype's v1 USD schema
// crashed on load unmigrated, which is the reason this exists.
function sanitizeTx(raw: unknown): Transaction | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const amount = Math.round(Number(r.amount));
  if (!Number.isFinite(amount) || amount <= 0) return null;

  let date: string;
  if (typeof r.date === 'string' && DATE_RE.test(r.date)) {
    date = r.date;
  } else if (typeof r.day === 'number' && r.day >= 1 && r.day <= 31) {
    const now = new Date();
    date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(r.day).padStart(2, '0')}`;
  } else {
    date = todayISO();
  }

  const time = typeof r.time === 'string' && TIME_RE.test(r.time) ? r.time : nowHHMM();
  const cat = isCategoryName(r.cat) ? r.cat : CATEGORY_NAMES[0];
  const name = typeof r.name === 'string' ? r.name : '';
  const id = typeof r.id === 'string' && r.id ? r.id : `${date}-${time}-${Math.random().toString(36).slice(2, 8)}`;
  const exported = r.exported !== false;

  return { id, name, cat, amount, date, time, exported };
}

export function sanitizeTxs(raw: unknown): Transaction[] {
  if (!Array.isArray(raw)) return [];
  const out: Transaction[] = [];
  for (const item of raw) {
    const tx = sanitizeTx(item);
    if (tx) out.push(tx);
  }
  return out;
}

function sanitizeBudget(raw: unknown): number {
  const n = Math.round(Number(raw));
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_BUDGET;
}

export async function loadLedger(): Promise<LedgerState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { txs: [], budget: DEFAULT_BUDGET };
    const parsed = JSON.parse(raw);
    return {
      txs: sanitizeTxs(parsed?.txs),
      budget: sanitizeBudget(parsed?.budget),
    };
  } catch {
    return { txs: [], budget: DEFAULT_BUDGET };
  }
}

export async function saveLedger(state: LedgerState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
