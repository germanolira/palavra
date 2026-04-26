import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import type { AppTheme } from "../constants/theme";
import { useAppStyles } from "../styles/AppStyles";
import { getTodayDateKey } from "../services/dailyWordStorage";

interface CountdownBannerProps {
  activeDate: string;
  onDateChange: () => void;
  theme: AppTheme;
}

function CountdownBanner({
  activeDate,
  onDateChange,
  theme,
}: CountdownBannerProps) {
  const [countdown, setCountdown] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const styles = useAppStyles(theme);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const todayKey = getTodayDateKey();

      if (todayKey !== activeDate) {
        onDateChange();
        return;
      }

      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        onDateChange();
        return;
      }

      setCountdown({
        hours: String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0"),
        minutes: String(
          Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        ).padStart(2, "0"),
        seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
          2,
          "0",
        ),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeDate, onDateChange]);

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.gameOverHeader}>
      <Text style={styles.gameOverCountdownLabel}>Próxima palavra em</Text>
      <Text style={styles.gameOverCountdown}>
        {countdown.hours}:{countdown.minutes}:{countdown.seconds}
      </Text>
    </Animated.View>
  );
}

export default React.memo(CountdownBanner);
