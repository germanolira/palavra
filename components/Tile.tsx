import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { styles } from '../styles/AppStyles';
import type { TileState } from '../types';

interface TileProps {
  letter: string;
  state: TileState;
  index: number;
  animateFlip: boolean;
}

export default function Tile({ letter, state, index, animateFlip }: TileProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.min(64, (width - 48) / 5);
  const fontSize = tileSize * 0.42;

  const flipProgress = useSharedValue(0);

  React.useEffect(() => {
    if (animateFlip && state !== 'active' && state !== 'empty') {
      flipProgress.value = withDelay(
        index * 100,
        withTiming(1, { duration: 400 })
      );
    } else if (!animateFlip) {
      flipProgress.value = 0;
    }
  }, [animateFlip, state, index]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const scale = interpolate(flipProgress.value, [0, 0.5, 1], [1, 0.9, 1]);
    return {
      transform: [
        { perspective: 400 },
        { rotateX: `${rotateX}deg` },
        { scale },
      ],
    };
  });

  const bgStyle = React.useMemo(() => {
    switch (state) {
      case 'correct': return styles.correct;
      case 'present': return styles.present;
      case 'absent': return styles.absent;
      case 'active': return styles.active;
      default: return styles.empty;
    }
  }, [state]);

  return (
    <Animated.View
      style={[
        styles.tile,
        bgStyle,
        animatedStyle,
        { width: tileSize, height: tileSize, borderRadius: tileSize * 0.12 },
      ]}
    >
      <Text style={[styles.tileText, { fontSize }]}>{letter}</Text>
    </Animated.View>
  );
}
