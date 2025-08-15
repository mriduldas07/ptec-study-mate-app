import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { safeText, safeFormatDate } from '../utils/textUtils';

const NoteCard = ({ note, courseTitle, levelTitle, isFavorite, onToggleFavorite, onPress }) => {
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

  const handleOpenLink = async () => {
    if (note.file) {
      try {
        await Linking.openURL(note.file);
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  // Using utility function for safe date formatting

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={24} color={colors.accent} />
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(note)}
            activeOpacity={0.6}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? colors.error : colors.textTertiary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{safeText(note.title, "Untitled Note")}</Text>
          <Text style={styles.course}>{safeText(courseTitle, "Unknown Course")}</Text>
          <Text style={styles.level}>{safeText(levelTitle, "Unknown Level")}</Text>
          <Text style={styles.date}>Created: {safeFormatDate(note.createdAt)}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.openButton}
            onPress={handleOpenLink}
            activeOpacity={0.8}
          >
            <Ionicons name="open-outline" size={16} color={colors.textInverse} />
            <Text style={styles.openButtonText}>Open</Text>
          </TouchableOpacity>
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
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 0.5,
      ...shadows.medium,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.accent + '15',
    },
  favoriteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pressed,
  },
  content: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  course: {
    ...typography.subtitle,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  level: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  openButtonText: {
    color: colors.textInverse,
    ...typography.button,
    marginLeft: spacing.xs,
  },
});
};

export default NoteCard;