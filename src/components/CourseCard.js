import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const CourseCard = ({ course, noteCount, levelTitle, isFavorite, onToggleFavorite, onPress }) => {
  const { colors, isDark } = useTheme();
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
          <Ionicons name="book-outline" size={28} color={colors.secondary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.level}>{levelTitle}</Text>
          <Text style={styles.noteCount}>
            {noteCount !== undefined ? `${noteCount} ${noteCount === 1 ? 'note' : 'notes'}` : 'Loading...'}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite && onToggleFavorite(course)}
            activeOpacity={0.6}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? colors.error : colors.textTertiary} 
            />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
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
      backgroundColor: colors.secondary + '15',
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.h4,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    level: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: spacing.xs,
    },
    noteCount: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      padding: spacing.sm,
      marginRight: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.pressed,
    },
  });
};

export default CourseCard;