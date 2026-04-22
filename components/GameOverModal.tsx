import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { styles } from "../styles/AppStyles";

interface GameOverModalProps {
  won: boolean;
  target: string;
  onRestart: () => void;
  hapticsEnabled?: boolean;
}

export default function GameOverModal({
  won,
  target,
  onRestart,
  hapticsEnabled = true,
}: GameOverModalProps) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(1, { duration: 350 });
    if (hapticsEnabled) {
      Haptics.notificationAsync(
        won
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
  }, [won, hapticsEnabled]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.85, 1]) },
      { translateY: interpolate(progress.value, [0, 1], [20, 0]) },
    ],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={[styles.modal, modalStyle]}>
        <Text style={styles.modalTitle}>
          {won ? "🎉 Parabéns!" : "😢 Fim de jogo"}
        </Text>
        <Text style={styles.modalText}>
          {won ? "Você acertou a palavra!" : "A palavra correta era:"}
        </Text>
        <Text style={styles.modalWord}>{target}</Text>
        <Pressable
          onPress={onRestart}
          style={styles.button}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Jogar novamente</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
