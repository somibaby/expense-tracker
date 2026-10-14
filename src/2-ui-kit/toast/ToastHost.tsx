import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from './ToastContext';
import { colors, radius, TAB_BAR_CONTENT_HEIGHT } from '../theme';

export default function ToastHost() {
  const { message } = useToast();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(8)).current;
  const [rendered, setRendered] = React.useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setRendered(message);
      opacity.setValue(0);
      rise.setValue(8);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(rise, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    } else if (rendered) {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setRendered(null));
    }
  }, [message]);

  if (!rendered) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        { bottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom + 18, opacity, transform: [{ translateY: rise }] },
      ]}
    >
      <Text style={styles.text}>{rendered}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: colors.ink,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  text: { color: colors.paper, fontSize: 13, fontWeight: '600' },
});
