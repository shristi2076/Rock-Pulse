import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

export type StepGoalEntry = {
  value: string;
  date: string;
};

const KEY = STORAGE_KEYS.STEP_GOAL;

//addStepGoal
export const addStepGoal = (value: string) => {
  const existing = storage.getString(KEY);
  const list: StepGoalEntry[] = existing ? JSON.parse(existing) : [];

  const updated: StepGoalEntry[] = [
    {
      value,
      date: new Date().toISOString(),
    },
    ...list,
  ];

  storage.set(KEY, JSON.stringify(updated));
};

//getLatestStepGoal
export const getLatestStepGoal = (): StepGoalEntry | null => {
  const data = storage.getString(KEY);

  if (!data) return null;

  const list: StepGoalEntry[] = JSON.parse(data);

  return list.length > 0 ? list[0] : null;
};

// getAllStepGoals
export const getAllStepGoals = (): StepGoalEntry[] => {
  const data = storage.getString(KEY);
  return data ? JSON.parse(data) : [];
};

// getStepGoalsByDays
export const getStepGoalsByDays = (days: number) => {
  const list = getAllStepGoals();

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return list.filter(item => new Date(item.date).getTime() >= cutoff);
};
