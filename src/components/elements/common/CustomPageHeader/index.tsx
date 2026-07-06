import { Colors } from '@/theme/colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  name: string | null;
  titleColor?: string | null;
  onBack?: () => void;
};

const CustomPageHeader = ({
  name,
  titleColor,
  onBack,
}: Props): React.JSX.Element => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
          style={styles.backBtn}
        >
          <Ionicons
            name="chevron-back-outline"
            color={titleColor ? titleColor : Colors.white}
            size={20}
          />
        </TouchableOpacity>
      )}

      <Text
        style={[
          styles.headerTitle,
          { color: titleColor ? titleColor : Colors.white },
        ]}
        pointerEvents="none"
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: 0,
    zIndex: 10,

    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',

    borderColor: '#232323',
    borderRadius: 12,
    borderWidth: 1,
  },

  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CustomPageHeader;
