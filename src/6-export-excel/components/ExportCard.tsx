import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLedger } from '../../1-data/LedgerContext';
import { useToast } from '../../2-ui-kit/toast/ToastContext';
import { colors, radius } from '../../2-ui-kit/theme';
import Card from '../../2-ui-kit/components/Card';
import { copyRowsToClipboard, exportCsvFile, exportFilename } from '../csv';

// Download a .csv or copy rows to the clipboard. Either one marks every
// entry as exported.
export default function ExportCard() {
  const { txs, notExportedCount, markAllExported } = useLedger();
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const filename = exportFilename();
  const statusLine =
    notExportedCount > 0
      ? `${notExportedCount} new entr${notExportedCount === 1 ? 'y' : 'ies'} since last export`
      : `${txs.length} rows · all exported`;

  const handleDownload = async () => {
    setDownloading(true);
    await exportCsvFile(txs);
    const count = txs.length;
    markAllExported();
    setDownloading(false);
    showToast(`Downloaded ${count} rows`);
  };

  const handleCopy = async () => {
    const ok = await copyRowsToClipboard(txs);
    if (ok) {
      markAllExported();
      showToast('Rows copied → paste into Excel');
    } else {
      showToast('Copy blocked — use the download instead');
    }
  };

  return (
    <Card>
      <View style={styles.fileRow}>
        <View style={styles.fileTile}>
          <Text style={styles.fileTileText}>XL</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.filename}>{filename}</Text>
          <Text style={styles.statusLine}>{statusLine}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleDownload} disabled={downloading || txs.length === 0}>
        {downloading ? (
          <ActivityIndicator color={colors.paper} />
        ) : (
          <Text style={styles.primaryButtonText}>Download for Excel (.csv)</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleCopy} disabled={txs.length === 0}>
        <Text style={styles.secondaryButtonText}>Copy rows → paste into a cell</Text>
      </TouchableOpacity>
      <Text style={styles.caption}>Exporting marks every entry as exported and clears the new-entry badge.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  fileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  fileTile: { width: 42, height: 42, borderRadius: radius.tile, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  fileTileText: { color: '#fff', fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 13 },
  filename: { fontSize: 14, fontFamily: 'Manrope_600SemiBold', color: colors.ink },
  statusLine: { fontSize: 12, color: colors.text2, marginTop: 3, fontFamily: 'Manrope_500Medium' },
  primaryButton: { height: 52, borderRadius: radius.row, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  primaryButtonText: { color: colors.paper, fontSize: 14, fontFamily: 'Manrope_700Bold' },
  secondaryButton: { height: 52, borderRadius: radius.row, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  secondaryButtonText: { color: colors.ink, fontSize: 14, fontFamily: 'Manrope_700Bold' },
  caption: { fontSize: 11, color: colors.text3, fontFamily: 'Manrope_500Medium' },
});
