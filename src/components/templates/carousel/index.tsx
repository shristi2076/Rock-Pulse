import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import EarbudSvg from '../../../assets/images/earbud.svg';
import headsetSvg from '../../../assets/images/headset.svg';
import watchSVg from '../../../assets/images/watch.svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Slides
const slides = [
  {
    id: '1',
    title: 'Find petcare\naround your location',
    subtitle:
      'Just turn on your location and you will find\nthe nearest pet care you wish.',
    image: EarbudSvg,
  },
  {
    id: '2',
    title: 'Discover\namazing places',
    subtitle:
      'Just turn on your location and you will find\nthe nearest pet care you wish.',
    image: watchSVg,
  },
  {
    id: '3',
    title: 'Get Started\nwith us',
    subtitle:
      'Just turn on your location and you will find\nthe nearest pet care you wish.',
    image: headsetSvg,
  },
  {
    id: '4',
    title: 'Care for\nyour pets',
    subtitle:
      'Just turn on your location and you will find\nthe nearest pet care you wish.',
    image: EarbudSvg,
  },
];

type OnboardingScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'PublicDashboard'
>;

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<OnboardingScreenNavProp>();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    navigation.replace('BottomTabs');
  };

  // Swipe anywhere
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },

      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dx < -50 && currentIndex < slides.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
          });
        } else if (gestureState.dx > 50 && currentIndex > 0) {
          flatListRef.current?.scrollToIndex({
            index: currentIndex - 1,
            animated: true,
          });
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Wrap everything for swipe */}
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <LinearGradient
          colors={['#140e17', '#2e2832', '#140e17', '#140e17']}
          style={styles.gradient}
        >
          {/* Skip */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            hitSlop={20}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* IMAGE SLIDER */}
          <View style={{ height: height * 0.5 }}>
            <Animated.FlatList
              ref={flatListRef}
              data={slides}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
              }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
              )}
              renderItem={({ item, index }) => {
                const SlideImage = item.image;

                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 0.8],
                  extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });

                return (
                  <View
                    style={{
                      width: width * 0.9,
                      paddingHorizontal: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale }],
                        opacity,
                        width: width * 0.7,
                        height: width * 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <SlideImage width={width * 0.7} height={width * 0.7} />
                    </Animated.View>
                  </View>
                );
              }}
            />
          </View>

          {/* TEXT */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slides[currentIndex].title}</Text>
            <Text style={styles.subtitle}>{slides[currentIndex].subtitle}</Text>
          </View>

          {/* Bottom */}
          <View style={styles.bottomContainer}>
            <View style={styles.pageIndicators}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            {currentIndex !== slides.length - 1 && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={currentIndex === slides.length - 1}
              >
                <Ionicons name="arrow-forward-outline" size={22} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.homeIndicator} />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 40,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 20,
  },
  pageIndicators: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
  },
  nextButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
  },
  homeIndicator: {
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    marginHorizontal: 50,
    marginBottom: 10,
  },
});
