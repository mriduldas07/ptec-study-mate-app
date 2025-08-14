import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

// Light theme colors
const lightTheme = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  accent: '#FF9800',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Border and divider colors
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  // Status bar
  statusBarStyle: 'dark-content',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  
  // Special backgrounds
  screenBackground: '#F5F5F5',
  headerBackground: '#FFFFFF',
};

// Dark theme colors
const darkTheme = {
  primary: '#64B5F6',
  secondary: '#81C784',
  accent: '#FFB74D',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFA726',
  
  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2D2D2D',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  textInverse: '#000000',
  
  // Border and divider colors
  border: '#404040',
  divider: '#2D2D2D',
  
  // Status bar
  statusBarStyle: 'light-content',
  
  // Tab bar
  tabBarBackground: '#1E1E1E',
  tabBarBorder: '#404040',
  
  // Special backgrounds
  screenBackground: '#0F0F0F',
  headerBackground: '#1E1E1E',
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