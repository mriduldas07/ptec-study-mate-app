import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const ErrorBoundary = ({ error, onRetry }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(theme => createStyles(theme));
  
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>{error || 'An unexpected error occurred'}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
  const { colors, spacing, typography, borderRadius, shadows } = theme;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.screenBackground,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    message: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      ...shadows.small,
    },
    retryText: {
      color: colors.textInverse,
      ...typography.button,
    },
  });
};

export default ErrorBoundary;