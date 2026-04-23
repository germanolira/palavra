import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import type { AppTheme } from "../constants/theme";
import { createAppStyles } from "../styles/AppStyles";
import Confetti from "./Confetti";

interface VictoryScreenProps {
  won: boolean;
  target: string;
  hapticsEnabled?: boolean;
  theme: AppTheme;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function VictoryScreen({
  won,
  target,
  hapticsEnabled = true,
  theme,
}: VictoryScreenProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);

  useEffect(() => {
    if (!hapticsEnabled) {
      return;
    }

    Haptics.notificationAsync(
      won
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );
  }, [hapticsEnabled, won]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.overlay,
        zIndex: 100,
      }}
    >
      {won ? <Confetti active /> : null}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
      >
        <Text style={styles.gameOverWord}>{target}</Text>

        <View
          style={{
            backgroundColor: theme.bgSurface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.borderBase,
            paddingVertical: 16,
            paddingHorizontal: 28,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "BeVietnamPro_500Medium",
              fontSize: 13,
              color: theme.textMuted,
              marginBottom: 6,
            }}
          >
            Próxima palavra em
          </Text>
          <Text
            style={{
              fontFamily: "BeVietnamPro_700Bold",
              fontSize: 32,
              color: theme.textMain,
              letterSpacing: 3,
            }}
          >
            {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </Text>
        </View>
      </View>
    </View>
  );
}
