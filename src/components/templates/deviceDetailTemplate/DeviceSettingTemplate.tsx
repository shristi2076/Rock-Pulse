// SettingsTemplate.tsx

import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Ionicons from '@react-native-vector-icons/ionicons';

type MenuItem = {
  name: string;
  navigate: keyof SettingStackParamList;
};

const menuItems: MenuItem[] = [
  { name: 'Profile', navigate: 'ProfileDeviceScreen' },
  // 'Connected Devices',
  // 'Warranty Card',
  // 'Instruction Manual',
  // 'Support',
];

import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { SettingStackParamList } from '@/components/navigation/DetailSettingStack';

export default function DeviceSettingTemplate() {
  const navigation = useNavigation<NavigationProp<SettingStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <CustomPageHeader name="Settings" />
      <View style={styles.listContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.name}
            activeOpacity={0.8}
            style={styles.cardWrapper}
            onPress={() => navigation.navigate(item?.navigate)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.title}>{item.name}</Text>

              <Ionicons name="chevron-forward" size={18} color="#FFD400" />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0715',
    // justifyContent: 'center',
  },

  listContainer: {
    paddingHorizontal: 12,
  },

  cardWrapper: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },

  card: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  title: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});
