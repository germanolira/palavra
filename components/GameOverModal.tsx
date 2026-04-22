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
      <View style={styles.sectionCard}>
        <Text style={styles.modalText}>
          {won
            ? "Boa. Voce encontrou a palavra certa e fechou a rodada."
            : "A rodada terminou. A resposta correta desta vez era:"}
        </Text>
        <Text style={styles.modalWord}>{target}</Text>
      </View>

      <Pressable onPress={onRestart} style={styles.primaryButton} accessibilityRole="button">
        <Text style={styles.primaryButtonText}>Repetir rodada</Text>
      </Pressable>
    </BottomSheetModal>
  );
}
