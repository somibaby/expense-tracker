import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { dateLabel } from '../../../1-data/derived';
import type { Transaction } from '../../../1-data/types';
import { formatCurrency } from '../../../2-ui-kit/format';
import { categoryColors, colors, initials, radius, spacing } from '../../../2-ui-kit/theme';

const RECENT_COUNT = 4;

// The newest few entries, with a link through to the full Activity tab.
export default function RecentList({ txs, now, onSeeAll }: { txs: Transaction[]; now: Date; onSeeAll: () => void }) {
  const recent = useMemo(
    () =>
      [...txs]
        .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1))
        .slice(0, RECENT_COUNT),
    [txs]
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {txs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No entries yet. Tap + to log your first expense.</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.rowGap }}>
          {recent.map((t) => (
            <View key={t.id} style={styles.row}>
              <View style={[styles.tile, { backgroundColor: categoryColors[t.cat] + '26' }]}>
                <Text style={[styles.tileText, { color: categoryColors[t.cat] }]}>{initials(t.cat)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.rowName}>{t.name || t.cat}</Text>
                <Text style={styles.rowMeta}>
                  {t.cat} · {dateLabel(t.date, now)} {t.time}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.rowAmount}>{formatCurrency(t.amount)}</Text>
                <Text style={[styles.rowStatus, t.exported ? styles.statusExported : styles.statusNew]}>
                  {t.exported ? 'EXPORTED' : 'NEW'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 15, color: colors.ink },
  seeAll: { color: colors.accent, fontSize: 13, fontFamily: 'Manrope_600SemiBold' },
  emptyBox: { borderWidth: 1, borderColor: colors.hairline, borderStyle: 'dashed', borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyText: { color: colors.text2, fontSize: 13, textAlign: 'center', fontFamily: 'Manrope_500Medium' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.row, borderWidth: 1, borderColor: colors.hairline, padding: 12 },
  tile: { width: 34, height: 34, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  tileText: { fontSize: 12, fontFamily: 'Manrope_700Bold' },
  rowName: { fontSize: 14, fontFamily: 'Manrope_600SemiBold', color: colors.ink },
  rowMeta: { fontSize: 11, color: colors.text2, marginTop: 2, fontFamily: 'Manrope_500Medium' },
  rowAmount: { fontSize: 14, fontFamily: 'IBMPlexMono_600SemiBold', color: colors.ink },
  rowStatus: { fontSize: 9, fontFamily: 'Manrope_700Bold', letterSpacing: 0.4, marginTop: 3 },
  statusExported: { color: colors.text3 },
  statusNew: { color: colors.warn },
});
