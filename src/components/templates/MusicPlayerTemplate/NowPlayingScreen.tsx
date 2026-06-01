// NowPlayingScreen.tsx

import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import Slider from '@react-native-community/slider';

import { useMusicPlayer } from '@/context/MusicPlayerContext';

import { formatTime } from '@/services/commonFunction';
import MusicHeader from '@/components/elements/CustomPageHeader/MusicHeader';

export default function NowPlayingScreen({ navigation }: any) {
  const [isSliding, setIsSliding] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [sliderValue, setSliderValue] = useState(0);

  const [sliderWidth, setSliderWidth] = useState(0);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    // duration,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
  } = useMusicPlayer();

  useEffect(() => {
    if (!isSliding) {
      setSliderValue(currentTime);
    }
  }, [currentTime, isSliding]);

  if (!currentTrack) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFD400" barStyle="dark-content" />

      {/* <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>Now Playing</Text>

        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
        </TouchableOpacity> */}
      <View style={styles.topSection}>
        <MusicHeader
          bgColor="#FFD400"
          value={searchText}
          onChangeText={setSearchText}
          goBack={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: 'https://picsum.photos/500',
          }}
          style={styles.heroImage}
        />
      </View>

      <Text style={styles.artist}>Local Music</Text>

      <Text style={styles.title}>{currentTrack.title}</Text>
      {/* <Text style={styles.title}>{formatTime(sliderValue)}</Text> */}

      <View
        style={styles.sliderContainer}
        onLayout={event => {
          setSliderWidth(event.nativeEvent.layout.width);
        }}
      >
        {isSliding && (
          <View
            style={[
              styles.tooltip,
              {
                left: (sliderValue / currentTrack.duration) * sliderWidth - 25,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{formatTime(sliderValue)}</Text>
          </View>
        )}

        <Slider
          style={styles.slider}
          value={sliderValue}
          minimumValue={0}
          maximumValue={currentTrack.duration}
          step={1}
          minimumTrackTintColor="#FFD400"
          maximumTrackTintColor="#555"
          thumbTintColor="#FFD400"
          onSlidingStart={() => {
            setIsSliding(true);
          }}
          onValueChange={value => {
            setSliderValue(value);
          }}
          onSlidingComplete={value => {
            seekTo(value);

            setSliderValue(value);

            setIsSliding(false);
          }}
        />
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>

        <Text style={styles.time}>{formatTime(currentTrack.duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrev}>
          <Ionicons name="play-skip-back" size={34} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={38}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120514',
  },

  topSection: {
    backgroundColor: '#FFD400',
    height: 310,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    // paddingHorizontal: 20,
    paddingTop: 10,
    // alignItems: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: 20,
    top: 10,
  },

  searchBtn: {
    position: 'absolute',
    right: 20,
    top: 10,
  },

  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  heroContainer: {
    marginTop: -120,
    alignItems: 'center',
  },

  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 28,
  },

  artist: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
  },

  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
  },

  timeRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignSelf: 'center',
  },

  time: {
    color: '#FFD400',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  playButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  sliderContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 40,
  },

  slider: {
    width: '100%',
  },

  tooltip: {
    position: 'absolute',
    top: -35,
    width: 50,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFD400',
    alignItems: 'center',
  },

  tooltipText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
  },
});
