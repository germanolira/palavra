import { registerRootComponent } from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const RootApp = () => (
  <GestureHandlerRootView style={styles.container}>
    <ErrorBoundary>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </ErrorBoundary>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

registerRootComponent(RootApp);
