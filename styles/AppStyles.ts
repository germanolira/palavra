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
      borderWidth: 1,
      borderColor: theme.border,
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
      borderRadius: 8,
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
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
    },
    primaryButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.textOnPrimary,
    },
    secondaryButton: {
      backgroundColor: theme.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
      flex: 1,
    },
    secondaryButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.text,
    },
    dangerButton: {
      backgroundColor: theme.danger,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
      flex: 1,
    },
    dangerButtonText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.textOnPrimary,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 10,
    },
    metaBlock: {
      backgroundColor: theme.surfaceMuted,
      borderRadius: 8,
      padding: 12,
      gap: 6,
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.border,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
      minHeight: 220,
    },
    sheetHandle: {
      alignSelf: "center",
      width: 46,
      height: 5,
      borderRadius: 999,
      backgroundColor: theme.borderStrong,
      marginBottom: 16,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    sheetTitle: {
      flex: 1,
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 24,
      color: theme.text,
    },
    sheetContent: {
      gap: 14,
    },
    sheetFooter: {
      gap: 10,
      marginTop: 20,
    },
    modalText: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 15,
      color: theme.textMuted,
      lineHeight: 23,
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
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      gap: 12,
    },
    sectionTitle: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 15,
      color: theme.text,
      letterSpacing: 0.3,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    rowLabelBlock: {
      flex: 1,
      gap: 4,
    },
    rowLabel: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 16,
      color: theme.text,
    },
    rowDescription: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 13,
      color: theme.textMuted,
      lineHeight: 18,
    },
    tutorialExamples: {
      flexDirection: "row",
      gap: 10,
    },
    exampleCard: {
      flex: 1,
      backgroundColor: theme.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      gap: 10,
      alignItems: "center",
    },
    exampleTile: {
      width: 42,
      height: 42,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    exampleTileText: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 18,
      color: theme.textOnPrimary,
    },
    exampleLabel: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 13,
      color: theme.text,
    },
    bulletBlock: {
      gap: 8,
    },
    bulletText: {
      fontFamily: "BeVietnamPro_500Medium",
      fontSize: 14,
      lineHeight: 21,
      color: theme.textMuted,
    },

    // Modal improvements
    modalHeader: {
      alignItems: "center",
      marginBottom: 20,
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
      fontSize: 48,
      marginBottom: 8,
    },
    gameOverWord: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 32,
      color: theme.primary,
      textAlign: "center",
      marginVertical: 12,
      letterSpacing: 2,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },
    primaryButtonLarge: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
    },
    primaryButtonLargeText: {
      fontFamily: "BeVietnamPro_700Bold",
      fontSize: 18,
      color: theme.textOnPrimary,
    },

    debugContainer: {
      alignSelf: "center",
      backgroundColor: theme.debugBackground,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    debugText: {
      fontFamily: "BeVietnamPro_600SemiBold",
      fontSize: 11,
      color: "#120f0a",
      letterSpacing: 2,
    },
  });
}
