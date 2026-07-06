import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '@/theme/colors';

type Props = {
  value: string;
  bgColor?: string;
  onChangeText: (text: string) => void;
  goBack: () => void;
  nowPlaying?: boolean;
};

export default function MusicHeader({
  value,
  bgColor,
  onChangeText,
  goBack,
  nowPlaying,
}: Props) {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor ? bgColor : '#120514' },
      ]}
    >
      {!isSearching ? (
        <>
          <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
            <Ionicons
              name="chevron-back-outline"
              size={22}
              color={nowPlaying ? Colors.black : Colors.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              { color: nowPlaying ? Colors.black : Colors.white },
            ]}
          >
            Music Player
          </Text>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsSearching(true)}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={nowPlaying ? Colors.black : Colors.white}
            />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.searchWrapper}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              onChangeText('');
              setIsSearching(false);
            }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={nowPlaying ? Colors.black : Colors.white}
            />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#ffffff" />

            <TextInput
              placeholder="Search music..."
              placeholderTextColor="#9B8AA8"
              autoFocus
              value={value}
              onChangeText={onChangeText}
              style={styles.input}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C2233',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C2233',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 12,
  },

  searchContainer: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2233',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    color: Colors.black,
    marginLeft: 10,
    fontSize: 15,
  },
});
