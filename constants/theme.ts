export interface AppTheme {
  background: string;
  backgroundAccent: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceStrong: string;
  text: string;
  textMuted: string;
  textOnPrimary: string;
  primary: string;
  primaryStrong: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  borderStrong: string;
  overlay: string;
  shadow: string;
  tileEmpty: string;
  tileActive: string;
  tileAbsent: string;
  keyboardIdle: string;
  keyboardSpecial: string;
  keyboardAbsent: string;
  switchTrackOff: string;
  debugBackground: string;
}

export const LIGHT_THEME: AppTheme = {
  background: "#fdf9f0",
  backgroundAccent: "#f7f3ea",
  surface: "#ffffff",
  surfaceElevated: "#f7f3ea",
  surfaceMuted: "#ece8df",
  surfaceStrong: "#e6e2d9",
  text: "#1c1c16",
  textMuted: "#434840",
  textOnPrimary: "#ffffff",
  primary: "#476344",
  primaryStrong: "#324d30",
  success: "#476344",
  warning: "#fec178",
  danger: "#ba1a1a",
  border: "#c3c8be",
  borderStrong: "#737970",
  overlay: "rgba(28, 28, 22, 0.48)",
  shadow: "rgba(28, 28, 22, 0.12)",
  tileEmpty: "#f1eee5",
  tileActive: "#fdf9f0",
  tileAbsent: "#e6e2d9",
  keyboardIdle: "#ece8df",
  keyboardSpecial: "#c3c8be",
  keyboardAbsent: "#e6e2d9",
  switchTrackOff: "#c3c8be",
  debugBackground: "#fec178",
} as const;

export const DARK_THEME: AppTheme = {
  background: "#1c1c16",
  backgroundAccent: "#262620",
  surface: "#262620",
  surfaceElevated: "#31302b",
  surfaceMuted: "#3b3a34",
  surfaceStrong: "#46453e",
  text: "#f4f0e7",
  textMuted: "#c3c8be",
  textOnPrimary: "#ffffff",
  primary: "#afcfa9",
  primaryStrong: "#cbebc3",
  success: "#afcfa9",
  warning: "#f8bb73",
  danger: "#ffdad6",
  border: "#46453e",
  borderStrong: "#5c5c5a",
  overlay: "rgba(0, 0, 0, 0.62)",
  shadow: "rgba(0, 0, 0, 0.34)",
  tileEmpty: "#262620",
  tileActive: "#31302b",
  tileAbsent: "#46453e",
  keyboardIdle: "#31302b",
  keyboardSpecial: "#46453e",
  keyboardAbsent: "#3b3a34",
  switchTrackOff: "#46453e",
  debugBackground: "#825516",
};
