import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

export type StepLengthEntry = {
  value: string;
  date: string;
};

const KEY = STORAGE_KEYS.STEP_LENGTH;

//addStepLength
export const addStepLength = (value: string) => {
  const existing = storage.getString(KEY);
  const list: StepLengthEntry[] = existing ? JSON.parse(existing) : [];

  const updated: StepLengthEntry[] = [
    {
      value,
      date: new Date().toISOString(),
    },
    ...list,
  ];

  storage.set(KEY, JSON.stringify(updated));
};

//getLatestStepLength
export const getLatestStepLength = (): StepLengthEntry | null => {
  const data = storage.getString(KEY);

  if (!data) return null;

  const list: StepLengthEntry[] = JSON.parse(data);

  return list.length > 0 ? list[0] : null;
};

// getAllStepLengths
export const getAllStepLengths = (): StepLengthEntry[] => {
  const data = storage.getString(KEY);
  return data ? JSON.parse(data) : [];
};

// getStepLengthsByDays
export const getStepLengthsByDays = (days: number) => {
  const list = getAllStepLengths();

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return list.filter(item => new Date(item.date).getTime() >= cutoff);
};
