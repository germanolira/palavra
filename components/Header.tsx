import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { AppTheme } from "../constants/theme";
import { useAppStyles } from "../styles/AppStyles";

interface HeaderProps {
  onSettingsPress: () => void;
  onTutorialPress: () => void;
  onTitleLongPress: () => void;
  theme: AppTheme;
}

function Header({
  onSettingsPress,
  onTutorialPress,
  onTitleLongPress,
  theme,
}: HeaderProps) {
  const styles = useAppStyles(theme);

  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        <Pressable
          onPress={onSettingsPress}
          style={styles.iconButton}
          accessibilityLabel="Abrir configuracoes"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={20}
            color={theme.textMain}
          />
        </Pressable>
      </View>

      <Pressable onLongPress={onTitleLongPress}>
        <Text style={styles.headerTitle}>Qual é a palavra?</Text>
      </Pressable>

      <View style={styles.headerSide}>
        <Pressable
          onPress={onTutorialPress}
          style={styles.iconButton}
          accessibilityLabel="Abrir instrucoes"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={20}
            color={theme.textMain}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(Header);
