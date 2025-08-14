import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';

// Keep the native splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Simulate some loading time for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        // Hide the native splash screen
        await SplashScreenExpo.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (!appIsReady) {
    return null;
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </ThemeProvider>
  );
}
