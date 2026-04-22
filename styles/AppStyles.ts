import { StyleSheet } from 'react-native';
import { PALETTE } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.surface,
    paddingVertical: 12,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
    color: PALETTE.onSurface,
  },

  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  board: { alignItems: 'center' },
  row: { flexDirection: 'row' },

  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PALETTE.outlineVariant,
  },
  tileText: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: PALETTE.onSurface,
  },

  correct: { backgroundColor: PALETTE.primaryContainer, borderColor: PALETTE.primaryContainer },
  present: { backgroundColor: PALETTE.secondaryContainer, borderColor: PALETTE.secondaryContainer },
  absent: { backgroundColor: PALETTE.surfaceContainerHigh, borderColor: PALETTE.surfaceContainerHigh },
  active: { backgroundColor: '#fff' },
  empty: { backgroundColor: PALETTE.surfaceContainerLow },

  bottomArea: {
    paddingTop: 8,
    paddingBottom: 16,
    flexShrink: 0,
  },

  keyboard: {},
  keyRow: { flexDirection: 'row', justifyContent: 'center', minHeight: 50 },
  key: {
    backgroundColor: PALETTE.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  keySpecial: {
    backgroundColor: PALETTE.outlineVariant,
  },
  keyText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: PALETTE.onSurface,
  },
  keyCorrect: {
    backgroundColor: PALETTE.primaryContainer,
  },
  keyPresent: {
    backgroundColor: PALETTE.secondaryContainer,
  },
  keyAbsent: {
    backgroundColor: PALETTE.surfaceContainerHigh,
    opacity: 0.6,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  modal: {
    backgroundColor: PALETTE.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },
  modalTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 22,
    color: PALETTE.onSurface,
  },
  modalText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 15,
    color: PALETTE.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalWord: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 22,
    color: PALETTE.primary,
    letterSpacing: 6,
    marginVertical: 4,
  },
  button: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },

  errorBanner: {
    backgroundColor: '#ffebee',
    marginHorizontal: 24,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
  },

  debugContainer: {
    alignSelf: 'center',
    backgroundColor: '#ffeb3b',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  debugText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 11,
    color: '#000',
    letterSpacing: 2,
  },
});
