import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useScreenPadding } from '../hooks/useScreenPadding';
import { colors, spacing } from '../theme';

// The scrolling page every tab shares: paper background, side padding,
// safe-area padding, and an even gap between whatever children it's given.
export default function Screen({ title, children }: { title?: string; children: React.ReactNode }) {
  const screenPadding = useScreenPadding();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, screenPadding]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: spacing.screenX, gap: spacing.cardGap },
  title: { fontFamily: 'Manrope_800ExtraBold', fontSize: 26, color: colors.ink },
});
