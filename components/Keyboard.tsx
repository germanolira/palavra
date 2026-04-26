import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { AppTheme } from "../constants/theme";
import { KEYBOARD_ROWS } from "../constants/words";
import { useAppStyles } from "../styles/AppStyles";
import type { LetterStates } from "../types";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: LetterStates;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}

function getKeyStyle(state: string | undefined, styles: ReturnType<typeof useAppStyles>) {
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

interface KeyButtonProps {
  label: string;
  state?: string;
  onPress: () => void;
  flex?: number;
  theme: AppTheme;
  keyHeight: number;
  fontSize: number;
}

function KeyButton({
  label,
  state,
  onPress,
  flex = 1,
  theme,
  keyHeight,
  fontSize,
}: KeyButtonProps) {
  const styles = useAppStyles(theme);
  const scale = useSharedValue(1);
  const isSpecial = label === "ENTER" || label === "DEL";
  const { keyStyle, textStyle } = getKeyStyle(state, styles);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = React.useCallback(() => {
    scale.value = withTiming(0.94, { duration: 80 });
  }, [scale]);

  const handlePressOut = React.useCallback(() => {
    scale.value = withTiming(1, { duration: 80 });
  }, [scale]);

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

const KeyButtonMemo = React.memo(KeyButton, (prev, next) => {
  return prev.label === next.label
    && prev.state === next.state
    && prev.flex === next.flex
    && prev.theme === next.theme
    && prev.keyHeight === next.keyHeight
    && prev.fontSize === next.fontSize
    && prev.onPress === next.onPress;
});

function Keyboard({
  onKeyPress,
  letterStates,
  theme,
}: Omit<KeyboardProps, "hapticsEnabled"> & { hapticsEnabled?: boolean }) {
  const styles = useAppStyles(theme);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const gap = Math.max(5, width * 0.012);
  const horizontalPadding = Math.max(12, Math.min(width * 0.05, 24));
  const verticalPaddingBottom = Math.max(8, insets.bottom);
  const verticalPaddingTop = 4;

  const keyHeight = React.useMemo(() => Math.max(42, width * 0.105), [width]);
  const fontSize = React.useMemo(() => Math.max(12, width * 0.032), [width]);

  const keyHandlers = React.useMemo(() => {
    const handlers: Record<string, () => void> = {};
    for (const row of KEYBOARD_ROWS) {
      for (const key of row) {
        handlers[key] = () => onKeyPress(key);
      }
    }
    return handlers;
  }, [onKeyPress]);

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
            <KeyButtonMemo
              key={key}
              label={key}
              state={letterStates[key]}
              onPress={keyHandlers[key]}
              flex={key === "ENTER" || key === "DEL" ? 1.5 : 1}
              theme={theme}
              keyHeight={keyHeight}
              fontSize={fontSize}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default React.memo(Keyboard);
