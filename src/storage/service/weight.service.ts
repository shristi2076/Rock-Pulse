import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

export type WeightEntry = {
  value: string;
  date: string;
};

const KEY = STORAGE_KEYS.WEIGHT;

//addWeight
export const addWeight = (value: string) => {
  const existing = storage.getString(KEY);
  const list: WeightEntry[] = existing ? JSON.parse(existing) : [];

  const updated: WeightEntry[] = [
    {
      value,
      date: new Date().toISOString(),
    },
    ...list,
  ];

  storage.set(KEY, JSON.stringify(updated));
};

//getLatestWeight
export const getLatestWeight = (): WeightEntry | null => {
  const data = storage.getString(KEY);

  if (!data) return null;

  const list: WeightEntry[] = JSON.parse(data);

  return list.length > 0 ? list[0] : null;
};

// getAllWeights
export const getAllWeights = (): WeightEntry[] => {
  const data = storage.getString(KEY);
  return data ? JSON.parse(data) : [];
};

// getWeightsByDays
export const getWeightsByDays = (days: number) => {
  const list = getAllWeights();

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return list.filter(item => new Date(item.date).getTime() >= cutoff);
};
