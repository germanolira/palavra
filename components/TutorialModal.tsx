import React from "react";
import { Pressable, Text, View } from "react-native";

import type { AppTheme } from "../constants/theme";
import { createAppStyles } from "../styles/AppStyles";
import BottomSheetModal from "./BottomSheetModal";

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}

function ExampleCard({
  letter,
  label,
  description,
  backgroundColor,
  theme,
}: {
  letter: string;
  label: string;
  description: string;
  backgroundColor: string;
  theme: AppTheme;
}) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);

  return (
    <View style={styles.exampleCard}>
      <View style={[styles.exampleTile, { backgroundColor }]}>
        <Text style={styles.exampleTileText}>{letter}</Text>
      </View>
      <View style={styles.exampleTextContent}>
        <Text style={styles.exampleLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function TutorialModal({
  visible,
  onClose,
  hapticsEnabled = true,
  theme,
}: TutorialModalProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Como jogar"
      theme={theme}
      hapticsEnabled={hapticsEnabled}
      footer={
        <Pressable onPress={onClose} style={styles.primaryButton} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Entendi</Text>
        </Pressable>
      }
    >
      <View style={styles.sectionCard}>
        <Text style={styles.modalText}>
          Descubra a palavra do dia em até 6 tentativas. Cada palpite precisa ter 5 letras válidas.
        </Text>
      </View>

      <View style={styles.tutorialExamples}>
        <ExampleCard
          letter="P"
          label="Correta"
          description="A letra existe e está na posição certa."
          backgroundColor={theme.colorCorrect}
          theme={theme}
        />
        <ExampleCard
          letter="R"
          label="Presente"
          description="A letra existe, mas fica em outra posição."
          backgroundColor={theme.colorPresent}
          theme={theme}
        />
        <ExampleCard
          letter="A"
          label="Ausente"
          description="A letra não faz parte da palavra."
          backgroundColor={theme.colorAbsent}
          theme={theme}
        />
      </View>
    </BottomSheetModal>
  );
}
