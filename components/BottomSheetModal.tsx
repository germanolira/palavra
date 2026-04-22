import React from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { createAppStyles } from "../styles/AppStyles";
import type { AppTheme } from "../constants/theme";

interface BottomSheetModalProps {
  visible: boolean;
  onClose?: () => void;
  title: string;
  theme: AppTheme;
  hapticsEnabled?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
}

export default function BottomSheetModal({
  visible,
  onClose,
  title,
  theme,
  hapticsEnabled = true,
  children,
  footer,
  dismissible = true,
}: BottomSheetModalProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  React.useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 260 });
  }, [progress, visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: visible ? "auto" : "none",
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [600, 0]),
      },
    ],
  }));

  if (!visible && progress.value === 0) {
    return null;
  }

  const handleClose = () => {
    if (!dismissible || !onClose) {
      return;
    }

    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onClose();
  };

  const maxHeight = screenHeight - insets.top - 20;

  return (
    <Animated.View style={[styles.sheetOverlay, overlayStyle]}>
      <Pressable
        style={styles.sheetBackdrop}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar modal"
      />
      <Animated.View
        style={[
          styles.sheet,
          sheetStyle,
          {
            maxHeight,
            paddingBottom: Math.max(24, insets.bottom),
          },
        ]}
      >
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          {dismissible && onClose ? (
            <Pressable
              onPress={handleClose}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={`Fechar ${title}`}
            >
              <Text style={styles.iconButtonText}>X</Text>
            </Pressable>
          ) : (
            <View style={styles.iconButtonSpacer} />
          )}
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.sheetScrollView}
          contentContainerStyle={styles.sheetContent}
          bounces={false}
        >
          {children}
        </ScrollView>
        
        {footer ? <View style={styles.sheetFooter}>{footer}</View> : null}
      </Animated.View>
    </Animated.View>
  );
}
