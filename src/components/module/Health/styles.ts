import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    // gap: 20,
    backgroundColor: '#000',
    borderRadius: 16,

    shadowColor: '#C9C3C3',
    shadowOffset: {
      width: 6,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,

    elevation: 6,
  },

  smallTitle: {
    color: '#8A8A8A',
    fontSize: 12,
  },

  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },

  moonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  moonItem: {
    alignItems: 'center',
  },

  date: {
    color: '#6E6E6E',
    fontSize: 10,
    marginBottom: 6,
  },

  moon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  bottomSelector: {
    backgroundColor: '#000',

    shadowColor: 'rgba(201, 195, 195, 0.25)',
    shadowOffset: {
      width: 6,
      height: -3,
    },
    shadowOpacity: 1,
    shadowRadius: 7,

    elevation: 4,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 6,
  },

  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },

  activeDay: {
    backgroundColor: '#111',
  },

  dayText: {
    color: '#555',
    fontWeight: '600',
  },

  activeText: {
    color: '#FFF',
  },
});
