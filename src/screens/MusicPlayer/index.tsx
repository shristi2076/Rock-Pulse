import { MusicPlayerScreenProps } from '@/components/navigation/types';
import MusicPlayerTemplate from '@/components/templates/MusicPlayerTemplate';
import React from 'react';

const MusicPlayer: React.FC<MusicPlayerScreenProps> = props => {
  return <MusicPlayerTemplate {...props} />;
};

export default MusicPlayer;
