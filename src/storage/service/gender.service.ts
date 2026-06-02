import { storage } from '../mmkv';
import { STORAGE_KEYS } from '../keys';

export const saveGender = (gender: string) => {
  storage.set(STORAGE_KEYS.GENDER, gender);
};

export const getGender = (): string | null => {
  return storage.getString(STORAGE_KEYS.GENDER) ?? null;
};
