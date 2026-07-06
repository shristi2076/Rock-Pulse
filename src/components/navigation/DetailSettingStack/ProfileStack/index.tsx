import ProfileDetailScreen from '@/screens/DeviceDetail/DeviceSettingDetail/Profile/ProfileDetailScreen';
import StepGoalScreen from '@/screens/DeviceDetail/DeviceSettingDetail/Profile/StepGoalScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type ProfileStackParamList = {
  StepsGoalScreen: undefined;
  ProfileDetailScreen: undefined;
};

const ProfileStack = () => {
  const Stack = createNativeStackNavigator<ProfileStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileDetailScreen"
        component={ProfileDetailScreen}
      />
      <Stack.Screen name="StepsGoalScreen" component={StepGoalScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
