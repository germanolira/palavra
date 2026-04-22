import { DARK_THEME, LIGHT_THEME } from "../constants/theme";

export function useTheme(darkMode: boolean) {
  return darkMode ? DARK_THEME : LIGHT_THEME;
}
