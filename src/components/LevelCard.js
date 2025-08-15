import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const LevelCard = ({ level, courseCount, onPress }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(theme => createStyles(theme));
  
  // Create animated value for subtle hover effect
  const [scaleAnim] = React.useState(new Animated.Value(1));
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={32} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{level.title}</Text>
          <Text style={styles.courseCount}>
            {courseCount} {courseCount === 1 ? 'course' : 'courses'}
          </Text>
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
  const { colors, shadows, spacing, borderRadius, typography } = theme;
  
  return StyleSheet.create({
    card: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 0.5,
      ...shadows.medium,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      backgroundColor: colors.primary + '15',
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.h4,
      color: colors.text,
      marginBottom: spacing.xs,
      letterSpacing: -0.2,
    },
    courseCount: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    chevronContainer: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.pressed,
    },
  });
};

export default LevelCard;