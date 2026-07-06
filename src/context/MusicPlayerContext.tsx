// MusicPlayerContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Sound from 'react-native-sound';

import { Track } from '@/types/music';

Sound.setCategory('Playback');

type MusicPlayerContextType = {
  tracks: Track[];
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  setTrackList: (tracks: Track[]) => void;

  playTrack: (index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType>(
  {} as MusicPlayerContextType,
);

export const MusicPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef<Sound | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const isSeekingRef = useRef(false);

  const currentTrack = useMemo(
    () => tracks[currentTrackIndex] || null,
    [tracks, currentTrackIndex],
  );

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const releasePlayer = useCallback(() => {
    clearProgressInterval();

    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
    }
  }, [clearProgressInterval]);

  const startProgress = useCallback(() => {
    clearProgressInterval();

    progressIntervalRef.current = setInterval(() => {
      const sound = soundRef.current;

      if (!sound || isSeekingRef.current) {
        return;
      }

      sound.getCurrentTime(seconds => {
        const totalDuration = sound.getDuration();

        if (
          Number.isNaN(seconds) ||
          seconds < 0 ||
          seconds > totalDuration + 1
        ) {
          return;
        }

        setCurrentTime(prev => {
          if (Math.abs(prev - seconds) < 0.5) {
            return prev;
          }

          return seconds;
        });
      });
    }, 500);
  }, [clearProgressInterval]);

  const playTrack = useCallback(
    (index: number) => {
      const track = tracks[index];

      if (!track?.url) {
        return;
      }

      releasePlayer();

      const sound = new Sound(track.url, '', error => {
        if (error) {
          console.log('Sound load error:', error);
          return;
        }

        soundRef.current = sound;

        setCurrentTrackIndex(index);
        setDuration(sound.getDuration());
        setCurrentTime(0);
        setIsPlaying(true);

        startProgress();

        sound.play(success => {
          setIsPlaying(false);
          clearProgressInterval();

          if (success) {
            playNext();
          }
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracks, releasePlayer, startProgress, clearProgressInterval],
  );

  const togglePlay = useCallback(() => {
    const sound = soundRef.current;

    if (!sound) {
      if (tracks.length > 0) {
        playTrack(currentTrackIndex);
      }

      return;
    }

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
      clearProgressInterval();
    } else {
      sound.play(success => {
        if (!success) {
          setIsPlaying(false);
          clearProgressInterval();
        }
      });

      setIsPlaying(true);
      startProgress();
    }
  }, [
    isPlaying,
    tracks,
    currentTrackIndex,
    playTrack,
    startProgress,
    clearProgressInterval,
  ]);

  const playNext = useCallback(() => {
    if (tracks.length === 0) {
      return;
    }

    const nextIndex =
      currentTrackIndex >= tracks.length - 1 ? 0 : currentTrackIndex + 1;

    playTrack(nextIndex);
  }, [tracks, currentTrackIndex, playTrack]);

  const playPrev = useCallback(() => {
    if (tracks.length === 0) {
      return;
    }

    const prevIndex =
      currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;

    playTrack(prevIndex);
  }, [tracks, currentTrackIndex, playTrack]);

  const seekTo = useCallback((seconds: number) => {
    const sound = soundRef.current;

    if (!sound) {
      return;
    }

    console.log('Seeking to:', seconds);

    sound.setCurrentTime(seconds);

    setTimeout(() => {
      sound.getCurrentTime(time => {
        console.log('Actually at:', time);
      });
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      releasePlayer();
    };
  }, [releasePlayer]);

  const value = useMemo(
    () => ({
      tracks,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      currentTime,
      duration,

      setTrackList: setTracks,

      playTrack,
      togglePlay,
      playNext,
      playPrev,
      seekTo,
    }),
    [
      tracks,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      currentTime,
      duration,
      playTrack,
      togglePlay,
      playNext,
      playPrev,
      seekTo,
    ],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
