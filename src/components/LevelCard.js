import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const LevelCard = ({ level, courseCount, onPress }) => {
  const { colors } = useTheme();

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
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="school-outline" size={32} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{level.title}</Text>
        <Text style={[styles.courseCount, { color: colors.textSecondary }]}>
          {courseCount} {courseCount === 1 ? 'course' : 'courses'}
        </Text>
      </View>
      <View style={[styles.chevronContainer, { backgroundColor: colors.pressed }]}>
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
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
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  courseCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LevelCard;