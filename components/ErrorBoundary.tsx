import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LIGHT_THEME } from "../constants/theme";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
  resetKey: number;
};

class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    resetKey: 0,
  };

  static getDerivedStateFromError(error: Error): Pick<ErrorBoundaryState, "error"> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState(({ resetKey }) => ({
      error: null,
      resetKey: resetKey + 1,
    }));
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado.</Text>
          <Text style={styles.description}>
            Não foi possível continuar o jogo agora. Tente reiniciar a tela.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={this.handleRetry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: LIGHT_THEME.bgBase,
    gap: 16,
  },
  title: {
    fontFamily: "BeVietnamPro_700Bold",
    fontSize: 24,
    color: LIGHT_THEME.textMain,
    textAlign: "center",
  },
  description: {
    fontFamily: "BeVietnamPro_500Medium",
    fontSize: 16,
    lineHeight: 24,
    color: LIGHT_THEME.textMuted,
    textAlign: "center",
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: LIGHT_THEME.colorCorrect,
  },
  buttonText: {
    fontFamily: "BeVietnamPro_600SemiBold",
    fontSize: 16,
    color: LIGHT_THEME.textInverse,
  },
});

export default ErrorBoundary;
