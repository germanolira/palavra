import { useCallback, useMemo } from "react";
import * as Haptics from "expo-haptics";

export type GameHapticEvent =
  | "keyTap"
  | "keyBlocked"
  | "navTap"
  | "invalidGuess"
  | "acceptedGuess"
  | "win"
  | "loss";

export function useGameHaptics(enabled: boolean) {
  const play = useCallback(
    (event: GameHapticEvent) => {
      if (!enabled) {
        return;
      }

      switch (event) {
        case "keyTap":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "keyBlocked":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "navTap":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "invalidGuess":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case "acceptedGuess":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "win":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "loss":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    },
    [enabled],
  );

  return useMemo(() => ({ play }), [play]);
}
