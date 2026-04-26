---
name: react-native-expo-knowledge
description: Practical performance, animation, state, and architecture patterns for React Native + Expo apps on the New Architecture. Use when writing or reviewing components, hooks, animations, gestures, modals, theming, AsyncStorage, lists, or any RN/Expo code. Triggers on React Native, Expo, Reanimated, Skia, gesture handler, AsyncStorage, useEffect, useMemo, memo, FlatList, FlashList, StyleSheet, haptics, dark mode, performance, re-render, animation, or worklet work.
---

# React Native + Expo Knowledge

Reusable cookbook for any React Native + Expo project on the New Architecture (Fabric + TurboModules + React 18+). Pick the sections that apply; ignore what doesn't.

## 1. Stable callbacks with `useEvent`

When a handler is passed to a deeply memoized child or invoked from another callback, you usually want **stable identity + always-fresh closure**. Avoid the "mirror every state in a `useRef`" anti-pattern.

```ts
// hooks/useEvent.ts
import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const ref = useRef(handler);
  useLayoutEffect(() => { ref.current = handler });
  return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
```

Use for: input handlers, modal open/close, async loaders consumed by `useEffect` with `[]`. **Don't** use for callbacks whose identity legitimately needs to change to retrigger an effect.

## 2. StyleSheet caching by theme

`StyleSheet.create({...})` allocates a new style ID on every call. If you build styles per-theme, cache them by reference:

```ts
const cache = new Map<Theme, ReturnType<typeof create>>();
export function useStyles(theme: Theme) {
  return useMemo(() => {
    if (!cache.has(theme)) cache.set(theme, create(theme));
    return cache.get(theme)!;
  }, [theme]);
}
function create(theme: Theme) { return StyleSheet.create({ /* ... */ }); }
```

Always call the hook; never call the underlying factory inside render.

## 3. Centralize haptics

Wrap `expo-haptics` in a single hook with **semantic events**:

```ts
type Event = "tap" | "selection" | "success" | "warning" | "error";
export function useHaptics(enabled: boolean) {
  return useCallback((e: Event) => {
    if (!enabled) return;
    switch (e) { /* map to Haptics.* */ }
  }, [enabled]);
}
```

Benefits: one place to gate by user setting, no duplicate triggers across components, easy to swap providers later. Never call `Haptics.impactAsync` directly from leaf components — that's how you get double-buzz bugs.

## 4. Reanimated v4 / worklets

- Mark every gesture and animation callback (including `withTiming` completion callbacks) with `'worklet';` at the top.
- `withTiming` for short UI feedback (60–200 ms). `withSpring` for elastic motion — tune `stiffness/damping`; defaults are too slow for keystrokes.
- Stagger with `withDelay(index * STAGGER, ...)` instead of JS-thread `setTimeout`.
- Chain with `withSequence`:

```ts
shake.value = withSequence(
  withTiming(-4, { duration: 50 }),
  withTiming(4,  { duration: 50 }),
  withTiming(0,  { duration: 50 }),
);
```

- Use `interpolate` inside `useAnimatedStyle` instead of toggling JS state.
- For brief celebration/feedback effects, prefer a small staggered transform animation over a full Skia particle system — saves a Skia surface and many JS-thread frames.
- Cross-thread calls: `runOnJS(...)` from worklet → JS, `runOnUI(...)` from JS → worklet.

## 5. Memoization heuristics

- `React.memo` is worth it for list rows, keyboard keys, tiles — anything rendered N times whose parent re-renders often.
- Custom comparator when props include functions/objects. Pre-build a **stable map** of per-key handlers in the parent so child `onPress` identity is stable:

```ts
const handlers = useMemo(() => Object.fromEntries(
  KEYS.map(k => [k, () => onPress(k)])
), [onPress]);
```

- `useMemo` for derived data computed every render (sizes, filtered lists, evaluations). Skip it for trivial primitives.
- Don't memo a component if its parent re-renders all its props anyway. Measure with the React DevTools Profiler before optimizing.

## 6. Responsive layout

Avoid hard-coded pixel sizes. Pattern:

```ts
const { width } = useWindowDimensions();
const tile = Math.max(MIN, Math.min(MAX, Math.floor((width - PADDING) / COUNT)));
```

Wrap branchy calculations in `useMemo([width, height])` and pass sizes down as props so children stay pure / memoizable.

## 7. AsyncStorage hygiene

- Namespace keys by feature: `"appSettings"`, `"game_<date>"`.
- Wrap reads in `try/catch`, default gracefully on missing/malformed JSON.
- **Gate the save effect on a `ready` flag** so the boot read doesn't immediately overwrite real data with defaults:

```ts
useEffect(() => {
  if (!ready) return;
  AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(console.error);
}, [state, ready]);
```

- Use a `mounted` flag in async boot effects to avoid `setState` after unmount.
- For larger or hot data, evaluate `react-native-mmkv` (sync, much faster).

## 8. State batching

