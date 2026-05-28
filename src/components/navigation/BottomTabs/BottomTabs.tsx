import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';

import { Image } from 'react-native';
// import AddDevicesScreen from '../../templates/addDevice';
import Ionicons from '@react-native-vector-icons/ionicons';
import AddStack from '../AddStack/AddStack';
import HomeStack from '../HomeStack/HomeStack';

// ✅ Types
export type BottomTabParamList = {
  HomeRouter: undefined;
  MusicRouter: undefined;
  AddRouter: undefined;
  SettingsRouter: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  const tabs: {
    name: keyof BottomTabParamList;
    component: React.ComponentType<any>;
    options: BottomTabNavigationOptions;
  }[] = [
    {
      name: 'HomeRouter',
      component: HomeStack,
      options: {
        // sceneStyleInterpolator: SceneStyleInterpolators.forFade,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={'home'} size={size} color={color} />
        ),
      },
    },
    {
      name: 'MusicRouter',
      component: MusicPlayer,
      options: {
        tabBarLabel: 'Music',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={'musical-notes'} size={size} color={color} />
        ),
      },
    },
    {
      name: 'AddRouter',
      component: AddStack,
      options: {
        tabBarLabel: 'Add',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={'add'} size={size} color={color} />
        ),
      },
    },
    // {
    //   name: 'SettingsRouter',
    //   // component: AddDevicesScreen,
    //   component: AddStack,

    //   options: {
    //     tabBarLabel: 'Settings',
    //     tabBarIcon: ({ color, size }) => (
    //       <Ionicons name={'settings'} size={size} color={color} />
    //     ),
    //   },
    // },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#f6f8f8',
        tabBarStyle: {
          backgroundColor: '#1f2020',
        },
        tabBarBackground: () => (
          <Image
            source={require('../../../assets/images/footerbarImg.png')} // 👈 your image path
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover" // or 'cover'
          />
        ),
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;
