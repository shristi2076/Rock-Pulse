import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, BackHandler } from 'react-native';
import DashboardPage from '../../templates/dashboardScreen';
// import DetailsTab from '../DetailTabs';

export type HomeStackParamList = {
  Dashboard: undefined;
  DeviceDetailTab: {
    id: string;
    name: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = (props: any) => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          // errorAlert("Hold on!", "Are you sure you want to go back?");
          Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        },
      );

      const unsubscribe = props.navigation.addListener('blur', () => {
        backHandler.remove();
      });
      return () => {
        unsubscribe;
      };
    }, [props]),
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardPage} />
      {/* <Stack.Screen name="DeviceDetailTab" component={DetailsTab} /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
