import React from "react";
import { Pressable, Text, View } from "react-native";

import type { AppTheme } from "../constants/theme";
import { useAppStyles } from "../styles/AppStyles";
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
  const styles = useAppStyles(theme);

  return (
    <View style={[styles.exampleCard, { backgroundColor: theme.bgBase, borderWidth: 0 }]}>
      <View style={[styles.exampleTile, { backgroundColor, shadowColor: backgroundColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 }]}>
        <Text style={styles.exampleTileText}>{letter}</Text>
      </View>
      <View style={styles.exampleTextContent}>
        <Text style={[styles.exampleLabel, { fontSize: 17 }]}>{label}</Text>
        <Text style={[styles.rowDescription, { lineHeight: 18 }]}>{description}</Text>
      </View>
    </View>
  );
}

function TutorialModal({
  visible,
  onClose,
  hapticsEnabled = true,
  theme,
}: TutorialModalProps) {
  const styles = useAppStyles(theme);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Como jogar"
      theme={theme}
      hapticsEnabled={hapticsEnabled}
      footer={
        <Pressable onPress={onClose} style={styles.primaryButton} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Entendi, vamos jogar!</Text>
        </Pressable>
      }
    >
      <View style={{ gap: 24, paddingVertical: 8 }}>
        <View style={{ backgroundColor: theme.bgContainer, padding: 24, borderRadius: 28 }}>
          <Text style={[styles.modalText, { textAlign: "center", color: theme.textMain, fontSize: 15 }]}>
            Adivinhe a palavra do dia em até 6 tentativas.{"\n"}
            Cada palpite deve ser uma palavra válida de 5 letras.
          </Text>
        </View>

        <View style={styles.tutorialExamples}>
          <Text style={[styles.settingsSectionTitle, { marginBottom: 4 }]}>Exemplos</Text>
          <ExampleCard
            letter="P"
            label="Correta"
            description="A letra 'P' existe e está na posição certa."
            backgroundColor={theme.colorCorrect}
            theme={theme}
          />
          <ExampleCard
            letter="R"
            label="Presente"
            description="A letra 'R' existe, mas fica em outra posição."
            backgroundColor={theme.colorPresent}
            theme={theme}
          />
          <ExampleCard
            letter="A"
            label="Ausente"
            description="A letra 'A' não faz parte da palavra."
            backgroundColor={theme.colorAbsent}
            theme={theme}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
}

export default React.memo(TutorialModal);
