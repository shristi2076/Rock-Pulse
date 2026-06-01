/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type Permission,
} from 'react-native';

import RNFS from 'react-native-fs';

import Ionicons from '@react-native-vector-icons/ionicons';

import { useMusicPlayer } from '@/context/MusicPlayerContext';

import { formatTime } from '@/services/commonFunction';

import MusicHeader from '@/components/elements/common/CustomPageHeader/MusicHeader';
import { MusicPlayerScreenProps } from '@/components/navigation/types';
import { Track } from '@/types/music';

const blockedFolders = [
  'Android',
  'DCIM',
  'Pictures',
  'WhatsApp',
  '.thumbnails',
  'cache',
];

type Props = MusicPlayerScreenProps;

export default function MusicPlayerTemplate({
  navigation,
}: Props): React.JSX.Element {
  const [tracks, setTracks] = useState<Track[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    // duration,
    setTrackList,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
  } = useMusicPlayer();

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const requestStoragePermission = async (): Promise<void> => {
    if (Platform.OS === 'ios') {
      scanLocalAudio();
      return;
    }

    try {
      const androidVersion = Number(Platform.Version);

      let permissionToken: Permission;

      if (androidVersion >= 33) {
        permissionToken = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
      } else {
        permissionToken = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(permissionToken);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        scanLocalAudio();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAudioDuration = (path: string): Promise<number> => {
    return new Promise(resolve => {
      const Sound = require('react-native-sound').default;

      const sound = new Sound(path, '', (error: any) => {
        if (error) {
          resolve(0);
          return;
        }

        const duration = sound.getDuration();

        sound.release();

        resolve(duration);
      });
    });
  };

  const scanLocalAudio = async (): Promise<void> => {
    setIsLoading(true);

    let foundTracks: Track[] = [];

    try {
      const scanPaths = [
        `${RNFS.ExternalStorageDirectoryPath}/Music`,
        `${RNFS.DownloadDirectoryPath}`,
      ];

      for (const dirPath of scanPaths) {
        const exists = await RNFS.exists(dirPath);

        if (exists) {
          const files = await scanDirectoryRecursively(dirPath);

          foundTracks = [...foundTracks, ...files];
        }
      }

      setTracks(foundTracks);
      console.log('🚀 ~ scanLocalAudio ~ foundTracks:', foundTracks);

      setTrackList(foundTracks);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const scanDirectoryRecursively = async (
    dirPath: string,
  ): Promise<Track[]> => {
    let audioFiles: Track[] = [];

    try {
      const items = await RNFS.readDir(dirPath);

      for (const item of items) {
        if (blockedFolders.includes(item.name)) {
          continue;
        }

        if (item.isFile()) {
          const extension = item.name.split('.').pop()?.toLowerCase();
          console.log('🚀 ~ scanDirectoryRecursively ~ item:', item);

          if (
            extension &&
            ['mp3', 'wav', 'aac', 'm4a', 'ogg', 'flac'].includes(extension)
          ) {
            const duration = await getAudioDuration(item.path);

            audioFiles.push({
              id: item.path,
              title: item.name.replace(/\.[^/.]+$/, ''),
              artist: 'Local Music',
              album: 'Local Music',
              url: item.path,
              duration,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    return audioFiles;
  };

  return (
    <View style={styles.container}>
      {/* <CustomPageHeader
        name="Music Player"
        onBack={() => navigation.goBack()}
      /> */}
      <MusicHeader
        value={searchText}
        onChangeText={setSearchText}
        goBack={() => {
          navigation.goBack();
        }}
      />

      {/* <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#aaa" />

        <TextInput
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View> */}

      {isLoading ? (
        <ActivityIndicator size="large" color="#FFD400" />
      ) : (
        <FlatList
          data={filteredTracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const index = tracks.findIndex(t => t.id === item.id);
            const isCurrent = currentTrackIndex === index;
            return (
              <TouchableOpacity
                style={styles.musicRow}
                activeOpacity={0.8}
                onPress={() => playTrack(index)}
              >
                <View style={styles.leftSection}>
                  <View style={styles.musicIcon}>
                    <Ionicons name="musical-notes" size={18} color="#FFD84D" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.songTitle,
                        isCurrent && {
                          color: '#FFD84D',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.songArtist,
                        isCurrent && {
                          color: '#FFD84D',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.artist}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightSection}>
                  <Text
                    style={[
                      styles.songDuration,
                      isCurrent && {
                        color: '#FFD84D',
                      },
                    ]}
                  >
                    {formatTime(item.duration || 0)}
                  </Text>

                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={18}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {currentTrack && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.floatingPlayer}
          onPress={() =>
            navigation.navigate('MusicId', {
              tracks,
              currentTrackIndex,
              isPlaying,
            })
          }
        >
          <Image
            source={{
              uri: 'https://picsum.photos/200',
            }}
            style={styles.playerArtwork}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.playerTitle} numberOfLines={1}>
              {tracks[currentTrackIndex]?.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.playerArtist}>Local Music</Text>

              <Text style={styles.barTimes}>
                {formatTime(currentTime)} /{' '}
                {formatTime(tracks[currentTrackIndex]?.duration)}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={playPrev}>
            <Ionicons name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginHorizontal: 20 }}
            onPress={togglePlay}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext}>
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0715',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1027',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
  },

  searchInput: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanText: {
    color: '#aaa',
    marginTop: 12,
  },

  emptyText: {
    color: '#aaa',
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 120,
  },

  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  musicIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2A1A38',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  songTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  songArtist: {
    color: '#9B8AA8',
    fontSize: 11,
    marginTop: 4,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  songDuration: {
    color: '#ffffff',
    fontSize: 12,
  },

  floatingPlayer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(45,35,58,0.95)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  playerArtwork: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 12,
  },

  playerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  playerArtist: {
    color: '#9B8AA8',
    fontSize: 11,
    marginTop: 2,
  },

  barTimes: {
    fontSize: 11,
    color: '#a8a29e',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
