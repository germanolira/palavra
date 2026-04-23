export interface AppTheme {
  bgBase: string;
  bgSurface: string;
  textMain: string;
  textMuted: string;
  textInverse: string;
  borderBase: string;
  colorCorrect: string;
  colorPresent: string;
  colorAbsent: string;
  colorAbsentKey: string;
  colorError: string;
  overlay: string;
}

export const LIGHT_THEME: AppTheme = {
  bgBase: "#fdf9f0",
  bgSurface: "#ece8df",
  textMain: "#1c1c16",
  textMuted: "#434840",
  textInverse: "#ffffff",
  borderBase: "#c3c8be",
  colorCorrect: "#2d4a2b",
  colorPresent: "#d97706",
  colorAbsent: "#312a2c",
  colorAbsentKey: "#c4bfb8",
  colorError: "#ba1a1a",
  overlay: "rgba(28, 28, 22, 0.48)",
} as const;

export const DARK_THEME: AppTheme = {
  bgBase: "#1a1a1a",
  bgSurface: "#2d2d2d",
  textMain: "#f0f0f0",
  textMuted: "#949494",
  textInverse: "#ffffff",
  borderBase: "#404040",
  colorCorrect: "#6a9a5e",
  colorPresent: "#c27f2e",
  colorAbsent: "#52525b",
  colorAbsentKey: "#52525b",
  colorError: "#ffdad6",
  overlay: "rgba(0, 0, 0, 0.62)",
} as const;
