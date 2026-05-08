import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  padding20: {
    paddingHorizontal: 20,
  },

  gap40: {
    marginBottom: 40,
  },

  textWhite: {
    color: '#fff',
  },

  textGray: {
    color: '#9ca3af',
  },

  //linear gradient
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 40, // works only in newer RN versions (or use margin workaround)
  },
});
