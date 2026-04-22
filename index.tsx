import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import App from './App';

const RootApp = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

registerRootComponent(RootApp);
