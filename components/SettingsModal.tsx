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
  notificationsEnabled: boolean;
  onNotificationsChange: (value: boolean) => void;
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
  isLast = false,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: AppTheme;
  isLast?: boolean;
}) {
  const styles = useAppStyles(theme);

  return (
    <View>
      <View style={[styles.settingsListItem, { paddingHorizontal: 16 }]}>
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
      {!isLast && <View style={[styles.settingsDivider, { marginLeft: 16 }]} />}
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
  notificationsEnabled,
  onNotificationsChange,
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
        <Pressable onPress={onClose} style={styles.primaryButton} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Concluído</Text>
        </Pressable>
      }
    >
      <View style={{ gap: 32, paddingVertical: 8 }}>
        <View style={{ gap: 8 }}>
          <Text style={styles.settingsSectionTitle}>Preferências</Text>
          <View style={{ backgroundColor: theme.bgContainer, borderRadius: 28, overflow: "hidden" }}>
            <SettingRow
              label="Modo escuro"
              description="Usa a nova paleta noturna com contraste mais suave e elegante."
              value={darkMode}
              onValueChange={onDarkModeChange}
              theme={theme}
            />
            <SettingRow
              label="Haptics"
              description="Adiciona resposta tátil ao tocar no teclado e nas ações do jogo."
              value={hapticsEnabled}
              onValueChange={onHapticsChange}
              theme={theme}
            />
            <SettingRow
              label="Notificações"
              description="Receba um lembrete quando uma nova palavra do dia estiver disponível."
              value={notificationsEnabled}
              onValueChange={onNotificationsChange}
              theme={theme}
              isLast={true}
            />
          </View>
        </View>

        {(__DEV__ || debugMode) && onResetDay ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.settingsSectionTitle}>Debug</Text>
            <View style={{ backgroundColor: theme.bgContainer, borderRadius: 28, overflow: "hidden" }}>
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
                style={styles.settingsListItem}
                accessibilityRole="button"
              >
                <Text style={[styles.settingsListItemLabel, { color: theme.colorError }]}>Resetar progresso de hoje</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </BottomSheetModal>
  );
}

export default React.memo(SettingsModal);
