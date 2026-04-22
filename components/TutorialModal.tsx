import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { styles } from "../styles/AppStyles";
import { PALETTE } from "../constants/theme";

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
  hapticsEnabled?: boolean;
}

function ExampleTile({
  letter,
  bg,
  label,
}: {
  letter: string;
  bg: string;
  label: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[styles.tileText, { fontSize: 16, color: "#fff" }]}>
          {letter}
        </Text>
      </View>
      <Text style={[styles.modalText, { fontSize: 12 }]}>{label}</Text>
    </View>
  );
}

export default function TutorialModal({
  visible,
  onClose,
  hapticsEnabled = true,
}: TutorialModalProps) {
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
        <Text style={styles.modalTitle}>Como jogar</Text>

        <Text style={[styles.modalText, { textAlign: "left", width: "100%" }]}>
          Adivinhe a palavra em 6 tentativas. Cada palavra deve ter 5 letras.
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginVertical: 8 }}>
          <ExampleTile
            letter="P"
            bg={PALETTE.primaryContainer}
            label="Correta"
          />
          <ExampleTile
            letter="R"
            bg={PALETTE.secondaryContainer}
            label="Presente"
          />
          <ExampleTile
            letter="A"
            bg={PALETTE.surfaceContainerHigh}
            label="Ausente"
          />
        </View>

        <Text style={[styles.modalText, { textAlign: "left", width: "100%" }]}>
          • Verde: letra está na posição certa{"\n"}• Amarelo: letra existe, mas
          em outra posição{"\n"}• Cinza: letra não existe na palavra
        </Text>

        <Pressable
          onPress={() => {
            if (hapticsEnabled)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
          style={[styles.button, { marginTop: 4 }]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Entendi</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
