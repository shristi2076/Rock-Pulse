import Moon from '@/assets/images/moon.svg';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';

const WEEK_DAYS = ['MN', 'TW', 'WN', 'TH', 'FR', 'ST', 'SU'];

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekData() {
  const start = getStartOfWeek();

  return WEEK_DAYS.map((weekday, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      weekday,
      day: date.getDate(),
    };
  });
}

export default function MoonCard() {
  const moonData = useMemo(() => getWeekData(), []);

  const todayIndex = new Date().getDay();
  const initialIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const [selected, setSelected] = useState(WEEK_DAYS[initialIndex]);

  return (
    <LinearGradient
      colors={['rgba(201,195,195,0.25)', 'rgba(201,195,195,0)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.smallTitle}>Today’s Moon Cycle</Text>
      <Text style={styles.title}>Moon</Text>

      <View style={styles.moonRow}>
        {moonData.map(item => {
          const active = selected === item.weekday;

          return (
            <View key={item.weekday} style={styles.moonItem}>
              <Text style={styles.date}>{item.day}</Text>

              <View>
                <Moon style={[styles.moon, { opacity: active ? 1 : 0.4 }]} />
              </View>
            </View>
          );
        })}
      </View>

      <LinearGradient
        colors={['rgba(0, 0, 0, 0.25)', 'rgba(201,195,195,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomSelector}
      >
        {moonData.map(item => {
          const active = selected === item.weekday;

          return (
            <View
              key={item.weekday}
              style={[styles.dayButton, active && styles.activeDay]}
              // onPress={() => setSelected(item.weekday)}
            >
              <Text style={[styles.dayText, active && styles.activeText]}>
                {item.weekday}
              </Text>
            </View>
          );
        })}
      </LinearGradient>
    </LinearGradient>
  );
}
