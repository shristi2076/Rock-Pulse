import React, { useCallback, useState } from 'react';

import ProfileItemCard from '@/components/elements/Profile/ProfileItemCard';

import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import { ProfileStackParamList } from '@/components/navigation/DetailSettingStack/ProfileStack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAllStepGoals,
  getLatestStepGoal,
} from '@/storage/service/stepGoal.service';

const ProfileDetailTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const [profile, setProfile] = useState({
    // gender: '',
    // height: '',
    // weight: '',
    // birthDate: '',
    stepGoal: '',
  });

  useFocusEffect(
    useCallback(() => {
      // const latestGender = getGender();
      // const latestWeight = getLatestWeight();
      // const latestHeight = getLatestHeight();
      // const latestBirthdate = getBirthDate();
      const latestStepGoal = getLatestStepGoal();

      setProfile(prev => ({
        ...prev,
        // height: latestHeight?.value?.toString() ?? '160.0',
        // gender: latestGender ? latestGender : 'Male',
        // weight: latestWeight?.value?.toString() ?? '60.0',
        // birthDate: latestBirthdate
        // ? formatBirthDate(latestBirthdate)
        // : '01-01-2000',
        stepGoal: latestStepGoal?.value?.toString() ?? '8000',
      }));
    }, []),
  );

  const profileItems = [
    // {
    //   title: 'Gender',
    //   value: profile.gender,
    //   route: 'GenderScreen',
    // },
    // {
    //   title: 'Height',
    //   value: `${profile.height} CM`,
    //   route: 'HeightScreen',
    // },
    // {
    //   title: 'Weight',
    //   value: `${profile.weight} KG`,
    //   route: 'WeightScreen',
    // },
    // {
    //   title: 'Birth Date',
    //   value: profile.birthDate,
    //   route: 'BirthDateScreen',
    // },
    {
      title: 'Step ',
      value: profile.stepGoal,
      route: 'StepsGoalScreen',
    },
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

export default ProfileDetailTemplate;

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
