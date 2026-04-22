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
      title={won ? "Voce venceu" : "Fim de jogo"}
      theme={theme}
      hapticsEnabled={hapticsEnabled}
      dismissible={false}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.gameOverEmoji}>{won ? "🎉" : "😢"}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.modalText}>
          {won
            ? "Parabens! Voce encontrou a palavra certa."
            : "A rodada terminou. A resposta era:"}
        </Text>
        <Text style={styles.gameOverWord}>{target}</Text>
        <Text style={styles.rowDescription}>
          {won
            ? "Continue tentando amanha para manter sua sequencia!"
            : "Nao desista, tente novamente amanha com uma nova palavra!"}
        </Text>
      </View>

      <Pressable onPress={onRestart} style={styles.primaryButtonLarge} accessibilityRole="button">
        <Text style={styles.primaryButtonLargeText}>Proxima rodada</Text>
      </Pressable>
    </BottomSheetModal>
  );
}
