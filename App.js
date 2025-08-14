import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/components/SplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        // Hide the expo splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleCustomSplashFinish = () => {
    setShowCustomSplash(false);
  };

  if (!appIsReady) {
    return null;
  }

  if (showCustomSplash) {
    return (
      <>
        <CustomSplashScreen onFinish={handleCustomSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <AppProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AppProvider>
  );
}
