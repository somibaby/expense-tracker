import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLedger } from '../../1-data/LedgerContext';
import { useToast } from '../../2-ui-kit/toast/ToastContext';
import { formatCurrency } from '../../2-ui-kit/format';
import { colors, radius } from '../../2-ui-kit/theme';
import Card from '../../2-ui-kit/components/Card';

const BUDGET_STEP = 100_000;
const MIN_BUDGET = 100_000;

// Two ways to set the monthly budget: − / + steppers, or tap the amount to
// type an exact figure.
export default function BudgetCard() {
  const { budget, setBudget } = useLedger();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(budget));

  const adjust = (delta: number) => {
    Haptics.selectionAsync();
    setBudget(Math.max(MIN_BUDGET, budget + delta));
  };

  const startEditing = () => {
    setInput(String(budget));
    setEditing(true);
  };

  const saveInput = () => {
    const parsed = Math.round(Number(input.replace(/[^0-9]/g, '')));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      showToast('Enter a valid amount');
      return;
    }
    setBudget(Math.max(MIN_BUDGET, parsed));
    setEditing(false);
  };

  return (
    <Card title="Monthly budget">
      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            autoFocus
            value={input}
            onChangeText={setInput}
            onSubmitEditing={saveInput}
          />
          <TouchableOpacity style={styles.okButton} onPress={saveInput}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.stepperRow}>
          <TouchableOpacity style={styles.stepper} onPress={() => adjust(-BUDGET_STEP)}>
            <Text style={styles.stepperText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={startEditing}>
            <Text style={styles.value}>{formatCurrency(budget)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stepper} onPress={() => adjust(BUDGET_STEP)}>
            <Text style={styles.stepperText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.caption}>Tap the amount to type an exact budget · ± steps by ₩100,000</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 12 },
  stepper: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  stepperText: { fontSize: 22, color: colors.ink, fontFamily: 'Manrope_700Bold' },
  value: { fontSize: 22, fontFamily: 'IBMPlexMono_600SemiBold', color: colors.ink, minWidth: 140, textAlign: 'center' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  input: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'IBMPlexMono_600SemiBold',
    color: colors.ink,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.row,
    paddingVertical: 10,
  },
  okButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.row,
    backgroundColor: colors.accent,
  },
  okButtonText: { color: '#fff', fontSize: 14, fontFamily: 'Manrope_700Bold' },
  caption: { fontSize: 11, color: colors.text3, fontFamily: 'Manrope_500Medium' },
});
