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
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const NoteViewerScreen = ({ route }) => {
  const { note, courseTitle, levelTitle } = route.params;
  const { state, dispatch } = useApp();

  // Get theme with error handling
  let theme, styles;
  try {
    const themeContext = useTheme();
    theme = themeContext;
    styles = useThemedStyles(createStyles);
  } catch (error) {
    console.error('Theme error:', error);
    // Fallback theme
    theme = {
      colors: {
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        primary: '#007AFF',
        primaryLight: 'rgba(0, 122, 255, 0.1)',
        success: '#34C759',
        error: '#FF3B30',
        backgroundSecondary: '#ffffff',
      }
    };
    styles = createStyles(theme);
  }

  // Add safety check for theme
  if (!theme || !theme.colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ color: '#000000' }}>Loading theme...</Text>
      </View>
    );
  }

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.fileIconContainer}>
            <Ionicons
              name={getFileIcon(fileType)}
              size={56}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>{levelTitle}</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.breadcrumbText}>{courseTitle}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite() ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite() ? theme.colors.error : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleOpenInDrive}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonContent}>
            <Ionicons name="open-outline" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Open in Drive</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleOpenInBrowser}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonContent}>
            <Ionicons name="globe-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.secondaryButtonText}>Open in Browser</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Utility Actions */}
      <View style={styles.utilitySection}>
        <TouchableOpacity
          style={styles.utilityCard}
          onPress={handleCopyLink}
          activeOpacity={0.7}
        >
          <View style={styles.utilityIconContainer}>
            <Ionicons name="copy-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.utilityText}>Copy Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityCard}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <View style={styles.utilityIconContainer}>
            <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.utilityText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* File Information Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>File Details</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="document-outline" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>File Type</Text>
              <Text style={styles.infoValue}>
                {fileType.charAt(0).toUpperCase() + fileType.slice(1)} Document
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, styles.statusActive]}>Available</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>{formatDate(note.createdAt)}</Text>
            </View>
          </View>

          {note.updatedAt !== note.createdAt && (
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="refresh-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>{formatDate(note.updatedAt)}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroSection: {
    backgroundColor: theme.colors.surface,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.medium,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  fileIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  heroText: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  utilitySection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  utilityCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.small,
  },
  utilityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  utilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    ...theme.shadows.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600',
  },
  statusActive: {
    color: theme.colors.success,
  },
});

export default NoteViewerScreen;