import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { AppTheme } from "../constants/theme";
import { KEYBOARD_ROWS } from "../constants/words";
import { createAppStyles } from "../styles/AppStyles";
import type { LetterStates } from "../types";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: LetterStates;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}

function getKeyStyle(state: string | undefined, styles: ReturnType<typeof createAppStyles>) {
  switch (state) {
    case "correct":
      return { keyStyle: styles.keyCorrect, textStyle: styles.keyCorrectText };
    case "present":
      return { keyStyle: styles.keyPresent, textStyle: styles.keyPresentText };
    case "absent":
      return { keyStyle: styles.keyAbsent, textStyle: styles.keyAbsentText };
    default:
      return { keyStyle: null, textStyle: null };
  }
}

function KeyButton({
  label,
  state,
  onPress,
  flex = 1,
  hapticsEnabled = true,
  theme,
}: {
  label: string;
  state?: string;
  onPress: () => void;
  flex?: number;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const scale = useSharedValue(1);
  const { width } = useWindowDimensions();
  const keyHeight = Math.max(42, width * 0.105);
  const fontSize = Math.max(12, width * 0.032);
  const isSpecial = label === "ENTER" || label === "DEL";
  const { keyStyle, textStyle } = getKeyStyle(state, styles);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { stiffness: 380, damping: 18 });

    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 380, damping: 18 });
  };

  return (
    <Animated.View style={[{ flex }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.key,
          keyStyle,
          isSpecial ? styles.keySpecial : null,
          { height: keyHeight, borderRadius: keyHeight * 0.24 },
        ]}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        {label === "DEL" ? (
          <MaterialCommunityIcons name="backspace-outline" size={18} color={textStyle ? theme.textInverse : theme.textMain} />
        ) : label === "ENTER" ? (
          <MaterialCommunityIcons name="keyboard-return" size={18} color={textStyle ? theme.textInverse : theme.textMain} />
        ) : (
          <Text style={[styles.keyText, textStyle, { fontSize }]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function Keyboard({
  onKeyPress,
  letterStates,
  hapticsEnabled = true,
  theme,
}: KeyboardProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // Responsive gap based on device width
  const gap = Math.max(5, width * 0.012);
  
  // Horizontal padding: responsive with minimum of 12px, max 5% of width
  const horizontalPadding = Math.max(12, Math.min(width * 0.05, 24));
  
  // Vertical padding: inset bottom + 12px minimum, top 8px
  const verticalPaddingBottom = Math.max(8, insets.bottom);
  const verticalPaddingTop = 4;

  return (
    <View
      style={[
        styles.keyboard,
        {
          gap,
          paddingHorizontal: horizontalPadding,
          paddingTop: verticalPaddingTop,
          paddingBottom: verticalPaddingBottom,
        },
      ]}
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.keyRow, { gap }]}>
          {row.map((key) => (
            <KeyButton
              key={key}
              label={key}
              state={letterStates[key]}
              onPress={() => onKeyPress(key)}
              flex={key === "ENTER" || key === "DEL" ? 1.5 : 1}
              hapticsEnabled={hapticsEnabled}
              theme={theme}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
