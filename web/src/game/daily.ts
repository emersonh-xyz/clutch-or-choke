import type { Clutch } from '../types';

export const SET_SIZE = 5;
const STORAGE_KEY = 'clutch-or-choke';

export type DailyState = {
  day: string;
  answers: boolean[];
  streak: number;
  lastDone: string | null;
};

export const dayKey = (date = new Date()) => date.toLocaleDateString('en-CA');

// mulberry32 seeded by the date, so everyone gets the same set each day
const seededRandom = (seed: string) => {
  let s = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const pickDailySet = (all: Clutch[], day: string): Clutch[] => {
  const rand = seededRandom(day);
  const shuffle = <T,>(items: T[]) =>
    items
      .map((item) => [rand(), item] as const)
      .sort((a, b) => a[0] - b[0])
      .map(([, item]) => item);
  const playable = all.filter((c) => c.videoUrl);
  // at least one win when there is one, or every answer is Choke
  const firstWin = shuffle(playable.filter((c) => c.won)).slice(0, 1);
  const rest = shuffle(playable.filter((c) => !firstWin.includes(c)));
  return shuffle([...firstWin, ...rest].slice(0, SET_SIZE));
};

export const loadDaily = (day: string): DailyState => {
  let saved: Partial<DailyState> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    // storage blocked or corrupt: start fresh
  }
  const base = { streak: saved.streak ?? 0, lastDone: saved.lastDone ?? null };
  return saved.day === day && Array.isArray(saved.answers)
    ? { ...base, day, answers: saved.answers }
    : { ...base, day, answers: [] };
};

export const saveDaily = (state: DailyState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // progress just will not persist
  }
};

export const recordAnswer = (state: DailyState, right: boolean, setSize: number): DailyState => {
  const answers = [...state.answers, right];
  if (answers.length < setSize) return { ...state, answers };
  // replaying a day you already finished keeps the streak as it was
  if (state.lastDone === state.day) return { ...state, answers };
  const yesterday = dayKey(new Date(Date.now() - 864e5));
  const streak = state.lastDone === yesterday ? state.streak + 1 : 1;
  return { ...state, answers, streak, lastDone: state.day };
};
