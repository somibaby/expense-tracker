import React, { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLedger } from '../1-data/LedgerContext';
import { CATEGORY_NAMES, type CategoryName } from '../1-data/types';
import { useToast } from '../2-ui-kit/toast/ToastContext';
import { formatCurrency } from '../2-ui-kit/format';
import { colors, radius } from '../2-ui-kit/theme';
import { navigateToHome } from '../3-app-shell/navigationRef';
import { useSheet } from './SheetContext';
import { useSheetAnimation } from './useSheetAnimation';
import CategoryPicker from './components/CategoryPicker';
import DateField from './components/DateField';
import Keypad from './components/Keypad';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddExpenseSheet() {
  const { isOpen, close } = useSheet();
  const insets = useSafeAreaInsets();
  const { addTx } = useLedger();
  const { showToast } = useToast();
  const { mounted, translateY, scrim, screenHeight } = useSheetAnimation(isOpen);

  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState<CategoryName>(CATEGORY_NAMES[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());

  // Start from a blank form every time the sheet opens.
  useEffect(() => {
    if (!isOpen) return;
    setAmount('');
    setCat(CATEGORY_NAMES[0]);
    setNote('');
    setDate(todayISO());
  }, [isOpen]);

  if (!mounted) return null;

  const amountNum = amount ? parseInt(amount, 10) : 0;

  const save = () => {
    if (amountNum <= 0) return;
    addTx({ name: note.trim(), cat, amount: amountNum, date });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    close();
    navigateToHome();
    showToast(`${formatCurrency(amountNum)} saved`);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: scrim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { maxHeight: screenHeight * 0.9, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={close} hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New expense</Text>
          <TouchableOpacity onPress={save} disabled={amountNum <= 0} hitSlop={8}>
            <Text style={[styles.save, amountNum > 0 && styles.saveActive]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
        >
          <View style={styles.amountRow}>
            <Text style={styles.amountSign}>₩</Text>
            <Text style={styles.amountValue}>{amount ? Number(amount).toLocaleString('en-US') : '0'}</Text>
          </View>

          <DateField value={date} onChange={setDate} />
          <CategoryPicker value={cat} onChange={setCat} />

          <TextInput
            style={styles.noteInput}
            placeholder="Note — e.g. taxi fare, dinner"
            placeholderTextColor={colors.text3}
            value={note}
            onChangeText={setNote}
          />

          <Keypad value={amount} onChange={setAmount} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(18,19,15,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cancel: { color: colors.text2, fontSize: 14, fontWeight: '600' },
  headerTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  save: { color: 'rgba(0,0,0,0.25)', fontSize: 14, fontWeight: '700' },
  saveActive: { color: colors.accent },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 20,
  },
  amountSign: { color: colors.text2, fontSize: 28, fontWeight: '600', marginRight: 4, marginBottom: 6 },
  amountValue: { color: colors.ink, fontSize: 48, fontWeight: '600', fontFamily: 'IBMPlexMono_600SemiBold' },
  noteInput: {
    marginHorizontal: 20,
    height: 46,
    borderRadius: radius.row,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 20,
  },
});
