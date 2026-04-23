import React, { useEffect, useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#AED6F1",
  "#D7BDE2",
];

interface PieceConfig {
  id: number;
  color: string;
  width: number;
  height: number;
  startX: number;
  delay: number;
  fallDuration: number;
  rotateDuration: number;
  driftRange: number;
}

function createPieces(count: number, screenWidth: number): PieceConfig[] {
  const pieces: PieceConfig[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: i,
      color: COLORS[i % COLORS.length],
      width: 6 + Math.random() * 8,
      height: 10 + Math.random() * 14,
      startX: Math.random() * screenWidth,
      delay: Math.random() * 1500,
      fallDuration: 3000 + Math.random() * 3000,
      rotateDuration: 1500 + Math.random() * 2500,
      driftRange: 30 + Math.random() * 60,
    });
  }
  return pieces;
}

interface ConfettiPieceProps {
  config: PieceConfig;
  screenHeight: number;
  active: boolean;
}

function ConfettiPiece({ config, screenHeight, active }: ConfettiPieceProps) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      translateY.value = -20;
      translateX.value = 0;
      rotateZ.value = 0;
      opacity.value = 0;
      return;
    }

    opacity.value = withDelay(config.delay, withTiming(1, { duration: 200 }));

    translateY.value = withDelay(
      config.delay,
      withTiming(screenHeight + 40, {
        duration: config.fallDuration,
        easing: Easing.out(Easing.quad),
      }),
    );

    translateX.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftRange, {
            duration: config.rotateDuration / 2,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-config.driftRange, {
            duration: config.rotateDuration / 2,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        -1,
        true,
      ),
    );

    rotateZ.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, {
          duration: config.rotateDuration,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [active, config, screenHeight, opacity, rotateZ, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: config.startX,
          width: config.width,
          height: config.height,
          backgroundColor: config.color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export default function Confetti({ active, count = 80 }: ConfettiProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const pieces = useMemo(
    () => createPieces(count, screenWidth),
    [count, screenWidth],
  );

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          config={piece}
          screenHeight={screenHeight}
          active={active}
        />
      ))}
    </View>
  );
}
