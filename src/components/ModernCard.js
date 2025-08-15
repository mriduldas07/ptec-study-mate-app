import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const ModernCard = ({ 
  children, 
  style, 
  elevated = false, 
  glass = false, 
  gradient = false,
  ...props 
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(theme => createStyles(theme, { elevated, glass, gradient }));

  return (
    <View 
      style={[
        styles.card,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme, { elevated, glass }) => {
  const { colors, shadows, spacing, borderRadius } = theme;
  
  let cardStyle = {};
  
  if (glass) {
    cardStyle = {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.border,
      // Note: backdropFilter is not supported in React Native, but kept for reference
      // backdropFilter: 'blur(20px)',
    };
  } else if (elevated) {
    cardStyle = {
      backgroundColor: colors.elevated,
      ...shadows.large,
    };
  } else {
    cardStyle = {
      backgroundColor: colors.surface,
      ...shadows.small,
    };
  }
  
  return StyleSheet.create({
    card: {
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md,
      ...cardStyle,
    },
  });
};

export default ModernCard;