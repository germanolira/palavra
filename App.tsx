import React, { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BeVietnamPro_500Medium, BeVietnamPro_600SemiBold, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';

import { WORDS, MAX_GUESSES, WORD_LENGTH } from './constants/words';
import { evaluateGuess, normalize, getRandomWord, isValidWord } from './utils/gameLogic';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOverModal from './components/GameOverModal';
import TutorialModal from './components/TutorialModal';
import { styles } from './styles/AppStyles';
import type { BoardRow, LetterStates } from './types';

export default function App() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });

  const [target, setTarget] = useState(() => getRandomWord(WORDS));
  const [guesses, setGuesses] = useState<BoardRow[]>([]);
  const [current, setCurrent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [flipRowIndex, setFlipRowIndex] = useState(-1);

  const gameOver = useMemo(() => {
    if (guesses.length === 0) return false;
    const lastGuess = guesses[guesses.length - 1];
    const won = lastGuess.word === target;
    const lost = guesses.length >= MAX_GUESSES && !won;
    return won || lost;
  }, [guesses, target]);

  const won = useMemo(() => {
    if (guesses.length === 0) return false;
    return guesses[guesses.length - 1].word === target;
  }, [guesses, target]);

  const letterStates: LetterStates = useMemo(() => {
    const states: LetterStates = {};
    for (const guess of guesses) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess.word[i];
        const state = guess.eval[i];
        const priority: Record<string, number> = { correct: 3, present: 2, absent: 1 };
        const currentPriority = priority[states[letter] ?? ''] || 0;
        const newPriority = priority[state] || 0;
        if (newPriority > currentPriority) {
          states[letter] = state as 'correct' | 'present' | 'absent';
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
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-3, { duration: 50 }),
      withTiming(3, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const onKey = useCallback((key: string) => {
    if (gameOver) return;
    setError(null);

    if (key === 'ENTER') {
      if (current.length !== WORD_LENGTH) {
        triggerShake();
        setError('Complete a palavra');
        return;
      }

      const normalized = normalize(current);
      if (!isValidWord(normalized, WORDS)) {
        triggerShake();
        setError('Palavra não encontrada');
        return;
      }

      const evalRes = evaluateGuess(normalized, target);
      setGuesses((prev) => [...prev, { word: normalized, eval: evalRes }]);
      setCurrent('');
      setFlipRowIndex(guesses.length);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (key === 'DEL') {
      setCurrent((prev) => prev.slice(0, -1));
      return;
    }

    setCurrent((prev) => {
      if (prev.length >= WORD_LENGTH) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return prev;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return prev + key;
    });
  }, [current, target, gameOver, guesses.length, triggerShake]);

  const restart = useCallback(() => {
    setTarget(getRandomWord(WORDS));
    setGuesses([]);
    setCurrent('');
    setError(null);
    setFlipRowIndex(-1);
  }, []);

  const board = useMemo<BoardRow[]>(() => {
    const rows = [...guesses];
    if (rows.length < MAX_GUESSES) {
      rows.push({ word: current, eval: Array(WORD_LENGTH).fill('active') });
    }
    while (rows.length < MAX_GUESSES) {
      rows.push({ word: '', eval: Array(WORD_LENGTH).fill('empty') });
    }
    return rows;
  }, [guesses, current]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
          {__DEV__ && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>{target}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerSide}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTutorial(true);
            }}
            style={styles.helpButton}
            accessibilityLabel="Como jogar"
            accessibilityRole="button"
          >
            <Text style={styles.helpButtonText}>?</Text>
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.boardWrapper, shakeStyle]}>
        <Board board={board} flipRowIndex={flipRowIndex} />
      </Animated.View>

      <View style={styles.bottomArea}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <Keyboard onKeyPress={onKey} letterStates={letterStates} />
      </View>

      {gameOver && (
        <GameOverModal won={won} target={target} onRestart={restart} />
      )}

      <TutorialModal visible={showTutorial} onClose={() => setShowTutorial(false)} />
    </SafeAreaView>
  );
}
