import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const NoteCard = ({ note, courseTitle, levelTitle, isFavorite, onToggleFavorite, onPress }) => {

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={24} color="#FF9800" />
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => onToggleFavorite(note)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavorite ? "#F44336" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
        <Text style={styles.course}>{courseTitle}</Text>
        <Text style={styles.level}>{levelTitle}</Text>
        <Text style={styles.date}>Created: {formatDate(note.createdAt)}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.openButton} onPress={handleOpenLink}>
          <Ionicons name="open-outline" size={16} color="white" />
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  course: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  level: {
    fontSize: 12,
    color: '#2196F3',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  openButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  openButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default NoteCard;