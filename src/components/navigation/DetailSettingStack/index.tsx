import DeviceSettingDetail from '@/screens/DeviceDetail/DeviceSettingDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProfileStack from './ProfileStack';

export type SettingStackParamList = {
  SettingDeviceScreen: undefined;
  ProfileDeviceScreen: undefined;
};

const DetailSettingStack = () => {
  const Stack = createNativeStackNavigator<SettingStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SettingDeviceScreen"
        component={DeviceSettingDetail}
      />
      <Stack.Screen name="ProfileDeviceScreen" component={ProfileStack} />
    </Stack.Navigator>
  );
};

export default DetailSettingStack;
