import { BottomTabParamList } from '@/components/navigation/BottomTabs/BottomTabs';
import MusicPlayerTemplate from '@/components/templates/MusicPlayerTemplate';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';

type Props = BottomTabScreenProps<BottomTabParamList, 'MusicRouter'>;

const MusicPlayer: React.FC<Props> = props => {
  return <MusicPlayerTemplate {...props} />;
};

export default MusicPlayer;
