import { dailySeed } from '../data/dailySeed';
import { WORDLIST } from '../data/wordlist';

const {
  getWordForDate,
  getBaseDate,
  getFinalDate,
  getTotalDays,
  getDayIndexForDate,
} = require('../services/dailyWordStorage');

const SEED_WORDS = dailySeed.words;

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('dailySeed structure', () => {
  test('has words', () => {
    expect(SEED_WORDS.length).toBeGreaterThan(100);
  });

  test('all words have exactly 5 letters', () => {
    const invalid = SEED_WORDS.filter((w: any) => w.word.length !== 5);
    expect(invalid).toEqual([]);
  });

  test('all words are uppercase', () => {
    const invalid = SEED_WORDS.filter((w: any) => w.word !== w.word.toUpperCase());
    expect(invalid).toEqual([]);
  });

  test('all words contain only A-Z', () => {
    const invalid = SEED_WORDS.filter((w: any) => !/^[A-Z]+$/.test(w.word));
    expect(invalid).toEqual([]);
  });

  test('no duplicates in seed', () => {
    const seen = new Set<string>();
    const dups = SEED_WORDS.filter((w: any) => {
      if (seen.has(w.word)) return true;
      seen.add(w.word);
      return false;
    });
    expect(dups).toEqual([]);
  });

  test('all entries have valid difficulty', () => {
    const validDiffs = ['common', 'medium', 'rare'];
    const invalid = SEED_WORDS.filter((w: any) => !validDiffs.includes(w.difficulty));
    expect(invalid).toEqual([]);
  });

  test('all entries have at least one tag', () => {
    const invalid = SEED_WORDS.filter((w: any) => w.tags.length === 0);
    expect(invalid).toEqual([]);
  });
});

describe('WORDLIST structure', () => {
  test('has words', () => {
    expect(WORDLIST.length).toBeGreaterThan(100);
  });

  test('all words have exactly 5 letters', () => {
    const invalid = WORDLIST.filter((w: string) => w.length !== 5);
    expect(invalid).toEqual([]);
  });

  test('all words are uppercase', () => {
    const invalid = WORDLIST.filter((w: string) => w !== w.toUpperCase());
    expect(invalid).toEqual([]);
  });
});

describe('dailyWordStorage determinism', () => {
  test('getWordForDate returns same word for same date (100 random dates)', () => {
    const base = getBaseDate();
    for (let i = 0; i < 100; i++) {
      const date = addDays(base, Math.floor(Math.random() * SEED_WORDS.length));
      const w1 = getWordForDate(date);
      const w2 = getWordForDate(date);
      expect(w1).toBe(w2);
      expect(w1).toBeTruthy();
    }
  });
});

describe('Date edge cases', () => {
  test('base date returns first word', () => {
    expect(getWordForDate(getBaseDate())).toBe(SEED_WORDS[0].word);
  });

  test('final date returns last word', () => {
    const finalDate = getFinalDate();
    expect(getWordForDate(finalDate)).toBe(SEED_WORDS[SEED_WORDS.length - 1].word);
  });

  test('day after final date returns null', () => {
    const afterFinal = addDays(getFinalDate(), 1);
    expect(getWordForDate(afterFinal)).toBeNull();
  });

  test('date before base returns null', () => {
    const beforeBase = addDays(getBaseDate(), -1);
    expect(getWordForDate(beforeBase)).toBeNull();
  });

  test('works correctly across leap year (2028)', () => {
    const leapDay = '2028-02-29';
    const word = getWordForDate(leapDay);
    expect(word).toBeTruthy();
    expect(word.length).toBe(5);
  });

  test('date one year after base is valid', () => {
    const oneYearLater = addDays(getBaseDate(), 365);
    const word = getWordForDate(oneYearLater);
    expect(word).toBeTruthy();
    expect(word.length).toBe(5);
  });

  test('all dates from base to final return a valid word', () => {
    const base = getBaseDate();
    const total = getTotalDays();
    for (let i = 0; i < total; i += 100) {
      const date = addDays(base, i);
      const word = getWordForDate(date);
      expect(word).toBeTruthy();
      expect(word).toHaveLength(5);
    }
  });
});

describe('Helper functions', () => {
  test('getTotalDays returns word count', () => {
    expect(getTotalDays()).toBe(SEED_WORDS.length);
  });

  test('getDayIndexForDate returns 0 for base date', () => {
    expect(getDayIndexForDate(getBaseDate())).toBe(0);
  });

  test('getDayIndexForDate returns correct index for future date', () => {
    expect(getDayIndexForDate(addDays(getBaseDate(), 10))).toBe(10);
  });

  test('getDayIndexForDate returns negative for past date', () => {
    expect(getDayIndexForDate(addDays(getBaseDate(), -5))).toBeLessThan(0);
  });
});

describe('Array integrity', () => {
  test('no word is empty string', () => {
    expect(WORDLIST.some((w: string) => w === '')).toBe(false);
  });

  test('no word contains spaces', () => {
    expect(WORDLIST.some((w: string) => w.includes(' '))).toBe(false);
  });
});
