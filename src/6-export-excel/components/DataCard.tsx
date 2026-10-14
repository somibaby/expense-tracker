import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLedger } from '../../1-data/LedgerContext';
import { useToast } from '../../2-ui-kit/toast/ToastContext';
import { colors, radius } from '../../2-ui-kit/theme';
import Card from '../../2-ui-kit/components/Card';

const CONFIRM_WINDOW_MS = 4000;

// "Clear all entries" needs a second tap within a few seconds, so a single
// stray tap can't wipe the ledger.
export default function DataCard() {
  const { txs, clearAll } = useLedger();
  const { showToast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClearAll = () => {
    if (confirmClear) {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      clearAll();
      setConfirmClear(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showToast('All entries cleared');
      return;
    }
    setConfirmClear(true);
    confirmTimer.current = setTimeout(() => setConfirmClear(false), CONFIRM_WINDOW_MS);
  };

  return (
    <Card title="Your data">
      <Text style={styles.text}>
        {txs.length} entries saved on this phone. Nothing leaves the device until you export.
      </Text>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
        <Text style={styles.clearButtonText}>{confirmClear ? 'Tap again to confirm' : 'Clear all entries'}</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13, color: colors.text2, fontFamily: 'Manrope_500Medium', marginBottom: 14 },
  clearButton: { height: 46, borderRadius: radius.row, borderWidth: 1, borderColor: colors.warn, alignItems: 'center', justifyContent: 'center' },
  clearButtonText: { color: colors.warn, fontSize: 13, fontFamily: 'Manrope_700Bold' },
});
