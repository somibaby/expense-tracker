import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

// Slides the sheet up from the bottom and fades the scrim in when `isOpen`
// turns true, and reverses both when it turns false. `mounted` stays true
// until the closing animation has finished, so the sheet can animate out
// before it's removed from the tree.
export function useSheetAnimation(isOpen: boolean) {
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      translateY.setValue(screenHeight);
      scrim.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scrim, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: screenHeight, duration: 200, useNativeDriver: true }),
        Animated.timing(scrim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [isOpen]);

  return { mounted, translateY, scrim, screenHeight };
}
