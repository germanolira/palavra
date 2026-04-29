import React from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { AppTheme } from "../constants/theme";
import { WORD_LENGTH } from "../constants/words";
import { useAppStyles } from "../styles/AppStyles";
import type { TileState } from "../types";

interface TileProps {
  letter: string;
  state: TileState;
  index: number;
  animateFlip: boolean;
  celebrate: boolean;
  tileSize: number;
  theme: AppTheme;
  cursorActive?: boolean;
  onPress?: () => void;
}

function Tile({
  letter,
  state,
  index,
  animateFlip,
  celebrate,
  tileSize,
  theme,
  cursorActive,
  onPress,
}: TileProps) {
  const styles = useAppStyles(theme);
  const fontSize = tileSize * 0.42;
  const flipProgress = useSharedValue(0);
  const bounceOffset = useSharedValue(0);

  React.useEffect(() => {
    if (animateFlip && state !== "active" && state !== "empty") {
      flipProgress.value = withDelay(index * 120, withTiming(1, { duration: 350 }));
      return;
    }

    if (!animateFlip) {
      flipProgress.value = 0;
    }
  }, [animateFlip, index, state]);

  React.useEffect(() => {
    if (!celebrate) {
      bounceOffset.value = 0;
      return;
    }

    const flipDuration = 350;
    const flipStagger = 120;
    const totalFlipTime = (WORD_LENGTH - 1) * flipStagger + flipDuration;
    const bounceDelay = totalFlipTime + index * 100;

    bounceOffset.value = withDelay(
      bounceDelay,
      withSequence(
        withTiming(-tileSize * 0.3, { duration: 200 }),
        withTiming(0, { duration: 200 }),
      ),
    );
  }, [celebrate, index, tileSize]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0, 1],
    );
    const flipScale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0.95, 1],
    );

    return {
      transform: [{ scaleY }, { scale: flipScale }, { translateY: bounceOffset.value }],
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

  const tileContent = (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.tile,
        stateStyle.tileStyle,
        cursorActive ? styles.tileCursor : null,
        animatedStyle,
        { width: tileSize, height: tileSize, borderRadius: tileSize * 0.18 },
      ]}
    >
      <Text style={[styles.tileText, stateStyle.textStyle, { fontSize }]}>{letter}</Text>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        hitSlop={8}
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius: tileSize * 0.18,
        }}
      >
        {tileContent}
      </Pressable>
    );
  }

  return tileContent;
}

export default React.memo(Tile);
