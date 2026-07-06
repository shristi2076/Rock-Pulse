import { Colors } from '@/theme/colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  progress: number;
  targetSteps: number;
};

export default function ProgressRing({ progress, targetSteps }: Props) {
  const size = 220;
  const strokeWidth = 30;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 75% ring
  const arcLength = circumference;

  // Percentage completed
  const percentage = (progress / targetSteps) * 100;
  const clampedPercentage = Math.min(percentage, 100);

  // Arc offset
  const progressOffset = arcLength - (clampedPercentage / 100) * arcLength;
  return (
    <View style={styles.container}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '135deg' }] }}
      >
        {/* Background Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
        />

        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#51D96B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressOffset}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.percent}>{percentage.toFixed(2)}%</Text>

        <Text style={styles.label}>Exercise Finished</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    position: 'absolute',
    alignItems: 'center',
  },

  percent: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },

  label: {
    color: '#ccc',
    marginTop: 4,
  },
});
