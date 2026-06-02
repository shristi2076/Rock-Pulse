import BirthDateScreen from '@/screens/Settings/Profile/BirthDateScreen';
import GenderScreen from '@/screens/Settings/Profile/GenderScreen';
import HeightScreen from '@/screens/Settings/Profile/HeightScreen';
import ProfileScreen from '@/screens/Settings/Profile/ProfileScreen';
import StepLengthScreen from '@/screens/Settings/Profile/StepLengthScreen';
import WeightScreen from '@/screens/Settings/Profile/WeightScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  GenderScreen: undefined;
  HeightScreen: undefined;
  WeightScreen: undefined;
  BirthDateScreen: undefined;
  StepLengthScreen: undefined;
};

const ProfileStack = () => {
  const Stack = createNativeStackNavigator<ProfileStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor: '#140e17',
        },
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="HeightScreen" component={HeightScreen} />
      <Stack.Screen name="WeightScreen" component={WeightScreen} />
      <Stack.Screen name="BirthDateScreen" component={BirthDateScreen} />
      <Stack.Screen name="StepLengthScreen" component={StepLengthScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
