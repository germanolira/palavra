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
      <Text style={styles.exampleLabel}>{label}</Text>
      <Text style={[styles.rowDescription, { textAlign: "center" }]}>{description}</Text>
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
    >
      <View style={styles.sectionCard}>
        <Text style={styles.modalText}>
          Descubra a palavra do dia em ate 6 tentativas. Cada palpite precisa ter 5 letras validas.
        </Text>
      </View>

      <View style={styles.tutorialExamples}>
        <ExampleCard
          letter="P"
          label="Correta"
          description="A letra existe e esta na posicao certa."
          backgroundColor={theme.success}
          theme={theme}
        />
        <ExampleCard
          letter="R"
          label="Presente"
          description="A letra existe, mas fica em outra posicao."
          backgroundColor={theme.warning}
          theme={theme}
        />
        <ExampleCard
          letter="A"
          label="Ausente"
          description="A letra nao faz parte da palavra."
          backgroundColor={theme.tileAbsent}
          theme={theme}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Dicas</Text>
        <View style={styles.bulletBlock}>
          <Text style={styles.bulletText}>Use as cores do tabuleiro para ajustar o proximo palpite.</Text>
          <Text style={styles.bulletText}>As teclas tambem mudam de cor para mostrar o melhor estado de cada letra.</Text>
          <Text style={styles.bulletText}>Tente abrir com vogais e consoantes comuns para ganhar informacao cedo.</Text>
        </View>
      </View>

      <Pressable onPress={onClose} style={styles.primaryButton} accessibilityRole="button">
        <Text style={styles.primaryButtonText}>Entendi</Text>
      </Pressable>
    </BottomSheetModal>
  );
}
