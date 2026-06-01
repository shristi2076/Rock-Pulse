import Settings from '@/screens/Settings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProfileStack from '../ProfileStack';

export type SettingStackParamList = {
  SettingScreen: undefined;
  ProfileScreen: undefined;
};

const SettingStack = () => {
  const Stack = createNativeStackNavigator<SettingStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingScreen" component={Settings} />
      <Stack.Screen name="ProfileScreen" component={ProfileStack} />
    </Stack.Navigator>
  );
};

export default SettingStack;
