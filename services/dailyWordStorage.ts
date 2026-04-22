import * as SQLite from "expo-sqlite";

import dailySeed from "../data/dailySeed.json";

const DATABASE_NAME = "palavra.db";
const DAILY_WORDS_TABLE = "daily_words";
const SEEDED_META_KEY = "daily_words_seeded_at";
const META_TABLE = "app_meta";
const TOTAL_DAYS = 365;

type DailyWordRow = {
  date: string;
  word: string;
};

type CountRow = {
  count: number;
};

type MetaRow = {
  value: string;
};

function getDatabase() {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

function getDayDifference(fromDateKey: string, toDateKey: string) {
  const fromDate = new Date(`${fromDateKey}T12:00:00`);
  const toDate = new Date(`${toDateKey}T12:00:00`);
  const differenceInMs = toDate.getTime() - fromDate.getTime();

  return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
}

function buildSchedule(): DailyWordRow[] {
  const words = dailySeed.words.map((word) => word.toUpperCase());
  const schedule: DailyWordRow[] = [];
  let previousWord = "";

  for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex += 1) {
    const firstIndex = (dayIndex * 11 + Math.floor(dayIndex / 3)) % words.length;
    let word = words[firstIndex];

    if (word === previousWord) {
      word = words[(firstIndex + 7) % words.length];
    }

    previousWord = word;
    schedule.push({
      date: addDays(dailySeed.baseDate, dayIndex),
      word,
    });
  }

  return schedule;
}

export function getDailySeedBaseDate() {
  return dailySeed.baseDate;
}

export function getDailySeedFinalDate() {
  return addDays(dailySeed.baseDate, TOTAL_DAYS - 1);
}

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export async function initializeDailyWordStorage() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${DAILY_WORDS_TABLE} (
      date TEXT PRIMARY KEY NOT NULL,
      word TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ${META_TABLE} (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const existingRows =
    (await db.getFirstAsync<CountRow>(
      `SELECT COUNT(*) as count FROM ${DAILY_WORDS_TABLE}`
    )) ?? { count: 0 };
  const seededMeta = await db.getFirstAsync<MetaRow>(
    `SELECT value FROM ${META_TABLE} WHERE key = ?`,
    SEEDED_META_KEY,
  );

  if (existingRows.count === TOTAL_DAYS && seededMeta?.value === dailySeed.baseDate) {
    return;
  }

  const schedule = buildSchedule();

  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM ${DAILY_WORDS_TABLE}`);
    await db.runAsync(`DELETE FROM ${META_TABLE} WHERE key = ?`, SEEDED_META_KEY);

    for (const row of schedule) {
      await db.runAsync(
        `INSERT INTO ${DAILY_WORDS_TABLE} (date, word) VALUES (?, ?)`,
        row.date,
        row.word,
      );
    }

    await db.runAsync(
      `INSERT INTO ${META_TABLE} (key, value) VALUES (?, ?)`,
      SEEDED_META_KEY,
      dailySeed.baseDate,
    );
  });
}

export async function getWordForDate(date: string) {
  const db = await getDatabase();
  const directRow = await db.getFirstAsync<DailyWordRow>(
    `SELECT date, word FROM ${DAILY_WORDS_TABLE} WHERE date = ?`,
    date,
  );

  if (directRow?.word) {
    return directRow.word;
  }

  const normalizedIndex =
    ((getDayDifference(dailySeed.baseDate, date) % TOTAL_DAYS) + TOTAL_DAYS) % TOTAL_DAYS;
  const fallbackDate = addDays(dailySeed.baseDate, normalizedIndex);
  const fallbackRow = await db.getFirstAsync<DailyWordRow>(
    `SELECT date, word FROM ${DAILY_WORDS_TABLE} WHERE date = ?`,
    fallbackDate,
  );

  return fallbackRow?.word ?? null;
}

export async function clearDailyWordStorage() {
  const db = await getDatabase();
  await db.execAsync(`
    DROP TABLE IF EXISTS ${DAILY_WORDS_TABLE};
    DROP TABLE IF EXISTS ${META_TABLE};
  `);
}
