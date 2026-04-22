import { WORD_LENGTH } from '../constants/words';

export function normalize(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, WORD_LENGTH);
}

export function evaluateGuess(guess, target) {
  const res = Array(WORD_LENGTH).fill('absent');
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

export function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

export function isValidWord(word, words) {
  return words.includes(word.toUpperCase());
}
