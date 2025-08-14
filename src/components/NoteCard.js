import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useTheme } from '../context/ThemeContext';

const NoteCard = ({ note, courseTitle, levelTitle, isFavorite, onToggleFavorite, onPress }) => {
  const { colors, isDark } = useTheme();

  const handleOpenLink = async () => {
    if (note.file) {
      try {
        await Linking.openURL(note.file);
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
          <Ionicons name="document-text-outline" size={24} color={colors.accent} />
        </View>
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.pressed }]} 
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
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{note.title}</Text>
        <Text style={[styles.course, { color: colors.secondary }]}>{courseTitle}</Text>
        <Text style={[styles.level, { color: colors.primary }]}>{levelTitle}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>Created: {formatDate(note.createdAt)}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.openButton, { backgroundColor: colors.primary }]} 
          onPress={handleOpenLink}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={16} color="white" />
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 12,
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  course: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  level: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  openButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default NoteCard;