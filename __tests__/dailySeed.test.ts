import { dailySeed } from '../data/dailySeed';

const SEED_WORDS = dailySeed.words;
const WORD_LIST = SEED_WORDS.map(w => w.word);

describe('dailySeed validation', () => {
  test('has exactly 5261 words', () => {
    expect(SEED_WORDS.length).toBe(5261);
  });

  test('all entries have valid difficulty', () => {
    const validDiffs = ['common', 'medium', 'rare'];
    const invalid = SEED_WORDS.filter((w: any) => !validDiffs.includes(w.difficulty));
    expect(invalid).toEqual([]);
  });

  test('all entries have non-empty tags', () => {
    const invalid = SEED_WORDS.filter((w: any) => w.tags.length === 0);
    expect(invalid).toEqual([]);
  });

  test('all words have exactly 5 letters', () => {
    const invalid = WORD_LIST.filter((w: string) => w.length !== 5);
    expect(invalid).toEqual([]);
  });

  test('all words are unique', () => {
    const seen = new Set<string>();
    const duplicates = WORD_LIST.filter((w: string) => {
      if (seen.has(w)) return true;
      seen.add(w);
      return false;
    });
    expect(duplicates).toEqual([]);
  });

  test('all words contain only A-Z letters', () => {
    const invalid = WORD_LIST.filter((w: string) => !/^[A-Z]+$/.test(w));
    expect(invalid).toEqual([]);
  });
});

describe('dailyWordStorage logic', () => {
  // Importar inline para evitar problemas de módulo
  const { getWordForDate, getBaseDate, getFinalDate, getTodayDateKey } = require('../services/dailyWordStorage');

  test('getBaseDate returns expected date', () => {
    expect(getBaseDate()).toBe('2026-04-22');
  });

  test('getWordForDate returns a word for valid date', () => {
    const word = getWordForDate('2026-04-22');
    expect(word).toBeTruthy();
    expect(word?.length).toBe(5);
  });

  test('getWordForDate returns null for date before base', () => {
    expect(getWordForDate('2026-04-21')).toBeNull();
  });

  test('getWordForDate returns null after schedule ends', () => {
    const finalDate = getFinalDate();
    // Dia após o final
    const date = new Date(`${finalDate}T12:00:00`);
    date.setDate(date.getDate() + 1);
    const nextDate = date.toISOString().slice(0, 10);
    expect(getWordForDate(nextDate)).toBeNull();
  });

  test('getWordForDate is deterministic (same date = same word)', () => {
    const date = '2027-03-15';
    const w1 = getWordForDate(date);
    const w2 = getWordForDate(date);
    expect(w1).toBe(w2);
  });

  test('getWordForDate returns different words for different dates', () => {
    const w1 = getWordForDate('2026-04-22');
    const w2 = getWordForDate('2026-04-23');
    expect(w1).not.toBe(w2);
  });
});
