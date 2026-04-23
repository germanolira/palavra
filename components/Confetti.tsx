import React, { useEffect, useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
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
  startXDrift: number;
  delay: number;
  fallDuration: number;
  rotateDuration: number;
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
      startXDrift: (Math.random() - 0.5) * 80,
      delay: Math.random() * 1500,
      fallDuration: 3000 + Math.random() * 3000,
      rotateDuration: 1500 + Math.random() * 2500,
    });
  }
  return pieces;
}

interface ConfettiPieceProps {
  config: PieceConfig;
  screenHeight: number;
  active: boolean;
}

const ConfettiPiece = React.memo(function ConfettiPiece({
  config,
  screenHeight,
  active,
}: ConfettiPieceProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }

    progress.value = withDelay(
      config.delay,
      withTiming(1, {
        duration: config.fallDuration,
        easing: Easing.out(Easing.quad),
      }),
    );
  }, [active, config.delay, config.fallDuration, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const y = -20 + p * (screenHeight + 60);
    const drift = config.startXDrift * Math.sin(p * Math.PI * 3);
    const rotation = p * 1080 * (config.startXDrift > 0 ? 1 : -1);

    return {
      transform: [
        { translateX: config.startX + drift },
        { translateY: y },
        { rotateZ: `${rotation}deg` },
      ],
      opacity: Math.min(1, p * 8) * (1 - Math.max(0, (p - 0.85) / 0.15)),
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          width: config.width,
          height: config.height,
          backgroundColor: config.color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
});

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export default function Confetti({ active, count = 40 }: ConfettiProps) {
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
