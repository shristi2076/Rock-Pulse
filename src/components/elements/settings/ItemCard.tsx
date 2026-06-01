import Ionicons from '@react-native-vector-icons/ionicons';

import React, { ReactNode } from 'react';

import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type Props = {
  children: ReactNode;

  onPress?: () => void;

  style?: ViewStyle;

  showArrow?: boolean;
};

const ItemCard = ({ children, onPress, style, showArrow = true }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.cardWrapper, style]}
      onPress={onPress}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {children}

        {showArrow && (
          <Ionicons name="chevron-forward" size={18} color="#FFD400" />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },

  card: {
    minHeight: 50,

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
});
