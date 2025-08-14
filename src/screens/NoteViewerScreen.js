import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '../context/AppContext';

const NoteViewerScreen = ({ route }) => {
  const { note, courseTitle, levelTitle } = route.params;
  const { state, dispatch } = useApp();

  const isFavorite = () => {
    return state.favorites.notes.some(fav => fav._id === note._id);
  };

  const handleToggleFavorite = () => {
    if (isFavorite()) {
      dispatch({ 
        type: 'REMOVE_FAVORITE', 
        payload: { type: 'notes', id: note._id } 
      });
      Alert.alert('Removed', 'Note removed from favorites');
    } else {
      dispatch({ 
        type: 'ADD_FAVORITE', 
        payload: { type: 'notes', item: note } 
      });
      Alert.alert('Added', 'Note added to favorites');
    }
  };

  const handleOpenInDrive = async () => {
    try {
      if (note.file) {
        await Linking.openURL(note.file);
      } else {
        Alert.alert('Error', 'No file link available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open the file');
    }
  };

  const handleOpenInBrowser = async () => {
    try {
      if (note.file) {
        const browserUrl = note.file.replace('/view', '/edit');
        await Linking.openURL(browserUrl);
      } else {
        Alert.alert('Error', 'No file link available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open in browser');
    }
  };

  const handleCopyLink = async () => {
    try {
      if (note.file) {
        await Clipboard.setStringAsync(note.file);
        Alert.alert('Copied', 'Link copied to clipboard');
      } else {
        Alert.alert('Error', 'No file link available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not copy link');
    }
  };

  const handleShare = async () => {
    try {
      if (note.file) {
        await Share.share({
          message: `Check out this note: ${note.title}\n\n${note.file}`,
          title: note.title,
        });
      } else {
        Alert.alert('Error', 'No file link available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share the note');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileType = (url) => {
    if (!url) return 'unknown';
    if (url.includes('document')) return 'doc';
    if (url.includes('spreadsheets')) return 'sheet';
    if (url.includes('presentation')) return 'slide';
    if (url.includes('pdf')) return 'pdf';
    return 'file';
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'doc':
        return 'document-text';
      case 'sheet':
        return 'grid';
      case 'slide':
        return 'easel';
      case 'pdf':
        return 'document';
      default:
        return 'document-outline';
    }
  };

  const fileType = getFileType(note.file);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.fileIconContainer}>
          <Ionicons 
            name={getFileIcon(fileType)} 
            size={48} 
            color="#FF9800" 
          />
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={isFavorite() ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite() ? "#F44336" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>

      {/* Note Information */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{note.title}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="book-outline" size={16} color="#4CAF50" />
            <Text style={styles.metaText}>{courseTitle}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="school-outline" size={16} color="#2196F3" />
            <Text style={styles.metaText}>{levelTitle}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.metaText}>Created: {formatDate(note.createdAt)}</Text>
          </View>
          
          {note.updatedAt !== note.createdAt && (
            <View style={styles.metaItem}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.metaText}>Updated: {formatDate(note.updatedAt)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={handleOpenInDrive}
        >
          <Ionicons name="open-outline" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Open in Drive</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]} 
          onPress={handleOpenInBrowser}
        >
          <Ionicons name="globe-outline" size={20} color="#2196F3" />
          <Text style={styles.secondaryButtonText}>Open in Browser</Text>
        </TouchableOpacity>

        <View style={styles.utilityButtons}>
          <TouchableOpacity 
            style={styles.utilityButton} 
            onPress={handleCopyLink}
          >
            <Ionicons name="copy-outline" size={20} color="#666" />
            <Text style={styles.utilityButtonText}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.utilityButton} 
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.utilityButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* File Preview Info */}
      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>File Information</Text>
        <View style={styles.fileInfo}>
          <View style={styles.fileInfoItem}>
            <Text style={styles.fileInfoLabel}>Type:</Text>
            <Text style={styles.fileInfoValue}>
              {fileType.charAt(0).toUpperCase() + fileType.slice(1)} File
            </Text>
          </View>
          <View style={styles.fileInfoItem}>
            <Text style={styles.fileInfoLabel}>Status:</Text>
            <Text style={[styles.fileInfoValue, styles.statusActive]}>
              Available
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaInfo: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  utilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  utilityButton: {
    alignItems: 'center',
    padding: 12,
  },
  utilityButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  previewSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fileInfo: {
    gap: 12,
  },
  fileInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  fileInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusActive: {
    color: '#4CAF50',
  },
});

export default NoteViewerScreen;