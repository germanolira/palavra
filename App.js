import React, { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BeVietnamPro_500Medium, BeVietnamPro_600SemiBold, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';

import { WORDS, MAX_GUESSES, WORD_LENGTH } from './constants/words';
import { evaluateGuess, normalize, getRandomWord, isValidWord } from './utils/gameLogic';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOverModal from './components/GameOverModal';
import { styles } from './styles/AppStyles';

export default function App() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });

  const [target, setTarget] = useState(() => getRandomWord(WORDS));
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [error, setError] = useState(null);

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

  const letterStates = useMemo(() => {
    const states = {};
    for (const guess of guesses) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess.word[i];
        const state = guess.eval[i];
        const priority = { correct: 3, present: 2, absent: 1 };
        const currentPriority = priority[states[letter]] || 0;
        const newPriority = priority[state] || 0;
        if (newPriority > currentPriority) {
          states[letter] = state;
        }
      }
    }
    return states;
  }, [guesses]);

  const onKey = useCallback((key) => {
    if (gameOver) return;
    setError(null);

    if (key === 'ENTER') {
      if (current.length !== WORD_LENGTH) return;

      const normalized = normalize(current);
      if (!isValidWord(normalized, WORDS)) {
        setError('Palavra não encontrada na lista');
        return;
      }

      const evalRes = evaluateGuess(normalized, target);
      setGuesses((prev) => [...prev, { word: normalized, eval: evalRes }]);
      setCurrent('');
      return;
    }

    if (key === 'DEL') {
      setCurrent((prev) => prev.slice(0, -1));
      return;
    }

    setCurrent((prev) => {
      if (prev.length >= WORD_LENGTH) return prev;
      return prev + key;
    });
  }, [current, target, gameOver]);

  const restart = useCallback(() => {
    setTarget(getRandomWord(WORDS));
    setGuesses([]);
    setCurrent('');
    setError(null);
  }, []);

  const board = useMemo(() => {
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

      <Text style={styles.title}>PALAVRA</Text>

      <Board board={board} />

      <View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Keyboard onKeyPress={onKey} letterStates={letterStates} />
      </View>

      {gameOver && (
        <GameOverModal won={won} target={target} onRestart={restart} />
      )}
    </SafeAreaView>
  );
}
