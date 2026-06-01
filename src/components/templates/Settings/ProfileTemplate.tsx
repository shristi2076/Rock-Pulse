import React, { useCallback, useState } from 'react';

import ProfileItemCard from '@/components/elements/Profile/ProfileItemCard';

import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import { StyleSheet, View } from 'react-native';
import { getLatestWeight } from '@/storage/service/weight.service';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const [weight, setWeight] = useState('60.0');

  useFocusEffect(
    useCallback(() => {
      const latest = getLatestWeight();
      setWeight(latest?.value || '60.0');
    }, []),
  );

  const profileItems = [
    //   {
    //     title: 'Gender',
    //     value: 'Male',
    //     route: 'GenderScreen',
    //   },
    //   {
    //     title: 'Height',
    //     value: '188 CM',
    //     route: 'HeightScreen',
    //   },
    {
      title: 'Weight',
      value: weight,
      route: 'WeightScreen',
    },
    //   {
    //     title: 'Birth Date',
    //     value: '01-01-2000',
    //     route: 'BirthDateScreen',
    //   },
    //   {
    //     title: 'Step Length',
    //     value: '50 CM',
    //     route: 'StepLengthScreen',
    //   },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <CustomPageHeader name="Profile" onBack={() => navigation.goBack()} />
      <View style={styles.listContainer}>
        {profileItems.map(item => (
          <ProfileItemCard
            key={item.route}
            title={item.title}
            value={item.value}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ProfileTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0715',
    paddingHorizontal: 16,
    // justifyContent: 'center',
  },
  listContainer: {
    // paddingHorizontal: 12,
  },
});
