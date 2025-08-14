import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

// Modern light theme colors - Clean and premium
const lightTheme = {
  primary: '#007AFF',        // iOS Blue - consistent with dark mode
  primaryLight: 'rgba(0, 122, 255, 0.1)', // Light primary background
  secondary: '#34C759',      // iOS Green - vibrant and modern
  accent: '#FF9500',         // iOS Orange - warm accent
  error: '#FF3B30',          // iOS Red - clear error state
  success: '#34C759',        // iOS Green - success states
  warning: '#FF9500',        // iOS Orange - warnings
  
  // Modern background hierarchy
  background: '#F2F2F7',     // iOS system background
  backgroundSecondary: '#FFFFFF', // Secondary background
  surface: '#FFFFFF',        // Clean surface
  card: '#FFFFFF',           // Card background
  elevated: '#F2F2F7',       // iOS elevated surface
  
  // Modern text hierarchy
  text: '#000000',           // Pure black for primary text
  textSecondary: '#3C3C43',  // iOS secondary text
  textTertiary: '#3C3C4399', // iOS tertiary text (60% opacity)
  textQuaternary: '#3C3C434D', // iOS quaternary text (30% opacity)
  textInverse: '#FFFFFF',
  
  // Modern borders and dividers
  border: '#C6C6C8',         // iOS separator
  divider: '#E5E5EA',        // Subtle dividers
  separator: '#C6C6C8',      // iOS separator
  
  // Status bar
  statusBarStyle: 'dark-content',
  
  // Modern tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#C6C6C8',
  tabBarBlur: 'rgba(255, 255, 255, 0.9)', // Blur effect
  
  // Special modern backgrounds
  screenBackground: '#F2F2F7',
  headerBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  
  // Gradient colors for modern effects
  gradientPrimary: ['#007AFF', '#5856D6'],
  gradientSecondary: ['#34C759', '#30D158'],
  gradientAccent: ['#FF9500', '#FF6B35'],
  
  // Shadow and elevation
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowElevated: 'rgba(0, 0, 0, 0.2)',
  
  // Interactive states
  pressed: 'rgba(0, 0, 0, 0.1)',
  hover: 'rgba(0, 0, 0, 0.05)',
  disabled: 'rgba(60, 60, 67, 0.3)',
  
  // Modern glass morphism
  glass: 'rgba(255, 255, 255, 0.8)',
  glassBlur: 'rgba(255, 255, 255, 0.9)',
};

// Modern dark theme colors - Premium design
const darkTheme = {
  primary: '#007AFF',        // iOS Blue - modern and vibrant
  primaryLight: 'rgba(0, 122, 255, 0.2)', // Light primary background
  secondary: '#30D158',      // iOS Green - fresh and modern
  accent: '#FF9F0A',         // iOS Orange - warm accent
  error: '#FF453A',          // iOS Red - attention grabbing
  success: '#32D74B',        // iOS Green - success states
  warning: '#FF9F0A',        // iOS Orange - warnings
  
  // Modern background hierarchy
  background: '#000000',      // Pure black - OLED friendly
  backgroundSecondary: '#1C1C1E', // Secondary background
  surface: '#1C1C1E',        // iOS dark surface
  card: '#2C2C2E',           // iOS dark card
  elevated: '#3A3A3C',       // Elevated surfaces
  
  // Modern text hierarchy
  text: '#FFFFFF',           // Pure white for primary text
  textSecondary: '#EBEBF5',  // iOS secondary text
  textTertiary: '#EBEBF599', // iOS tertiary text (60% opacity)
  textQuaternary: '#EBEBF54D', // iOS quaternary text (30% opacity)
  textInverse: '#000000',
  
  // Modern borders and dividers
  border: '#38383A',         // iOS separator
  divider: '#48484A',        // Subtle dividers
  separator: '#38383A',      // iOS separator
  
  // Status bar
  statusBarStyle: 'light-content',
  
  // Modern tab bar
  tabBarBackground: '#1C1C1E',
  tabBarBorder: '#38383A',
  tabBarBlur: 'rgba(28, 28, 30, 0.9)', // Blur effect
  
  // Special modern backgrounds
  screenBackground: '#000000',
  headerBackground: '#1C1C1E',
  modalBackground: '#2C2C2E',
  
  // Gradient colors for modern effects
  gradientPrimary: ['#007AFF', '#5856D6'],
  gradientSecondary: ['#30D158', '#32D74B'],
  gradientAccent: ['#FF9F0A', '#FF6B35'],
  
  // Shadow and elevation
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowElevated: 'rgba(0, 0, 0, 0.5)',
  
  // Interactive states
  pressed: 'rgba(255, 255, 255, 0.1)',
  hover: 'rgba(255, 255, 255, 0.05)',
  disabled: 'rgba(235, 235, 245, 0.3)',
  
  // Modern glass morphism
  glass: 'rgba(28, 28, 30, 0.8)',
  glassBlur: 'rgba(44, 44, 46, 0.9)',
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const initialState = {
  theme: 'light',
  isDark: false,
  colors: lightTheme,
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      const newTheme = action.payload;
      const isDark = newTheme === 'dark';
      return {
        ...state,
        theme: newTheme,
        isDark,
        colors: themes[newTheme],
      };
    case 'TOGGLE_THEME':
      const toggledTheme = state.theme === 'light' ? 'dark' : 'light';
      const toggledIsDark = toggledTheme === 'dark';
      return {
        ...state,
        theme: toggledTheme,
        isDark: toggledIsDark,
        colors: themes[toggledTheme],
      };
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only auto-switch if user hasn't manually set a preference
      loadSavedTheme();
    });

    return () => subscription?.remove();
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    saveTheme(state.theme);
  }, [state.theme]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        dispatch({ type: 'SET_THEME', payload: savedTheme });
      } else {
        // Use system theme as default
        const systemTheme = Appearance.getColorScheme() || 'light';
        dispatch({ type: 'SET_THEME', payload: systemTheme });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to light theme on error
      dispatch({ type: 'SET_THEME', payload: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const value = {
    ...state,
    setTheme,
    toggleTheme,
  };

  // Show loading until theme is initialized
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default light theme if context is not available
    return {
      theme: 'light',
      isDark: false,
      colors: lightTheme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};