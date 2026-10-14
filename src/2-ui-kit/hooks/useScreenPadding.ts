import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_CONTENT_HEIGHT } from '../theme';

// Adapts screen content padding to each device's actual safe-area insets
// (notch / Dynamic Island up top, home indicator down below) instead of a
// fixed guess tuned to one screen size.
export function useScreenPadding() {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top + 16,
    paddingBottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom + 24,
  };
}
