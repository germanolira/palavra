import React from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { styles } from "../styles/AppStyles";
import { KEYBOARD_ROWS } from "../constants/words";
import type { LetterStates } from "../types";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: LetterStates;
}

function getKeyStyle(state: string | undefined) {
  switch (state) {
    case "correct":
      return styles.keyCorrect;
    case "present":
      return styles.keyPresent;
    case "absent":
      return styles.keyAbsent;
    default:
      return null;
  }
}

function KeyButton({
  label,
  state,
  onPress,
  flex = 1,
}: {
  label: string;
  state?: string;
  onPress: () => void;
  flex?: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { stiffness: 400, damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 15 });
  };

  const { width } = useWindowDimensions();
  const keyHeight = Math.max(46, width * 0.115);
  const fontSize = Math.max(12, width * 0.032);

  const isSpecial = label === "ENTER" || label === "DEL";

  return (
    <Animated.View style={[{ flex }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.key,
          getKeyStyle(state),
          {
            height: keyHeight,
            borderRadius: keyHeight * 0.15,
          },
          isSpecial && styles.keySpecial,
        ]}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <Text style={[styles.keyText, { fontSize }]}>
          {label === "DEL" ? "⌫" : label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Keyboard({ onKeyPress, letterStates }: KeyboardProps) {
  const { width } = useWindowDimensions();
  const gap = Math.max(5, width * 0.012);

  return (
    <View style={[styles.keyboard, { gap, paddingHorizontal: gap }]}>
      {KEYBOARD_ROWS.map((row, i) => (
        <View key={i} style={[styles.keyRow, { gap }]}>
          {row.map((key) => (
            <KeyButton
              key={key}
              label={key}
              state={letterStates[key]}
              onPress={() => onKeyPress(key)}
              flex={key === "ENTER" || key === "DEL" ? 1.5 : 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
