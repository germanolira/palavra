import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from "@expo-google-fonts/be-vietnam-pro";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Board from "./components/Board";
import VictoryScreen from "./components/VictoryScreen";
import Keyboard from "./components/Keyboard";
import SettingsModal from "./components/SettingsModal";
import TutorialModal from "./components/TutorialModal";
import { DARK_THEME, LIGHT_THEME } from "./constants/theme";
import { MAX_GUESSES, WORD_LENGTH, WORDS } from "./constants/words";
import {
  getDailySeedBaseDate,
  getDailySeedFinalDate,
  getTodayDateKey,
  getWordForDate,
  initializeDailyWordStorage,
} from "./services/dailyWordStorage";
import { createAppStyles } from "./styles/AppStyles";
import type { BoardRow, LetterStates } from "./types";
import { evaluateGuess, isValidWord, normalize } from "./utils/gameLogic";

const SETTINGS_STORAGE_KEY = "appSettings";

type AppSettings = {
  darkMode?: boolean;
  hapticsEnabled?: boolean;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
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
  const [settingsReady, setSettingsReady] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  const loadDailyWord = useCallback(async () => {
    const todayKey = getTodayDateKey();

    await initializeDailyWordStorage();

    const dailyWord = await getWordForDate(todayKey);

    if (!dailyWord) {
      throw new Error(`Missing daily word for ${todayKey}`);
    }

    setActiveDate(todayKey);
    setTarget(dailyWord);
    setGuesses([]);
    setCurrent("");
    setError(null);
    setFlipRowIndex(-1);
  }, []);

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
          setError("Banco local indisponivel. Usando fallback offline.");
        }
      } finally {
        if (mounted) {
          setSettingsReady(true);
          setGameReady(true);
        }
      }
    }

    bootApp();

    return () => {
      mounted = false;
    };
  }, [loadDailyWord]);

  useEffect(() => {
    if (!settingsReady) {
      return;
    }

    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ darkMode, hapticsEnabled }),
    ).catch((saveError) => {
      console.error("Failed to save settings:", saveError);
    });
  }, [darkMode, hapticsEnabled, settingsReady]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;
  const styles = useMemo(() => createAppStyles(theme), [theme]);

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

  const triggerShake = useCallback(() => {
    shakeOffset.value = withSequence(
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(-2, { duration: 50 }),
      withTiming(2, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );

    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [hapticsEnabled, shakeOffset]);

  const handleIconPress = useCallback(
    (callback: () => void) => {
      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      callback();
    },
    [hapticsEnabled],
  );

  const onKey = useCallback(
    (key: string) => {
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

        setGuesses((previousGuesses) => [
          ...previousGuesses,
          { word: normalizedGuess, eval: evaluation },
        ]);
        setCurrent("");
        setFlipRowIndex(guesses.length);

        if (hapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        return;
      }

      if (key === "DEL") {
        setCurrent((previous) => previous.slice(0, -1));
        return;
      }

      setCurrent((previous) => {
        if (previous.length >= WORD_LENGTH) {
          if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }

          return previous;
        }

        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        return previous + key;
      });
    },
    [current, gameOver, guesses.length, hapticsEnabled, target, triggerShake],
  );

  const restart = useCallback(() => {
    setGuesses([]);
    setCurrent("");
    setError(null);
    setFlipRowIndex(-1);
  }, []);

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

  if (!fontsLoaded || !gameReady) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.colorCorrect} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable
            onPress={() => handleIconPress(() => setShowSettings(true))}
            style={styles.iconButton}
            accessibilityLabel="Abrir configuracoes"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={20}
              color={theme.textMain}
            />
          </Pressable>
        </View>

        <View style={styles.headerCenter} />

        <View style={styles.headerSide}>
          <Pressable
            onPress={() => handleIconPress(() => setShowTutorial(true))}
            style={styles.iconButton}
            accessibilityLabel="Abrir instrucoes"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={20}
              color={theme.textMain}
            />
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.boardWrapper, shakeStyle]}>
        <Board board={board} flipRowIndex={flipRowIndex} theme={theme} />
      </Animated.View>

      <View style={styles.bottomArea}>
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Keyboard
          onKeyPress={onKey}
          letterStates={letterStates}
          hapticsEnabled={hapticsEnabled}
          theme={theme}
        />
      </View>

      {gameOver ? (
        <VictoryScreen
          won={won}
          target={target}
          hapticsEnabled={hapticsEnabled}
          theme={theme}
        />
      ) : null}

      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        hapticsEnabled={hapticsEnabled}
        theme={theme}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        hapticsEnabled={hapticsEnabled}
        onHapticsChange={setHapticsEnabled}
        globalHapticsEnabled={hapticsEnabled}
        activeDate={activeDate}
        dailySeedBaseDate={getDailySeedBaseDate()}
        dailySeedFinalDate={getDailySeedFinalDate()}
        theme={theme}
      />
    </SafeAreaView>
  );
}
