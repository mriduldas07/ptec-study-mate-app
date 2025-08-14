import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useThemedStyles = (createStyles) => {
  const { colors, isDark } = useTheme();
  
  return useMemo(() => createStyles(colors, isDark), [colors, isDark, createStyles]);
};