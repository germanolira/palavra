import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, LayoutChangeEvent, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from "@expo-google-fonts/be-vietnam-pro";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useGameHaptics } from "./hooks/useGameHaptics";
import { useEvent } from "./hooks/useEvent";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import SettingsModal from "./components/SettingsModal";
import TutorialModal from "./components/TutorialModal";
import Header from "./components/Header";
import CountdownBanner from "./components/CountdownBanner";
import { DARK_THEME, LIGHT_THEME } from "./constants/theme";
import { MAX_GUESSES, WORD_LENGTH, WORDS } from "./constants/words";
import {
  getTodayDateKey,
  getWordForDate,
} from "./services/dailyWordStorage";
import { useAppStyles } from "./styles/AppStyles";
import type { BoardRow, LetterStates } from "./types";
import { evaluateGuess, isValidWord, normalize } from "./utils/gameLogic";

const SETTINGS_STORAGE_KEY = "appSettings";
const GUESSES_STORAGE_KEY_PREFIX = "gameGuesses_";

type AppSettings = {
  darkMode?: boolean;
  hapticsEnabled?: boolean;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [target, setTarget] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [guesses, setGuesses] = useState<BoardRow[]>([]);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [flipRowIndex, setFlipRowIndex] = useState(-1);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [boardHeight, setBoardHeight] = useState(0);
  const [justFinished, setJustFinished] = useState(false);
  const haptics = useGameHaptics(hapticsEnabled);

  const handleCloseTutorial = useCallback(() => setShowTutorial(false), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);

  const handleBoardLayout = useCallback((event: LayoutChangeEvent) => {
    setBoardHeight(event.nativeEvent.layout.height);
  }, []);

  const loadDailyWord = useEvent(async (forceToday = false) => {
    const todayKey = getTodayDateKey();
    const dateToLoad = forceToday ? todayKey : activeDate || todayKey;

    const dailyWord = getWordForDate(dateToLoad);

    if (!dailyWord) {
      throw new Error(`Missing daily word for ${dateToLoad}`);
    }

    const savedGuesses = await AsyncStorage.getItem(
      GUESSES_STORAGE_KEY_PREFIX + dateToLoad,
    );
    const initialGuesses = savedGuesses ? JSON.parse(savedGuesses) : [];

    setActiveDate(dateToLoad);
    setTarget(dailyWord);
    setGuesses(initialGuesses);
    if (__DEV__) {
      console.log(`Word: ${dailyWord} for date: ${dateToLoad}`);
    }
  });

  const handleMidnightRollover = useEvent(async () => {
    setCurrent("");
    setError(null);
    setFlipRowIndex(-1);
    setJustFinished(false);
    await loadDailyWord(true);
  });

  const handleResetDay = useEvent(async () => {
    const todayKey = getTodayDateKey();
    await AsyncStorage.removeItem(GUESSES_STORAGE_KEY_PREFIX + todayKey);
    setCurrent("");
    setError(null);
    setFlipRowIndex(-1);
    await loadDailyWord(true);
  });

  useEffect(() => {
    let mounted = true;

    async function bootApp() {
      try {
        const rawSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (rawSettings && mounted) {
          const savedSettings = JSON.parse(rawSettings) as AppSettings;

          if (typeof savedSettings.darkMode === "boolean") {
            setDarkMode(savedSettings.darkMode);
          }

          if (typeof savedSettings.hapticsEnabled === "boolean") {
            setHapticsEnabled(savedSettings.hapticsEnabled);
          }
        }

        await loadDailyWord();
      } catch (loadError) {
        console.error("Failed to initialize app:", loadError);
        if (mounted) {
          setActiveDate(getTodayDateKey());
          setTarget(WORDS[0]);
          setError("Erro ao carregar palavra do dia.");
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    bootApp();

    return () => {
      mounted = false;
    };
    // loadDailyWord is a stable useEvent reference; intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ darkMode, hapticsEnabled }),
    ).catch((saveError) => {
      console.error("Failed to save settings:", saveError);
    });
  }, [darkMode, hapticsEnabled, ready]);

  useEffect(() => {
    if (!ready || !activeDate) {
      return;
    }

    AsyncStorage.setItem(
      GUESSES_STORAGE_KEY_PREFIX + activeDate,
      JSON.stringify(guesses),
    ).catch((saveError) => {
      console.error("Failed to save guesses:", saveError);
    });
  }, [guesses, activeDate, ready]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;
  const styles = useAppStyles(theme);

  const gameOver = useMemo(() => {
    if (!target || guesses.length === 0) {
      return false;
    }

    const lastGuess = guesses[guesses.length - 1];
    const wonGame = lastGuess.word === target;

    return wonGame || guesses.length >= MAX_GUESSES;
  }, [guesses, target]);

  const won = useMemo(() => {
    if (!target || guesses.length === 0) {
      return false;
    }

    return guesses[guesses.length - 1].word === target;
  }, [guesses, target]);

  useEffect(() => {
    if (!gameOver) {
      return;
    }

    if (justFinished) {
      haptics.play(won ? "win" : "loss");
      setJustFinished(false);
    }
  }, [gameOver, justFinished, haptics, won]);

  const letterStates = useMemo<LetterStates>(() => {
    const states: LetterStates = {};
    const priority = { correct: 3, present: 2, absent: 1 } as const;

    for (const guess of guesses) {
      for (let index = 0; index < WORD_LENGTH; index += 1) {
        const letter = guess.word[index];
        const state = guess.eval[index];

        if (!letter || !(state in priority)) {
          continue;
        }

        const currentPriority = priority[states[letter]] ?? 0;
        const nextPriority = priority[state as keyof typeof priority];

        if (nextPriority > currentPriority) {
          states[letter] = state as LetterStates[string];
        }
      }
    }

    return states;
  }, [guesses]);

  const shakeOffset = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const triggerShake = useEvent(() => {
    shakeOffset.value = withSequence(
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(-2, { duration: 50 }),
      withTiming(2, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );

    haptics.play("invalidGuess");
  });

  const handleSettingsPress = useEvent(() => {
    haptics.play("navTap");
    setShowSettings(true);
  });

  const handleTutorialPress = useEvent(() => {
    haptics.play("navTap");
    setShowTutorial(true);
  });

  const handleTitleLongPress = useCallback(() => {
    setDebugMode((prev) => !prev);
  }, []);

  const onKey = useEvent((key: string) => {
    if (!target || gameOver) {
      return;
    }

    setError(null);

    if (key === "ENTER") {
      if (current.length !== WORD_LENGTH) {
        triggerShake();
        setError("Complete a palavra");
        return;
      }

      const normalizedGuess = normalize(current);

      if (!isValidWord(normalizedGuess, WORDS)) {
        triggerShake();
        setError("Palavra nao encontrada");
        return;
      }

      const evaluation = evaluateGuess(normalizedGuess, target);
      const newGuesses = [
        ...guesses,
        { word: normalizedGuess, eval: evaluation },
      ];
      setGuesses(newGuesses);
      setCurrent("");
      setFlipRowIndex(guesses.length);

      const isWin = normalizedGuess === target;
      const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;
      if (isWin || isLoss) {
        setJustFinished(true);
      } else {
        haptics.play("acceptedGuess");
      }

      return;
    }

    if (key === "DEL") {
      setCurrent((previous) => previous.slice(0, -1));
      return;
    }

    if (current.length >= WORD_LENGTH) {
      haptics.play("keyBlocked");
      return;
    }

    haptics.play("keyTap");
    setCurrent((previous) => previous + key);
  });

  const board = useMemo<BoardRow[]>(() => {
    const nextRows = [...guesses];

    if (nextRows.length < MAX_GUESSES) {
      nextRows.push({ word: current, eval: Array(WORD_LENGTH).fill("active") });
    }

    while (nextRows.length < MAX_GUESSES) {
      nextRows.push({ word: "", eval: Array(WORD_LENGTH).fill("empty") });
    }

    return nextRows;
  }, [current, guesses]);

  if (!fontsLoaded || !ready) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.colorCorrect} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Header
        onSettingsPress={handleSettingsPress}
        onTutorialPress={handleTutorialPress}
        onTitleLongPress={handleTitleLongPress}
        theme={theme}
      />

      <Animated.View style={[styles.boardWrapper, shakeStyle]} onLayout={handleBoardLayout}>
        <Board board={board} flipRowIndex={flipRowIndex} maxHeight={boardHeight} won={won} theme={theme} />
      </Animated.View>

      <View style={styles.bottomArea}>
        {gameOver ? (
          <CountdownBanner
            activeDate={activeDate}
            onDateChange={handleMidnightRollover}
            theme={theme}
          />
        ) : null}

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Keyboard
          onKeyPress={onKey}
          letterStates={letterStates}
          theme={theme}
        />
      </View>

      <TutorialModal
        visible={showTutorial}
        onClose={handleCloseTutorial}
        hapticsEnabled={hapticsEnabled}
        theme={theme}
      />

      <SettingsModal
        visible={showSettings}
        onClose={handleCloseSettings}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        hapticsEnabled={hapticsEnabled}
        onHapticsChange={setHapticsEnabled}
        theme={theme}
        debugMode={debugMode}
        onResetDay={handleResetDay}
      />
    </SafeAreaView>
  );
}
