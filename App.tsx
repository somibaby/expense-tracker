import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { LedgerProvider } from './src/1-data/LedgerContext';
import { ToastProvider } from './src/2-ui-kit/toast/ToastContext';
import { SheetProvider } from './src/4-add-expense/SheetContext';
import { navigationRef } from './src/3-app-shell/navigationRef';
import AppTabs from './src/3-app-shell/AppTabs';
import AddExpenseSheet from './src/4-add-expense/AddExpenseSheet';
import ToastHost from './src/2-ui-kit/toast/ToastHost';
import { colors } from './src/2-ui-kit/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LedgerProvider>
        <ToastProvider>
          <SheetProvider>
            <NavigationContainer ref={navigationRef}>
              <AppTabs />
              <AddExpenseSheet />
              <ToastHost />
            </NavigationContainer>
            <StatusBar style="dark" />
          </SheetProvider>
        </ToastProvider>
      </LedgerProvider>
    </SafeAreaProvider>
  );
}
