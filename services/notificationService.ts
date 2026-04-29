import * as Notifications from "expo-notifications";

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedule a local notification for when the next daily word is available.
 *
 * Timing: hours until midnight + a random delay of 1–18 hours on top.
 * Cancels any previously scheduled notifications first so reschedules are clean.
 */
export async function scheduleNextWordNotification(): Promise<void> {
  await cancelScheduledNotifications();

  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();

  // Random extra delay between 1 and 18 hours (in ms)
  const extraHours = Math.floor(Math.random() * 18) + 1;
  const delayMs = msUntilMidnight + extraHours * 60 * 60 * 1000;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Palavra",
      body: "Uma nova palavra do dia está esperando por você! 🎯",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.round(delayMs / 1000),
    },
  });
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
