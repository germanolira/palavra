# AGENTS.md

## Reasoning style

Before answering, follow this structured reasoning method strictly:

"Let me analyze this request carefully:

1. **Identify the core objective** – what exactly is being asked, or what is the central problem.
2. **Break the task into subcomponents** – which steps or parts can be handled separately.
3. **Evaluate constraints and edge cases** – are there implicit rules, assumptions, or extreme scenarios to consider?
4. **Formulate a step-by-step solution plan** – what logical sequence leads to the answer.
5. **Execute the reasoning sequentially and verify consistency** – ensure each step aligns with the previous one and with the overall goal."

Apply this process internally before delivering the final answer. For simple questions, keep the reasoning concise, avoiding unnecessary loops or repetition. The focus is efficiency and clarity, preserving deep analytical capacity only when the problem's complexity requires it.

## Skills

Load `react-native-expo-knowledge` (in `.agents/skills/`) **before writing or reviewing any RN/Expo code**. It is a generic RN/Expo cookbook (not project-specific) covering hooks, animations, haptics, theming, AsyncStorage, modals, lists, and performance. The patterns below in this file are the **project-specific application** of that skill — when the two conflict, this file wins for code in this repo.

The Software Mansion `react-native-best-practices` skill is also available and should be used for topics outside the cookbook's scope (Skia, WebGPU, ExecuTorch, audio, rich text, etc.).

## Commands

- `npm start` — `expo start` (NOT `react-native start`)
- `npm test` — runs jest (55+ tests, all must pass)
- `npx tsc --noEmit` — typecheck (no script, run directly)
- `npm run android` / `npm run ios` — `expo run:*` (native builds, requires Xcode/Android SDK)

There is no lint script. Use TypeScript + tests as the verification gate.

## Architecture

- **Entry**: `index.tsx` → `App.tsx`. Root is wrapped in `GestureHandlerRootView` + `SafeAreaProvider`.
- **State**: All game state lives in `App.tsx` via `useState`. No global store. Pass props down; lift handlers up.
- **Stable handlers**: `hooks/useEvent.ts` provides stable-identity callbacks with always-fresh closures. Use it instead of mirroring state into refs.
- **Haptics**: `hooks/useGameHaptics.ts` is the only place that touches `expo-haptics`. Use semantic events.
- **Styles**: `styles/AppStyles.ts` exports `createAppStyles(theme)` AND a cached `useAppStyles(theme)` hook. Components must call `useAppStyles`, never `createAppStyles` inline.
- **Theme**: `constants/theme.ts` exports `LIGHT_THEME` and `DARK_THEME`, both implementing `AppTheme`. Pass `theme` as a prop; do not read color scheme in leaf components.
- **Daily word**: `services/dailyWordStorage.ts` deterministically maps date → word using `data/dailySeed.ts` (`baseDate: 2026-04-22`). Not random.
- **Word lists**:
  - `data/wordlist.ts` — 5374 valid 5-letter Portuguese words (uppercase, no accents).
  - `data/dailySeed.ts` — daily schedule with `difficulty` and `tags`.
  - Source: [Gpossas/Termo](https://github.com/Gpossas/Termo/blob/main/br-utf8.txt-5-letras.txt).
- **Word normalization**: `utils/gameLogic.ts` strips accents, uppercases, and validates against `data/wordlist.ts`.
- **Animations**: `react-native-reanimated` v4. Always include `'worklet';` in gesture and animation callbacks.
- **Persistence**: AsyncStorage with namespaced keys (`appSettings`, `gameGuesses_<date>`). Save effects must be gated on a `ready` flag.

## Key components

- `Board` — flips/sizes tiles based on `useWindowDimensions` and measured `maxHeight`.
- `Tile` — flip + win-celebration bounce, both pure Reanimated worklets.
- `Keyboard` — memoized keys; per-key `onPress` map is built in the parent so identity is stable.
- `BottomSheetModal` — gesture-driven sheet with proper close-animation-then-unmount lifecycle. Use this for any new modal.
- `CountdownBanner`, `Header` — leaf components that take `theme` and minimal props.

## Important

- `data/wordlist.ts` and `data/dailySeed.ts` are sourced from a community list — do not edit manually. Replace by running `node scripts/processNewWordlist.js`.
- Expo managed workflow, single package, no monorepo.
- React 18 / RN 0.83 auto-batch state updates. Do **not** import `unstable_batchedUpdates`.
- Do not commit ad-hoc planning `.md` files in the repo root; put docs under `docs/`.

## Docs

- `README.md` (root) and `docs/README.md` cover overview, architecture, dependencies, folder structure, game mechanics, themes, scripts.
