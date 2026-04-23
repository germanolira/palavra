import React from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import type { AppTheme } from "../constants/theme";
import { createAppStyles } from "../styles/AppStyles";
import BottomSheetModal from "./BottomSheetModal";

interface GameOverModalProps {
  won: boolean;
  target: string;
  onRestart: () => void;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}

export default function GameOverModal({
  won,
  target,
  onRestart,
  hapticsEnabled = true,
  theme,
}: GameOverModalProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);

  React.useEffect(() => {
    if (!hapticsEnabled) {
      return;
    }

    Haptics.notificationAsync(
      won
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );
  }, [hapticsEnabled, won]);

  return (
    <BottomSheetModal
      visible
      title={won ? "Você venceu!" : "Fim de jogo"}
      theme={theme}
      hapticsEnabled={hapticsEnabled}
      dismissible={false}
      footer={
        <Pressable onPress={onRestart} style={styles.primaryButton} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Próxima rodada</Text>
        </Pressable>
      }
    >
      <View style={styles.modalHeader}>
        <Text style={styles.gameOverEmoji}>{won ? "🎉" : "😢"}</Text>
      </View>

      <Text style={[styles.modalText, { textAlign: "center" }]}>
        {won
          ? "Parabéns! Você encontrou a palavra certa."
          : "A rodada terminou. A resposta era:"}
      </Text>

      <Text style={styles.modalGameOverWord}>{target}</Text>

      <Text style={[styles.rowDescription, { textAlign: "center" }]}>
        {won
          ? "Continue jogando amanhã para manter sua sequência!"
          : "Não desista, tente novamente amanhã com uma nova palavra!"}
      </Text>
    </BottomSheetModal>
  );
}
