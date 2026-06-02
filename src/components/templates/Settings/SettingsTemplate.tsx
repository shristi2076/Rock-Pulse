// SettingsTemplate.tsx

import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Ionicons from '@react-native-vector-icons/ionicons';

const menuItems = [
  'Profile',
  // 'Connected Devices',
  // 'Warranty Card',
  // 'Instruction Manual',
  // 'Support',
];

import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SettingStackParamList } from '@/components/navigation/SettingStack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsTemplate() {
  const navigation = useNavigation<NavigationProp<SettingStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <CustomPageHeader name="Settings" />
      <View style={styles.listContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.8}
            style={styles.cardWrapper}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.title}>{item}</Text>

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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
