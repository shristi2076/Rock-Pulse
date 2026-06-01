import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useState } from 'react';
import { Animated, Text, useWindowDimensions, View } from 'react-native';

type Props = {
  message: string | null;
  isSuccess: boolean;
  duration?: number;
  onHide?: () => void;
};

const CustomNotification = ({
  message,
  duration = 3000,
  onHide,
  isSuccess = false,
}: Props) => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(true);

  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 30,
        zIndex: 999,
        width: width - 32,
        backgroundColor: '#808080',
        elevation: 10,
        shadowOffset: { width: -2, height: 8 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 16,
        borderRadius: 999,
        flexDirection: 'row',
        transform: [{ translateY }],
      }}
    >
      <Ionicons
        name="information-circle-outline"
        size={22}
        color={isSuccess ? 'green' : 'black'}
      />

      <Text
        style={{
          flex: 1,
          color: isSuccess ? 'green' : 'black',
          paddingHorizontal: 8,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export default CustomNotification;
