import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { styles } from "../styles/AppStyles";
import { PALETTE, DARK_PALETTE } from "../constants/theme";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  hapticsEnabled: boolean;
  onHapticsChange: (value: boolean) => void;
  globalHapticsEnabled?: boolean;
}

function SettingRow({
  label,
  value,
  onValueChange,
  hapticsEnabled = true,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hapticsEnabled?: boolean;
}) {
  const handleToggle = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text style={[styles.modalText, { textAlign: "left", fontSize: 16 }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{
          false: PALETTE.surfaceContainerHigh,
          true: PALETTE.primary,
        }}
        thumbColor={value ? PALETTE.primaryContainer : PALETTE.surface}
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
  globalHapticsEnabled = true,
}: SettingsModalProps) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: visible ? "auto" : "none",
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.9, 1]) },
      { translateY: interpolate(progress.value, [0, 1], [16, 0]) },
    ],
  }));

  if (!visible && progress.value === 0) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={[styles.modal, modalStyle, { gap: 16 }]}>
        <Text style={styles.modalTitle}>Configurações</Text>

        <SettingRow
          label="Modo escuro"
          value={darkMode}
          onValueChange={onDarkModeChange}
          hapticsEnabled={globalHapticsEnabled}
        />

        <SettingRow
          label="Haptics"
          value={hapticsEnabled}
          onValueChange={onHapticsChange}
          hapticsEnabled={globalHapticsEnabled}
        />

        <Pressable
          onPress={() => {
            if (globalHapticsEnabled)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
          style={[styles.button, { marginTop: 4 }]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Fechar</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
