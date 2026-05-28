// navigation/types.ts

import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabParamList } from './BottomTabs/BottomTabs';

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  PublicDashboard: undefined;
  DeviceDetailTab: {
    id: string;
    name: string;
  };
  MusicId: {
    tracks: any[];
    currentTrackIndex: number;
    isPlaying: boolean;
  };
};

export type MusicPlayerScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'MusicRouter'>,
  NativeStackScreenProps<RootStackParamList>
>;
