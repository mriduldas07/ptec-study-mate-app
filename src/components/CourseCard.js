import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CourseCard = ({ course, noteCount, levelTitle, isFavorite, onToggleFavorite, onPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        borderColor: colors.border,
      }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
        <Ionicons name="book-outline" size={28} color={colors.secondary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
        <Text style={[styles.level, { color: colors.primary }]}>{levelTitle}</Text>
        <Text style={[styles.noteCount, { color: colors.textSecondary }]}>
          {noteCount !== undefined ? `${noteCount} ${noteCount === 1 ? 'note' : 'notes'}` : 'Loading...'}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.pressed }]} 
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
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0.5,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  level: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  noteCount: {
    fontSize: 13,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 10,
    marginRight: 8,
    borderRadius: 12,
  },
});

export default CourseCard;