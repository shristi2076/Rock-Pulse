import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

const KEY = STORAGE_KEYS.BIRTH_DATE;

type BirthDate = {
  day: number;
  month: string;
  year: number;
};

export const saveBirthDate = (date: BirthDate) => {
  storage.set(KEY, JSON.stringify(date));
};

export const getBirthDate = (): BirthDate | null => {
  const value = storage.getString(KEY);

  return value ? (JSON.parse(value) as BirthDate) : null;
};
