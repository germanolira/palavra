import React from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

import type { AppTheme } from "../constants/theme";
import { useAppStyles } from "../styles/AppStyles";
import BottomSheetModal from "./BottomSheetModal";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  hapticsEnabled: boolean;
  onHapticsChange: (value: boolean) => void;
  theme: AppTheme;
  debugMode?: boolean;
  onResetDay?: () => void;
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
  const styles = useAppStyles(theme);

  return (
    <View style={styles.settingsListItem}>
      <View style={styles.settingsListItemLabelBlock}>
        <Text style={styles.settingsListItemLabel}>{label}</Text>
        <Text style={styles.settingsListItemDescription}>{description}</Text>
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

function SettingsModal({
  visible,
  onClose,
  darkMode,
  onDarkModeChange,
  hapticsEnabled,
  onHapticsChange,
  theme,
  debugMode,
  onResetDay,
}: SettingsModalProps) {
  const styles = useAppStyles(theme);

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
      <View style={styles.settingsSectionFirst}>
        <Text style={styles.settingsSectionTitle}>Aparência</Text>
        <SettingRow
          label="Modo escuro"
          description="Usa a nova paleta noturna com contraste mais suave e elegante."
          value={darkMode}
          onValueChange={onDarkModeChange}
          theme={theme}
        />
      </View>

      <View style={styles.settingsDivider} />

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Feedback</Text>
        <SettingRow
          label="Haptics"
          description="Adiciona resposta tátil ao tocar no teclado e nas ações do jogo."
          value={hapticsEnabled}
          onValueChange={onHapticsChange}
          theme={theme}
        />
      </View>

      {(__DEV__ || debugMode) && onResetDay ? (
        <>
          <View style={styles.settingsDivider} />
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Debug</Text>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Resetar dia",
                  "Tem certeza que deseja apagar as tentativas de hoje?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Resetar",
                      style: "destructive",
                      onPress: onResetDay,
                    },
                  ],
                );
              }}
              style={styles.dangerButton}
              accessibilityRole="button"
            >
              <Text style={styles.dangerButtonText}>Resetar dia</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </BottomSheetModal>
  );
}

export default React.memo(SettingsModal);
