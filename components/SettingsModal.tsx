import React from "react";
import { Pressable, Switch, Text, View } from "react-native";

import type { AppTheme } from "../constants/theme";
import { createAppStyles } from "../styles/AppStyles";
import BottomSheetModal from "./BottomSheetModal";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  hapticsEnabled: boolean;
  onHapticsChange: (value: boolean) => void;
  globalHapticsEnabled?: boolean;
  activeDate: string;
  dailySeedBaseDate: string;
  dailySeedFinalDate: string;
  theme: AppTheme;
}

function SettingRow({
  label,
  description,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: AppTheme;
}) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);

  return (
    <View style={styles.rowBetween}>
      <View style={styles.rowLabelBlock}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.borderBase,
          true: theme.colorCorrect,
        }}
        thumbColor={value ? theme.textInverse : theme.bgSurface}
      />
    </View>
  );
}

export default function SettingsModal({
  visible,
  onClose,
  darkMode,
  onDarkModeChange,
  hapticsEnabled,
  onHapticsChange,
  activeDate,
  dailySeedBaseDate,
  dailySeedFinalDate,
  theme,
}: SettingsModalProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Configurações"
      theme={theme}
      hapticsEnabled={hapticsEnabled}
      footer={
        <Pressable onPress={onClose} style={styles.secondaryButton} accessibilityRole="button">
          <Text style={styles.secondaryButtonText}>Fechar</Text>
        </Pressable>
      }
    >
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Aparência</Text>
        <SettingRow
          label="Modo escuro"
          description="Usa a nova paleta noturna com contraste mais suave e elegante."
          value={darkMode}
          onValueChange={onDarkModeChange}
          theme={theme}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <SettingRow
          label="Haptics"
          description="Adiciona resposta tátil ao tocar no teclado e nas ações do jogo."
          value={hapticsEnabled}
          onValueChange={onHapticsChange}
          theme={theme}
        />
      </View>

    </BottomSheetModal>
  );
}
