// components/elements/WheelPicker.tsx

import React, { useRef } from 'react';

import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';

type Props = {
  data: string[];

  value: string;
  unit?: string;

  onChange: (value: string) => void;
};

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 9;

const WheelPicker = ({ data, value, unit, onChange }: Props) => {
  const initialIndex = data.indexOf(value);
  const scrollY = useRef(
    new Animated.Value((initialIndex >= 0 ? initialIndex : 0) * ITEM_HEIGHT),
  ).current;
  const listRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={data}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        }}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / ITEM_HEIGHT,
          );

          const selected = data[index] ?? data[0];

          onChange(selected);
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        keyExtractor={item => item}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.15, 0.4, 1, 0.4, 0.15],
            extrapolate: 'clamp',
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <View
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Animated.Text
                style={[
                  styles.itemText,
                  {
                    opacity,
                    transform: [{ scale }],
                  },
                ]}
              >
                {item}
              </Animated.Text>
            </View>
          );
        }}
      />

      <View pointerEvents="none" style={styles.selectionBar}>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

export default WheelPicker;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    justifyContent: 'center',
  },

  selectionBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 50,

    borderRadius: 25,

    backgroundColor: 'rgba(255,255,255,0.12)',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    paddingRight: 20,
  },

  unit: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  itemText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
