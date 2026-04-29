import { dailySeed, SeedWord } from "../data/dailySeed";

const BASE_DATE = dailySeed.baseDate;
const SCHEDULED_WORDS = dailySeed.words;

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayDifference(fromDateKey: string, toDateKey: string) {
  const fromDate = new Date(`${fromDateKey}T12:00:00`);
  const toDate = new Date(`${toDateKey}T12:00:00`);
  const diffMs = toDate.getTime() - fromDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getBaseDate() {
  return BASE_DATE;
}

export function getFinalDate() {
  const finalIndex = SCHEDULED_WORDS.length - 1;
  const date = new Date(`${BASE_DATE}T12:00:00`);
  date.setDate(date.getDate() + finalIndex);
  return formatDateKey(date);
}

export function getTodayDateKey() {
  const key = formatDateKey(new Date());
  return key;
}

export function getWordForDate(date: string): string | null {
  const dayIndex = getDayDifference(BASE_DATE, date);

  if (dayIndex < 0 || dayIndex >= SCHEDULED_WORDS.length) {
    return null;
  }

  const word = SCHEDULED_WORDS[dayIndex].word;
  return word;
}

export function getTodayWord(): string | null {
  const today = getTodayDateKey();
  const word = getWordForDate(today);
  return word;
}

export function getTotalDays() {
  return SCHEDULED_WORDS.length;
}

export function getDayIndexForDate(date: string): number {
  return getDayDifference(BASE_DATE, date);
}

export function getSeedWordForDate(date: string): SeedWord | null {
  const dayIndex = getDayDifference(BASE_DATE, date);
  if (dayIndex < 0 || dayIndex >= SCHEDULED_WORDS.length) {
    return null;
  }
  return SCHEDULED_WORDS[dayIndex];
}

