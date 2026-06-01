import ProfileScreen from '@/screens/Settings/Profile/ProfileScreen';
import WeightScreen from '@/screens/Settings/Profile/WeightScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  WeightScreen: undefined;
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
      <Stack.Screen name="WeightScreen" component={WeightScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
