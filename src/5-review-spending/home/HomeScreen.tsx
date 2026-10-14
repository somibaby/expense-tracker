import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useLedger } from '../../1-data/LedgerContext';
import { greeting } from '../../1-data/derived';
import { useNow } from '../../2-ui-kit/hooks/useNow';
import { colors } from '../../2-ui-kit/theme';
import Screen from '../../2-ui-kit/components/Screen';
import type { RootTabParamList } from '../../3-app-shell/types';
import BudgetHero from './components/BudgetHero';
import CategoryDonutCard from './components/CategoryDonutCard';
import WeekChartCard from './components/WeekChartCard';
import RecentList from './components/RecentList';

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { txs, budget } = useLedger();
  const now = useNow();

  return (
    <Screen>
      <View>
        <Text style={styles.eyebrow}>{now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
        <Text style={styles.title}>{greeting(now.getHours())}</Text>
      </View>

      <BudgetHero txs={txs} budget={budget} now={now} />
      <CategoryDonutCard txs={txs} now={now} />
      <WeekChartCard txs={txs} now={now} />
      <RecentList txs={txs} now={now} onSeeAll={() => navigation.navigate('Activity')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, letterSpacing: 1, color: colors.text3 },
  title: { fontFamily: 'Manrope_800ExtraBold', fontSize: 26, color: colors.ink, marginTop: 4 },
});
