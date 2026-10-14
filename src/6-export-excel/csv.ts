import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import type { Transaction } from '../1-data/types';

function csvField(value: string) {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function oldestFirst(txs: Transaction[]) {
  return [...txs].sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
}

export function exportFilename() {
  return `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
}

export function buildCsv(txs: Transaction[]) {
  const header = ['Date', 'Category', 'Description', 'Amount (KRW)', 'Time'];
  const rows = oldestFirst(txs).map((t) => [t.date, t.cat, t.name, String(t.amount), t.time]);
  const lines = [header, ...rows].map((row) => row.map(csvField).join(','));
  // BOM so Excel reads Korean text correctly; CRLF per RFC 4180.
  return '﻿' + lines.join('\r\n') + '\r\n';
}

export function buildClipboardRows(txs: Transaction[]) {
  return oldestFirst(txs)
    .map((t) => [t.date, t.cat, t.name, String(t.amount), t.time].join('\t'))
    .join('\n');
}

export async function exportCsvFile(txs: Transaction[]) {
  const filename = exportFilename();
  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(buildCsv(txs));

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'Download for Excel' });
  }
  return filename;
}

export async function copyRowsToClipboard(txs: Transaction[]): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(buildClipboardRows(txs));
    return true;
  } catch {
    return false;
  }
}
