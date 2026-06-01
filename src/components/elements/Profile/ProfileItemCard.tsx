import React from 'react';

import { Text, View } from 'react-native';

import ItemCard from '../settings/ItemCard';

type Props = {
  title: string;

  value: string;

  onPress?: () => void;
};

const ProfileItemCard = ({ title, value, onPress }: Props) => {
  return (
    <ItemCard onPress={onPress}>
      <View>
        <Text style={{ color: '#fff' }}>{title}</Text>

        <Text style={{ color: '#999' }}>{value}</Text>
      </View>
    </ItemCard>
  );
};

export default ProfileItemCard;
