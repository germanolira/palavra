import { WORDLIST } from "../data/wordlist";

export const WORDS = WORDLIST;

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L','DEL'],
  ['Z','X','C','V','B','N','M','ENTER'],
] as const;