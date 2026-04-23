# AGENTS.md

## Commands
- `npm start` - expo start (not react-native start)
- `npm test` - runs jest (no lint/typecheck scripts exist)

## Architecture
- **Entry**: `index.tsx` → `App.tsx`
- **Styles**: `styles/AppStyles.ts` exports `createAppStyles(theme)` - a function that returns StyleSheet, not a static object. All components call this.
- **Daily word**: Determined by date calculation in `services/dailyWordStorage.ts`, not random. Base date: 2026-04-22.
- **Word lists**: 
  - `data/wordlist.ts` - 5374 valid 5-letter Portuguese words (WORDLIST array, uppercase, no accents)
  - `data/dailySeed.ts` - Daily word schedule with difficulty and tags metadata
  - Source: [Gpossas/Termo](https://github.com/Gpossas/Termo/blob/main/br-utf8.txt-5-letras.txt)
- **Word normalization**: `utils/gameLogic.ts` strips accents, uppercases, and validates against `data/wordlist.ts`.

## Important
- **`data/wordlist.ts` and `data/dailySeed.ts`** - sourced from community word list, do not edit manually. Replace by running `node scripts/processNewWordlist.js`.
- **No lint/typecheck** - package.json has no lint or typecheck scripts. Verify with other means if needed.
- **Expo managed workflow** - single package, no monorepo.
- **Animations**: `react-native-reanimated` v4 for tile flips and shake effects.
- **Theme**: Two static themes in `constants/theme.ts` (LIGHT_THEME, DARK_THEME).

## Docs
- **README.md**: Comprehensive documentation covering overview, architecture, dependencies, folder structure, game mechanics, themes, scripts, and important paths (docs/README.md).