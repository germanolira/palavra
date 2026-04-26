import { WORD_LENGTH } from '../constants/words';
import type { TileState } from '../types';

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, WORD_LENGTH);
}

export function evaluateGuess(guess: string, target: string): TileState[] {
  const res: TileState[] = Array(WORD_LENGTH).fill('absent');
  const targetArr = target.split('');
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === targetArr[i]) {
      res[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (res[i] === 'correct') continue;
    const idx = targetArr.findIndex((c, j) => !used[j] && c === guess[i]);
    if (idx !== -1) {
      res[i] = 'present';
      used[idx] = true;
    }
  }

  return res;
}

let cachedWordSet: Set<string> | null = null;
let cachedWordSource: readonly string[] | null = null;

export function isValidWord(word: string, words: readonly string[]): boolean {
  if (cachedWordSource !== words) {
    cachedWordSet = new Set(words);
    cachedWordSource = words;
  }
  return cachedWordSet!.has(word.toUpperCase());
}
