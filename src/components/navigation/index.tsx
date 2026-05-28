import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import React, { Suspense } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicDashboard from '../../screens/PublicDashboard';
import DetailsTab from './DetailTabs';
import NowPlayingScreen from '../templates/MusicPlayerTemplate/NowPlayingScreen';
import { Track } from '@/types/music';
import { ActivityIndicator, StatusBar } from 'react-native';
import { BottomTabParamList } from './BottomTabs/BottomTabs';

// Define the types for the stack routes
export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  PublicDashboard: undefined;
  DeviceDetailTab: {
    id: string;
    name: string;
  };
  MusicId: {
    tracks: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainRouter = () => {
  const LazyBottomTabs = React.lazy(() => import('./BottomTabs/BottomTabs'));
  return (
    <>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
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
          <Stack.Screen name="BottomTabs">
            {() => (
              <Suspense fallback={<ActivityIndicator />}>
                <LazyBottomTabs />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="DeviceDetailTab" component={DetailsTab} />
          <Stack.Screen name="MusicId" component={NowPlayingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainRouter;
