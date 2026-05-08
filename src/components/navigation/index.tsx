import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicDashboard from '../../screens/PublicDashboard';
import BottomTabs from './BottomTabs/BottomTabs';
import DetailsTab from './DetailTabs';

// Define the types for the stack routes
export type RootStackParamList = {
  BottomTabs: undefined;
  PublicDashboard: undefined;
  DeviceDetailTab: {
    id: string;
    name: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: {
            backgroundColor: '#140e17',
          },
        }}
        initialRouteName="PublicDashboard"
      >
        <Stack.Screen name="PublicDashboard" component={PublicDashboard} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="DeviceDetailTab" component={DetailsTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainRouter;
