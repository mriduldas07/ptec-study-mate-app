import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

// Enhanced light theme colors - Professional and modern
const lightTheme = {
  // Primary palette - Refined blue as primary color
  primary: '#0A84FF',        // Vibrant blue - more saturated than iOS blue
  primaryLight: 'rgba(10, 132, 255, 0.12)', // Light primary background
  primaryDark: '#0066CC',    // Darker blue for pressed states
  secondary: '#32D74B',      // Vibrant green - fresh and modern
  accent: '#FF9F0A',         // Warm orange - attention grabbing
  error: '#FF3B30',          // Bright red - clear error state
  success: '#32D74B',        // Vibrant green - success states
  warning: '#FF9F0A',        // Warm orange - warnings
  info: '#64D2FF',           // Light blue - informational elements
  
  // Modern background hierarchy - Subtle light gradients
  background: '#F5F7FA',     // Slightly cooler than iOS - more professional
  backgroundSecondary: '#FFFFFF', // Pure white secondary background
  surface: '#FFFFFF',        // Clean white surface
  card: '#FFFFFF',           // Card background
  elevated: '#F8F9FA',       // Subtle elevated surface
  
  // Modern text hierarchy - Improved contrast
  text: '#1A1D1E',           // Near black but softer - better for reading
  textSecondary: '#4A4E51',  // Darker secondary text - better contrast
  textTertiary: '#6E7275',   // Tertiary text - still good contrast
  textQuaternary: '#8E9295', // Quaternary text - subtle but readable
  textInverse: '#FFFFFF',    // White text for dark backgrounds
  
  // Modern borders and dividers - Refined
  border: '#D1D5DB',         // Slightly darker border - more visible
  divider: '#E5E7EB',        // Subtle dividers
  separator: '#D1D5DB',      // Consistent separator
  
  // Status bar
  statusBarStyle: 'dark-content',
  
  // Modern tab bar - Clean and minimal
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#D1D5DB',
  tabBarBlur: 'rgba(255, 255, 255, 0.95)', // Improved blur effect
  
  // Special modern backgrounds
  screenBackground: '#F5F7FA',
  headerBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  
  // Gradient colors for modern effects - More vibrant
  gradientPrimary: ['#0A84FF', '#0066CC'],
  gradientSecondary: ['#32D74B', '#28BD3D'],
  gradientAccent: ['#FF9F0A', '#FF8000'],
  
  // Shadow and elevation - More refined
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowElevated: 'rgba(0, 0, 0, 0.16)',
  
  // Interactive states - More noticeable
  pressed: 'rgba(0, 0, 0, 0.05)',
  hover: 'rgba(0, 0, 0, 0.02)',
  disabled: 'rgba(60, 60, 67, 0.3)',
  
  // Modern glass morphism - Refined
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBlur: 'rgba(255, 255, 255, 0.92)',
};

// Enhanced dark theme colors - Premium and sophisticated
const darkTheme = {
  // Primary palette - Vibrant colors that pop on dark backgrounds
  primary: '#0A84FF',        // Vibrant blue - more saturated than iOS blue
  primaryLight: 'rgba(10, 132, 255, 0.25)', // Light primary background
  primaryDark: '#0066CC',    // Darker blue for pressed states
  secondary: '#30D158',      // Vibrant green - pops on dark background
  accent: '#FF9F0A',         // Warm orange - attention grabbing
  error: '#FF453A',          // Bright red - clear error state
  success: '#32D74B',        // Vibrant green - success states
  warning: '#FF9F0A',        // Warm orange - warnings
  info: '#64D2FF',           // Light blue - informational elements
  
  // Modern background hierarchy - True black for OLED with subtle gradients
  background: '#000000',      // Pure black - OLED friendly
  backgroundSecondary: '#1A1A1C', // Slightly lighter than pure black
  surface: '#1A1A1C',        // Dark surface with slight warmth
  card: '#2A2A2C',           // Card background - slightly warmer
  elevated: '#3A3A3D',       // Elevated surfaces - subtle difference
  
  // Modern text hierarchy - Improved readability
  text: '#FFFFFF',           // Pure white for primary text
  textSecondary: '#E0E0E5',  // Slightly off-white - easier on eyes
  textTertiary: '#B0B0B8',   // Medium gray with slight blue tint
  textQuaternary: '#8A8A90', // Darker gray but still readable
  textInverse: '#000000',    // Black text for light backgrounds
  
  // Modern borders and dividers - More refined
  border: '#3A3A3D',         // Slightly lighter border - more visible
  divider: '#2A2A2C',        // Subtle dividers
  separator: '#3A3A3D',      // Consistent separator
  
  // Status bar
  statusBarStyle: 'light-content',
  
  // Modern tab bar - Sleek and minimal
  tabBarBackground: '#1A1A1C',
  tabBarBorder: '#3A3A3D',
  tabBarBlur: 'rgba(26, 26, 28, 0.95)', // Improved blur effect
  
  // Special modern backgrounds
  screenBackground: '#000000',
  headerBackground: '#1A1A1C',
  modalBackground: '#2A2A2C',
  
  // Gradient colors for modern effects - More vibrant
  gradientPrimary: ['#0A84FF', '#0066CC'],
  gradientSecondary: ['#30D158', '#28BD3D'],
  gradientAccent: ['#FF9F0A', '#FF8000'],
  
  // Shadow and elevation - More refined
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowElevated: 'rgba(0, 0, 0, 0.7)',
  
  // Interactive states - More noticeable
  pressed: 'rgba(255, 255, 255, 0.15)',
  hover: 'rgba(255, 255, 255, 0.07)',
  disabled: 'rgba(235, 235, 245, 0.3)',
  
  // Modern glass morphism - Refined
  glass: 'rgba(26, 26, 28, 0.85)',
  glassBlur: 'rgba(42, 42, 44, 0.92)',
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