React 18 + RN 0.74+ auto-batch state updates inside async functions, timeouts, and native callbacks. **Do not** import `unstable_batchedUpdates` — it's redundant and signals a misunderstanding of the runtime.

## 9. Bottom sheet / modal lifecycle

If you don't use `@gorhom/bottom-sheet`, follow this template:
- Local `isRendered` state so unmount happens **after** the close animation finishes (use the `withTiming` completion callback with `'worklet'` + `runOnJS(setIsRendered)`).
- Memoize `Gesture.Pan()` with `useMemo` — recreating gestures every render breaks the gesture handler.
- Provide a `dismissible` flag for sheets that must stay open (game-over, mandatory consent).
- Backdrop is a `Pressable` over a `position:'absolute'` overlay; close on press only when `dismissible`.

## 10. Theming

- Define an explicit `Theme` interface; provide `LIGHT_THEME` and `DARK_THEME` const objects implementing it. The compiler catches missing tokens when you add one.
- Pass `theme` as a prop down the tree. Don't read `useColorScheme()` in leaf components — that creates uncontrollable behavior in tests and previews.
- Persist user override (`darkMode: boolean`) in storage; only fall back to `useColorScheme()` if no override exists.

## 11. Time / date logic

- For midnight rollover or daily features, compute next midnight in `useEffect`, run `setInterval(1000)` for the countdown, and trigger reload when the date key changes. Always clear the interval in cleanup.
- Use deterministic mappings (date → content) instead of `Math.random()` so users on the same day see the same thing without server coordination.
- Be explicit about timezone: `new Date()` is local; document it.

## 12. Gestures

- Wrap the root in `<GestureHandlerRootView style={{ flex: 1 }}>`.
- For drag-to-dismiss vs. scroll, disambiguate axes:

```ts
Gesture.Pan().activeOffsetY([5, 5]).failOffsetX([-20, 20])
```

- Always `'worklet';` inside `.onStart/.onUpdate/.onEnd`.
- Compose with `Gesture.Simultaneous(...)` / `.Race(...)` instead of nesting handlers.

## 13. Lists

For >10 items, never `ScrollView` + `.map(...)`. Use `FlatList` with:
- `keyExtractor` returning a stable id
- `getItemLayout` when row height is constant
- `removeClippedSubviews` on Android
- `React.memo` row components with a comparator

For >1000 items, complex cells, dynamic row heights, or bidirectional infinite scroll, prefer `@legendapp/list` (`LegendList`). It's a drop-in `FlatList` replacement that's faster than FlashList on the New Architecture, needs no size estimates, and supports bidirectional infinite scrolling out of the box.

## 14. Fonts

`@expo-google-fonts/*` is async. Gate the entire app behind one `useFonts(...)` call to avoid FOUT. Don't call `useFonts` per screen — bundle into the root loader.

## 15. Images

- Use `expo-image` (`<Image />`) — built-in caching, blurhash placeholder, faster than RN core.
- Always pass `contentFit` and explicit dimensions; avoid `resizeMode="cover"` without size, it triggers reflow.
- For many thumbnails: `cachePolicy="memory-disk"` + `recyclingKey` on FlatList rows.

## 16. Navigation (Expo Router)

- Treat the `app/` directory as the source of truth; don't mix with React Navigation imperative routes.
- Use `<Stack.Screen options={{ ... }} />` inside the screen for header config; layout files for shared UI.
- For typed routes, keep `experiments.typedRoutes: true` in `app.json`.
- Heavy screens: lazy-load with dynamic `import()` inside the screen file, not the layout.

## 17. New Architecture specifics

- `app.json`: `"newArchEnabled": true` (default in Expo SDK 55+). Don't disable unless a native module forces it.
- Avoid layout-thrashing `setState` chains inside `onLayout`; debounce or only set when value actually changes.
- Bridgeless mode means JSI calls are sync — but `expo-haptics` etc. are still async; don't `await` them in hot paths.

## 18. Verification gate

Before claiming "done":

```bash
npx tsc --noEmit       # must be clean
npm test               # if tests exist
```

If the project has no lint, TypeScript + tests are the gate. For animations/haptics, manually smoke test: trigger every animated path once, on light AND dark theme, on the smallest target device (iPhone SE / small Android).

## 19. Anti-patterns to refuse

- `StyleSheet.create({...})` rebuilt every render → cache by theme.
- Mirror-every-state-as-ref → use `useEvent`.
- `unstable_batchedUpdates` → delete it (React 18 auto-batches).
- Direct `Haptics.*` outside the central hook → route through it.
- Recreating `Gesture.Pan()` every render → `useMemo`.
- Inline `onPress={() => f(x)}` for items in a memoized list → stable handler map.
- `ScrollView` + `.map(...)` for long lists → `FlatList` (small/simple) or `LegendList` (large/complex).
- Reading `useColorScheme()` in leaf components → pass `theme` prop.
- `<Image source={{ uri }} />` from RN core for remote URLs → `expo-image`.
- Adhoc `setTimeout` for animation sequencing → `withDelay` / `withSequence` worklets.
