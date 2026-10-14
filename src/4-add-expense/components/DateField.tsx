import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type DateTimePickerType from '@react-native-community/datetimepicker';
import { dateLabel } from '../../1-data/derived';
import { colors, radius } from '../../2-ui-kit/theme';

// @react-native-community/datetimepicker has no web implementation, and even
// importing it there throws -- so it's required lazily, only on native.
const DateTimePicker: typeof DateTimePickerType | null =
  Platform.OS !== 'web' ? require('@react-native-community/datetimepicker').default : null;

// `value` is a YYYY-MM-DD string. On native it's a chip that opens the
// system date picker; on web it's a plain text field.
export default function DateField({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.wrap}>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.webInput}
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.text3}
        />
      ) : (
        <TouchableOpacity style={styles.chip} onPress={() => setShowPicker(true)}>
          <Text style={styles.chipText}>{dateLabel(value)}</Text>
          <Text style={styles.chipCaret}>▾</Text>
        </TouchableOpacity>
      )}

      {DateTimePicker ? (
        <Modal transparent visible={showPicker} animationType="fade" onRequestClose={() => setShowPicker(false)}>
          <View style={styles.pickerBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowPicker(false)} />
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={new Date(value + 'T00:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event, selected) => {
                  if (event.type === 'set' && selected) {
                    onChange(selected.toISOString().slice(0, 10));
                  }
                  if (Platform.OS === 'android') setShowPicker(false);
                }}
              />
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.okButton} onPress={() => setShowPicker(false)}>
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  chipText: { color: colors.ink, fontSize: 13, fontWeight: '600', marginRight: 6 },
  chipCaret: { color: colors.text3, fontSize: 10 },
  webInput: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.ink,
    textAlign: 'center',
    minWidth: 140,
  },
  pickerBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18,19,15,0.45)',
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  okButton: {
    alignSelf: 'stretch',
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  okButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
