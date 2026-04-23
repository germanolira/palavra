import React from "react";
import { Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { AppTheme } from "../constants/theme";
import { createAppStyles } from "../styles/AppStyles";
import type { TileState } from "../types";

interface TileProps {
  letter: string;
  state: TileState;
  index: number;
  animateFlip: boolean;
  tileSize: number;
  theme: AppTheme;
}

export default function Tile({
  letter,
  state,
  index,
  animateFlip,
  tileSize,
  theme,
}: TileProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const fontSize = tileSize * 0.42;
  const flipProgress = useSharedValue(0);

  React.useEffect(() => {
    if (animateFlip && state !== "active" && state !== "empty") {
      flipProgress.value = withDelay(index * 120, withTiming(1, { duration: 350 }));
      return;
    }

    if (!animateFlip) {
      flipProgress.value = 0;
    }
  }, [animateFlip, flipProgress, index, state]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0, 1],
    );
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0.95, 1],
    );

    return {
      transform: [{ scaleY }, { scale }],
    };
  });

  const stateStyle = React.useMemo(() => {
    switch (state) {
      case "correct":
        return { tileStyle: styles.correct, textStyle: styles.correctText };
      case "present":
        return { tileStyle: styles.present, textStyle: styles.presentText };
      case "absent":
        return { tileStyle: styles.absent, textStyle: styles.absentText };
      case "active":
        return { tileStyle: styles.active, textStyle: null };
      default:
        return { tileStyle: styles.empty, textStyle: null };
    }
  }, [state, styles]);

  return (
    <Animated.View
      style={[
        styles.tile,
        stateStyle.tileStyle,
        animatedStyle,
        { width: tileSize, height: tileSize, borderRadius: tileSize * 0.18 },
      ]}
    >
      <Text style={[styles.tileText, stateStyle.textStyle, { fontSize }]}>{letter}</Text>
    </Animated.View>
  );
}
