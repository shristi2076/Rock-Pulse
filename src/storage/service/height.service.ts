import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

export type HeightEntry = {
  value: string;
  date: string;
};

const KEY = STORAGE_KEYS.HEIGHT;

//addHeight
export const addHeight = (value: string) => {
  const existing = storage.getString(KEY);
  const list: HeightEntry[] = existing ? JSON.parse(existing) : [];

  const updated: HeightEntry[] = [
    {
      value,
      date: new Date().toISOString(),
    },
    ...list,
  ];

  storage.set(KEY, JSON.stringify(updated));
};

//getLatestHeight
export const getLatestHeight = (): HeightEntry | null => {
  const data = storage.getString(KEY);

  if (!data) return null;

  const list: HeightEntry[] = JSON.parse(data);

  return list.length > 0 ? list[0] : null;
};
