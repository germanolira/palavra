import React from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const [isRendered, setIsRendered] = React.useState(visible);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const OPEN_DURATION = 240;
  const CLOSE_DURATION = 260;

  React.useEffect(() => {
    if (visible) {
      setIsRendered(true);
      progress.value = withTiming(1, { duration: OPEN_DURATION, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: Easing.out(Easing.cubic) });
    } else {
      progress.value = withTiming(0, { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) });
      translateY.value = withTiming(
        600,
        { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) },
        () => {
          runOnJS(setIsRendered)(false);
        },
      );
    }
  }, [visible, progress, translateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    pointerEvents: visible ? "auto" : "none",
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [0, 1]),
    transform: [{ translateY: translateY.value }],
  }));

  const handleDismiss = React.useCallback(() => {
    if (!dismissible || !onClose) {
      return;
    }

    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    progress.value = withTiming(0, { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) });
    translateY.value = withTiming(
      600,
      { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) },
      () => {
        if (onClose) {
          runOnJS(onClose)();
        }
      },
    );
  }, [dismissible, onClose, hapticsEnabled, progress, translateY]);

  const panGesture = Gesture.Pan()
    .activeOffsetY([5, 5])
    .failOffsetX([-20, 20])
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      translateY.value = Math.max(0, newY);
    })
    .onEnd((event) => {
      if (translateY.value > 120 || event.velocityY > 800) {
        translateY.value = withTiming(
          600,
          { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) },
          () => {
            if (onClose) {
              runOnJS(onClose)();
            }
          },
        );
        progress.value = withTiming(0, { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) });
      } else {
        translateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      }
    });

  if (!isRendered) {
    return null;
  }

  const maxHeight = screenHeight - insets.top - 20;

  return (
    <Animated.View style={[styles.sheetOverlay, overlayStyle]}>
      <Pressable
        style={styles.sheetBackdrop}
        onPress={handleDismiss}
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
        <GestureDetector gesture={panGesture}>
          <View>
            <View style={styles.sheetHandleWrapper}>
              <View style={styles.sheetHandle} />
            </View>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              {dismissible && onClose ? (
                <Pressable
                  onPress={handleDismiss}
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
          </View>
        </GestureDetector>

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
