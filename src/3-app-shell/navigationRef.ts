import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootTabParamList } from './types';

// The add-expense sheet lives outside the tab navigator's screen tree (it's a
// global overlay), so it can't use `useNavigation()`. This lets it switch
// tabs after saving without needing to be a descendant screen.
export const navigationRef = createNavigationContainerRef<RootTabParamList>();

export function navigateToHome() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home');
  }
}
