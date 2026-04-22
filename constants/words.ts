import dailySeed from "../data/dailySeed.json";

export const WORDS = dailySeed.words.map((word) => word.toUpperCase());

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL']
] as const;
