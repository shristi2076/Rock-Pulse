import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import { getDaysInMonth, months } from '@/functions/date.function';
import {
  getBirthDate,
  saveBirthDate,
} from '@/storage/service/birthDate,service';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BirthDateTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const currentYear = new Date().getFullYear();

  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => String(currentYear - i)),
    [currentYear],
  );
  const latest = getBirthDate();
  const [day, setDay] = useState(() => String(latest?.day ?? 1));
  const [month, setMonth] = useState(() => latest?.month ?? 'Jan');
  const [year, setYear] = useState(() => String(latest?.year ?? 2000));

  const days = useMemo(() => {
    const monthNumber = months.indexOf(month) + 1;

    const totalDays = getDaysInMonth(monthNumber, Number(year));

    return Array.from({ length: totalDays }, (_, i) => String(i + 1));
  }, [month, year]);

  useEffect(() => {
    const monthNumber = months.indexOf(month) + 1;

    const maxDay = getDaysInMonth(monthNumber, Number(year));

    if (Number(day) > maxDay) {
      setDay(String(maxDay));
    }
  }, [month, year, day]);

  const handleBack = () => {
    const birthDate = {
      day: Number(day),
      month,
      year: Number(year),
    };

    saveBirthDate(birthDate);

    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <CustomPageHeader name="Birth Date" onBack={handleBack} />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <View style={{ flex: 1 }}>
          <WheelPicker data={days} value={day} onChange={setDay} />
        </View>

        <View style={{ flex: 1, width: 300 }}>
          <WheelPicker data={months} value={month} onChange={setMonth} />
        </View>

        <View style={{ flex: 1 }}>
          <WheelPicker data={years} value={year} onChange={setYear} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BirthDateTemplate;
