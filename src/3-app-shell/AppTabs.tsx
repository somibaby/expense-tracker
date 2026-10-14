import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import HomeScreen from '../5-review-spending/home/HomeScreen';
import ActivityScreen from '../5-review-spending/activity/ActivityScreen';
import InsightsScreen from '../5-review-spending/insights/InsightsScreen';
import ExcelScreen from '../6-export-excel/ExcelScreen';
import { useSheet } from '../4-add-expense/SheetContext';
import { useLedger } from '../1-data/LedgerContext';
import { colors, TAB_BAR_CONTENT_HEIGHT } from '../2-ui-kit/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

function NoopScreen() {
  return null;
}

function TabGlyph({ emoji, focused, badge }: { emoji: string; focused: boolean; badge?: number }) {
  return (
    <View style={[styles.glyphWrap, focused && styles.glyphWrapActive]}>
      <Text style={styles.glyphEmoji}>{emoji}</Text>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function AddButton() {
  const { open } = useSheet();
  return (
    <TouchableOpacity style={styles.addButton} onPress={open} activeOpacity={0.85}>
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  );
}

export default function AppTabs() {
  const { notExportedCount } = useLedger();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Manrope_600SemiBold' },
        tabBarStyle: [styles.tabBar, { height: TAB_BAR_CONTENT_HEIGHT + insets.bottom, paddingBottom: insets.bottom }],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabGlyph emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarIcon: ({ focused }) => <TabGlyph emoji="🧾" focused={focused} /> }}
      />
      <Tab.Screen
        name="AddTab"
        component={NoopScreen}
        options={{ tabBarButton: () => <AddButton />, tabBarLabel: () => null }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabGlyph emoji="📈" focused={focused} /> }}
      />
      <Tab.Screen
        name="Excel"
        component={ExcelScreen}
        options={{ tabBarIcon: ({ focused }) => <TabGlyph emoji="📊" focused={focused} badge={notExportedCount} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(250,249,246,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: 10,
  },
  glyphWrap: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    opacity: 0.5,
  },
  glyphWrapActive: { backgroundColor: colors.accentSoft + '33', opacity: 1 },
  glyphEmoji: { fontSize: 16 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.warn,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: { color: '#fff', fontSize: 8, fontFamily: 'Manrope_700Bold' },
  addButton: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  addButtonText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
