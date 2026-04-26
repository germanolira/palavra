export interface AppTheme {
  bgBase: string;
  bgSurface: string;
  bgContainer: string;
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
  bgBase: "#f3f1ed",
  bgSurface: "#ebe8e3",
  bgContainer: "#e2dfd9",
  textMain: "#1c1917",
  textMuted: "#78716c",
  textInverse: "#ffffff",
  borderBase: "#d6d3d1",
  colorCorrect: "#16a34a",
  colorPresent: "#f59e0b",
  colorAbsent: "#57534e",
  colorAbsentKey: "#a8a29e",
  colorError: "#ef4444",
  overlay: "rgba(28, 25, 23, 0.55)",
} as const;

export const DARK_THEME: AppTheme = {
  bgBase: "#121212",
  bgSurface: "#1e1e1e",
  bgContainer: "#2c2c2e",
  textMain: "#ffffff",
  textMuted: "#8e8e93",
  textInverse: "#f2f2f7",
  borderBase: "#38383a",
  colorCorrect: "#6aaa64",
  colorPresent: "#c9b458",
  colorAbsent: "#636366",
  colorAbsentKey: "#48484a",
  colorError: "#e8453c",
  overlay: "rgba(0, 0, 0, 0.70)",
} as const;
