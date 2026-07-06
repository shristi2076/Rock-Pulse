import { Colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  title: string;
  value: string | number;
  unit?: string;
  date: string;
  progress: number; // 0 - 100
  labels: string[];
  gradientColors?: string[];
  thumbColor?: string;
};

const WorkOut = ({
  title,
  value = '---',
  unit,
  date,
  progress,
  labels,
  gradientColors = [Colors.black, '#9F3232'],
  thumbColor = '#FF0000',
}: Props) => {
  return (
    <LinearGradient
      colors={['rgba(201,195,195,0.25)', 'rgba(201,195,195,0)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.metricLabel}>{title}</Text>

          <Text style={[styles.value, { color: thumbColor }]}>
            {value}
            {unit && <Text style={styles.unit}> {unit}</Text>}
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.sliderContainer}
      >
        <View style={styles.track}>
          <View
            style={[
              styles.thumb,
              {
                backgroundColor: thumbColor,
                left: `${progress}%`,
              },
            ]}
          />
        </View>

        <View style={styles.labels}>
          {labels.map(item => (
            <Text key={item} style={styles.label}>
              {item}
            </Text>
          ))}
        </View>
      </LinearGradient>
    </LinearGradient>
  );
};

export default WorkOut;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    // gap: 20,
    backgroundColor: '#000',
    borderRadius: 16,

    shadowColor: '#C9C3C3',
    shadowOffset: {
      width: 6,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,

    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  date: {
    color: '#A0A0A0',
    fontSize: 12,
  },

  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '600',
  },

  metricLabel: {
    color: '#999',
    fontSize: 16,
  },

  value: {
    fontSize: 34,
    fontWeight: '700',
  },

  unit: {
    color: '#FFF',
    fontSize: 18,
  },

  sliderContainer: {
    marginTop: 20,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,

    shadowColor: '#C9C3C3',
    shadowOffset: {
      width: 6,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,

    elevation: 8,
  },

  track: {
    height: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    marginBottom: 16,
  },

  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    marginLeft: -12,
  },

  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    color: Colors.white,
    fontSize: 12,
  },
});
