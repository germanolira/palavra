import { StyleSheet } from 'react-native';
import { PALETTE } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.surface,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  board: { alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', gap: 8 },

  tile: {
    width: 52,
    height: 52,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.outlineVariant,
  },
  tileText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 22,
    color: PALETTE.onSurface,
  },

  correct: { backgroundColor: PALETTE.primaryContainer },
  present: { backgroundColor: PALETTE.secondaryContainer },
  absent: { backgroundColor: PALETTE.surfaceContainerHigh },
  active: { backgroundColor: '#fff' },
  empty: { backgroundColor: PALETTE.surfaceContainerLow },

  keyboard: { gap: 8, paddingHorizontal: 8 },
  keyRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  key: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: PALETTE.surfaceContainerHigh,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  keyText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 12,
    color: PALETTE.onSurface,
  },
  keyUsed: {
    opacity: 0.5,
  },
  keyCorrect: {
    backgroundColor: PALETTE.primaryContainer,
  },
  keyPresent: {
    backgroundColor: PALETTE.secondaryContainer,
  },
  keyAbsent: {
    backgroundColor: PALETTE.surfaceContainerHigh,
    opacity: 0.7,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: PALETTE.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  modalTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 24,
    color: PALETTE.onSurface,
  },
  modalText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 16,
    color: PALETTE.onSurfaceVariant,
    textAlign: 'center',
  },
  modalWord: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 20,
    color: PALETTE.primary,
    letterSpacing: 4,
  },
  button: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 28,
    color: PALETTE.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
});
