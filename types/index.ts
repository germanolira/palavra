export type TileState = 'correct' | 'present' | 'absent' | 'active' | 'empty';

export type LetterState = 'correct' | 'present' | 'absent';

export interface Guess {
  word: string;
  eval: TileState[];
}

export interface BoardRow {
  word: string;
  letters?: string[];
  eval: TileState[];
}

export type KeyState = LetterState | null;

export interface LetterStates {
  [key: string]: LetterState;
}
