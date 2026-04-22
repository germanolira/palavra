import { PALETTE, DARK_PALETTE } from '../constants/theme';

export function useTheme(darkMode: boolean) {
  return darkMode ? DARK_PALETTE : PALETTE;
}
