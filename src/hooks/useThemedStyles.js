import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';

export const useThemedStyles = (createStyles) => {
  const themeContext = useTheme();
  const { colors, isDark } = themeContext;
  
  // Create theme object with colors and other properties
  const theme = {
    colors,
    isDark,
    // Enhanced shadows for a more professional look
    shadows: {
      small: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 3,
        elevation: 2,
        ...(Platform.OS === 'android' && {
          backgroundColor: isDark ? colors.card : colors.surface,
        }),
      },
      medium: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 6,
        elevation: 4,
        ...(Platform.OS === 'android' && {
          backgroundColor: isDark ? colors.card : colors.surface,
        }),
      },
      large: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.5 : 0.16,
        shadowRadius: 12,
        elevation: 8,
        ...(Platform.OS === 'android' && {
          backgroundColor: isDark ? colors.card : colors.surface,
        }),
      },
    },
    // Add spacing system for consistent layout
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    // Add border radius system
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      round: 9999,
    },
    // Add typography presets
    typography: {
      h1: { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5 },
      h2: { fontSize: 24, fontWeight: 'bold', letterSpacing: -0.4 },
      h3: { fontSize: 20, fontWeight: '600', letterSpacing: -0.3 },
      h4: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
      h5: { fontSize: 16, fontWeight: '600', letterSpacing: -0.1 },
      body1: { fontSize: 16, letterSpacing: 0 },
      body2: { fontSize: 14, letterSpacing: 0 },
      caption: { fontSize: 12, letterSpacing: 0.2 },
      button: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
    },
  };
  
  return useMemo(() => createStyles(theme), [theme, createStyles]);
};