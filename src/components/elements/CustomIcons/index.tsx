import React from 'react';
import { View, StyleSheet } from 'react-native';

import EarbudSvg from '@/assets/images/earbud.svg';
import HeadsetSvg from '@/assets/images/headset.svg';
import WatchSvg from '@/assets/images/watch.svg';
import LogoSvg from '@/assets/images/logo.svg';

type Props = {
  name: string | null;
  size?: number;
};

const DeviceIcon: React.FC<Props> = ({ name, size = 40 }) => {
  const renderIcon = () => {
    switch (name?.toLowerCase()) {
      case 'move':
        return <WatchSvg width={size} height={size} />;
      case 'wave':
        return <EarbudSvg width={size} height={size} />;
      case 'vibe':
        return <HeadsetSvg width={size} height={size} />;
      default:
        return <LogoSvg width={size} height={size} />;
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
};

export default DeviceIcon;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
