import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../../2-ui-kit/theme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'];
const MAX_DIGITS = 9;

// The amount is kept as a string of digits ('' means zero) so each key press
// is just a string edit.
function nextAmount(amount: string, key: string): string | null {
  if (key === '⌫') return amount.slice(0, -1);
  if (key === '000') {
    if (!amount || amount.length + 3 > MAX_DIGITS) return null;
    return amount + '000';
  }
  if (amount.length >= MAX_DIGITS) return null;
  return amount === '0' ? key : amount + key;
}

export default function Keypad({ value, onChange }: { value: string; onChange: (amount: string) => void }) {
  const press = (key: string) => {
    const next = nextAmount(value, key);
    if (next === null) return;
    Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View style={styles.keypad}>
      {KEYS.map((k) => (
        <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
          <Text style={styles.keyText}>{k}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  key: {
    width: '31%',
    height: 54,
    borderRadius: radius.key,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keyText: { fontSize: 20, fontWeight: '600', color: colors.ink, fontFamily: 'IBMPlexMono_600SemiBold' },
});
