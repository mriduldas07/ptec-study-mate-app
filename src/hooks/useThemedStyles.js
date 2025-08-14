import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useThemedStyles = (createStyles) => {
  const themeContext = useTheme();
  const { colors, isDark } = themeContext;
  
  // Create theme object with colors and other properties
  const theme = {
    colors,
    isDark,
    shadows: {
      small: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      medium: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      large: {
        shadowColor: colors?.shadow || '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  };
  
  return useMemo(() => createStyles(theme), [theme, createStyles]);
};