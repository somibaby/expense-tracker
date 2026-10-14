import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../../2-ui-kit/theme';

export type DonutSlice = { color: string; value: number };

const SIZE = 82;
const HOLE = 40;
const STROKE = (SIZE - HOLE) / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel: string }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.divider}
          strokeWidth={STROKE}
          fill="none"
        />
        {total > 0
          ? slices.map((s, i) => {
              const fraction = s.value / total;
              const length = fraction * CIRCUMFERENCE;
              const offset = CIRCUMFERENCE - cumulative;
              cumulative += length;
              return (
                <Circle
                  key={i}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  fill="none"
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                />
              );
            })
          : null}
      </Svg>
      <View style={styles.hole}>
        <Text style={styles.holeText}>{centerLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hole: {
    position: 'absolute',
    top: STROKE,
    left: STROKE,
    width: HOLE,
    height: HOLE,
    borderRadius: HOLE / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holeText: { fontSize: 14, fontWeight: '700', color: colors.ink },
});
