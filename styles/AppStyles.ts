import { StyleSheet } from "react-native";

import type { AppTheme } from "../constants/theme";

export function createAppStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgBase,
      paddingTop: 12,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.bgBase,
    },
    loadingIndicator: {
      color: theme.colorCorrect,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingBottom: 12,
      minHeight: 56,
    },
    headerSide: {
      width: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 20,
      letterSpacing: 6,
      color: theme.textMain,
    },
    gameOverHeader: {
      alignItems: "center",
      paddingVertical: 8,
      gap: 2,
    },
    gameOverWord: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 18,
      letterSpacing: 4,
    },
    gameOverCountdownLabel: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 4,
    },
    gameOverCountdown: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 20,
      color: theme.textMain,
      letterSpacing: 2,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.bgSurface,
      borderWidth: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    iconButtonText: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 15,
      color: theme.textMain,
    },
    iconButtonSpacer: {
      width: 40,
      height: 40,
    },

    boardWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    board: {
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
    },

    tile: {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.borderBase,
      backgroundColor: theme.bgSurface,
    },
    tileText: {
      fontFamily: "BeVietnamPro_700Bold",
      color: theme.textMain,
    },
    correct: {
      backgroundColor: theme.colorCorrect,
      borderColor: theme.colorCorrect,
    },
    present: {
      backgroundColor: theme.colorPresent,
      borderColor: theme.colorPresent,
    },
    absent: {
      backgroundColor: theme.colorAbsent,
      borderColor: theme.colorAbsent,
    },
    active: {
      backgroundColor: theme.bgBase,
      borderColor: theme.borderBase,
    },
    empty: {
      backgroundColor: theme.bgSurface,
      borderColor: theme.borderBase,
    },

    bottomArea: {
      paddingTop: 8,
      flexShrink: 0,
    },

    keyboard: {},
    keyRow: {
      flexDirection: "row",
      justifyContent: "center",
      minHeight: 50,
    },
    key: {
      backgroundColor: theme.bgSurface,
      borderWidth: 1,
      borderColor: theme.borderBase,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    keySpecial: {
      backgroundColor: theme.borderBase,
    },
    keyText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      color: theme.textMain,
    },
    keyCorrect: {
      backgroundColor: theme.colorCorrect,
      borderColor: theme.colorCorrect,
    },
    keyPresent: {
      backgroundColor: theme.colorPresent,
      borderColor: theme.colorPresent,
    },
    keyAbsent: {
      backgroundColor: theme.colorAbsent,
      borderColor: theme.colorAbsent,
    },

    errorBanner: {
      backgroundColor: theme.bgSurface,
      borderWidth: 1,
      borderColor: theme.colorError,
      marginHorizontal: 24,
      marginBottom: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    errorText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 14,
      color: theme.colorError,
      textAlign: "center",
    },

    primaryButton: {
      backgroundColor: theme.colorCorrect,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      flex: 1,
    },
    primaryButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.textInverse,
    },
    secondaryButton: {
      backgroundColor: theme.colorCorrect,
      borderWidth: 0,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      flex: 1,
      shadowColor: theme.textMain,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    secondaryButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.textInverse,
    },
    dangerButton: {
      backgroundColor: theme.bgSurface,
      borderWidth: 0,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      flex: 1,
    },
    dangerButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.colorError,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
    },
    metaBlock: {
      backgroundColor: theme.bgSurface,
      borderRadius: 12,
      padding: 16,
      gap: 8,
    },

    sheetOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      backgroundColor: theme.overlay,
      zIndex: 100,
    },
    sheetBackdrop: {
      flex: 1,
    },
    sheet: {
      backgroundColor: theme.bgSurface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderWidth: 0,
      paddingHorizontal: 24,
      paddingTop: 12,
      minHeight: 220,
    },
    sheetScrollView: {
      flexGrow: 0,
      flexShrink: 1,
    },
    sheetHandle: {
      alignSelf: "center",
      width: 40,
      height: 5,
      borderRadius: 999,
      backgroundColor: theme.borderBase,
      marginBottom: 20,
      opacity: 0.5,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    sheetTitle: {
      flex: 1,
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 22,
      color: theme.textMain,
    },
    sheetContent: {
      gap: 16,
    },
    sheetFooter: {
      gap: 12,
      marginTop: 24,
      marginBottom: 16,
      flexDirection: "row",
    },
    modalText: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 16,
      color: theme.textMuted,
      lineHeight: 24,
    },
    modalWord: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 28,
      color: theme.colorCorrect,
      letterSpacing: 6,
      textAlign: "center",
    },

    sectionCard: {
      backgroundColor: theme.bgSurface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderBase,
      padding: 20,
      gap: 12,
    },
    sectionTitle: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.textMain,
      letterSpacing: 0.3,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    rowLabelBlock: {
      flex: 1,
      gap: 6,
    },
    rowLabel: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.textMain,
    },
    rowDescription: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 14,
      color: theme.textMuted,
      lineHeight: 20,
    },
    tutorialExamples: {
      flexDirection: "column",
      gap: 12,
    },
    exampleCard: {
      flexDirection: "row",
      backgroundColor: theme.bgSurface,
      borderWidth: 1,
      borderColor: theme.borderBase,
      borderRadius: 24,
      padding: 16,
      gap: 16,
      alignItems: "center",
    },
    exampleTile: {
      width: 48,
      height: 48,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    exampleTileText: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 20,
      color: theme.textInverse,
    },
    exampleTextContent: {
      flex: 1,
      gap: 4,
    },
    exampleLabel: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.textMain,
    },
    bulletBlock: {
      gap: 12,
    },
    bulletText: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 15,
      lineHeight: 22,
      color: theme.textMuted,
    },

    modalHeader: {
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    modalTitle: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 24,
      color: theme.textMain,
      textAlign: "center",
    },
    modalSubtitle: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 14,
      color: theme.textMuted,
      textAlign: "center",
    },
    gameOverEmoji: {
      fontSize: 64,
      marginBottom: 4,
    },
    gameOverWord: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 36,
      color: theme.colorCorrect,
      textAlign: "center",
      marginVertical: 16,
      letterSpacing: 4,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.borderBase,
      marginVertical: 16,
    },
  });
}
