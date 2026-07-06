import { Colors } from '@/theme/colors';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';

type Props = {
  data: string[];
  value: string;
  unit?: string;
  width?: number;
  onChange: (value: string) => void;
};

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 7;
const PADDING = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;

type WheelItemProps = {
  item: string;
  index: number;
  scrollY: Animated.Value;
};

const WheelItem = React.memo(({ item, index, scrollY }: WheelItemProps) => {
  const inputRange = [
    (index - 3) * ITEM_HEIGHT,
    (index - 2) * ITEM_HEIGHT,
    (index - 1) * ITEM_HEIGHT,
    index * ITEM_HEIGHT,
    (index + 1) * ITEM_HEIGHT,
    (index + 2) * ITEM_HEIGHT,
    (index + 3) * ITEM_HEIGHT,
  ];

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0.15, 0.3, 0.6, 1, 0.6, 0.3, 0.15],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.75, 0.85, 0.95, 1, 0.95, 0.85, 0.75],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.row,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Text style={styles.text}>{item}</Text>
    </Animated.View>
  );
});

export default function WheelPicker({
  data,
  value,
  unit,
  width,
  onChange,
}: Props) {
  const initialIndex = data.indexOf(value);
  const listRef = useRef<FlatList<string>>(null);

  const scrollY = useRef(
    new Animated.Value(initialIndex >= 0 ? initialIndex : 0),
  ).current;

  const selectedIndex = useMemo(() => {
    const i = data.indexOf(value);
    return i < 0 ? 0 : i;
  }, [data, value]);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });

      scrollY.setValue(selectedIndex * ITEM_HEIGHT);
    });
  }, [selectedIndex]);

  return (
    <View style={[styles.container, { width }]}>
      <Animated.FlatList
        ref={listRef}
        data={data}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        bounces={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        initialNumToRender={VISIBLE_ITEMS}
        maxToRenderPerBatch={VISIBLE_ITEMS}
        windowSize={5}
        removeClippedSubviews
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: PADDING,
          paddingBottom: PADDING,
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
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
          { useNativeDriver: true },
        )}
        renderItem={({ item, index }) => (
          <WheelItem item={item} index={index} scrollY={scrollY} />
        )}
      />

      <View pointerEvents="none" style={styles.selectionBar}>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },

  row: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },

  text: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  selectionBar: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: PADDING,
    height: ITEM_HEIGHT,
    // borderRadius: ITEM_HEIGHT / 2,
    // backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 18,
  },

  unit: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
