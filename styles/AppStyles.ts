import { StyleSheet } from "react-native";

import type { AppTheme } from "../constants/theme";

export function createAppStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 12,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loadingIndicator: {
      color: theme.primary,
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
    headerCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceElevated,
      borderWidth: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    iconButtonText: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 15,
      color: theme.text,
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
      borderColor: theme.border,
      backgroundColor: theme.tileEmpty,
    },
    tileText: {
      fontFamily: "BeVietnamPro_700Bold",
      color: theme.text,
    },
    correct: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },
    present: {
      backgroundColor: theme.warning,
      borderColor: theme.warning,
    },
    absent: {
      backgroundColor: theme.tileAbsent,
      borderColor: theme.tileAbsent,
    },
    active: {
      backgroundColor: theme.tileActive,
      borderColor: theme.borderStrong,
    },
    empty: {
      backgroundColor: theme.tileEmpty,
      borderColor: theme.border,
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
      backgroundColor: theme.keyboardIdle,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    keySpecial: {
      backgroundColor: theme.keyboardSpecial,
    },
    keyText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      color: theme.text,
    },
    keyCorrect: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },
    keyPresent: {
      backgroundColor: theme.warning,
      borderColor: theme.warning,
    },
    keyAbsent: {
      backgroundColor: theme.keyboardAbsent,
      borderColor: theme.keyboardAbsent,
    },

    errorBanner: {
      backgroundColor: theme.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.danger,
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
      color: theme.danger,
      textAlign: "center",
    },

    primaryButton: {
      backgroundColor: theme.primary,
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
      color: theme.textOnPrimary,
    },
    secondaryButton: {
      backgroundColor: theme.surfaceMuted,
      borderWidth: 0,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      flex: 1,
    },
    secondaryButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.text,
    },
    dangerButton: {
      backgroundColor: theme.surfaceMuted,
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
      color: theme.danger,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
    },
    metaBlock: {
      backgroundColor: theme.surfaceMuted,
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
      backgroundColor: theme.surface,
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
      backgroundColor: theme.borderStrong,
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
      color: theme.text,
    },
    sheetContent: {
      gap: 16,
    },
    sheetFooter: {
      gap: 12,
      marginTop: 24,
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
      color: theme.primaryStrong,
      letterSpacing: 6,
      textAlign: "center",
    },

    sectionCard: {
      backgroundColor: theme.surfaceElevated,
      borderRadius: 20,
      borderWidth: 0,
      padding: 20,
      gap: 12,
    },
    sectionTitle: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 17,
      color: theme.text,
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
      color: theme.text,
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
      backgroundColor: theme.surfaceElevated,
      borderWidth: 0,
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
      color: theme.textOnPrimary,
    },
    exampleTextContent: {
      flex: 1,
      gap: 4,
    },
    exampleLabel: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.text,
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
      color: theme.text,
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
      color: theme.primary,
      textAlign: "center",
      marginVertical: 16,
      letterSpacing: 4,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    
    debugContainer: {
      alignSelf: "center",
      backgroundColor: theme.debugBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    debugText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 11,
      color: "#120f0a",
      letterSpacing: 2,
      fontVariant: ["tabular-nums"],
    },
  });
}
