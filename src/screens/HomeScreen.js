import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

const HomeScreen = ({ navigation }) => {
  const { state, dispatch } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalLevels: 0,
    totalCourses: 0,
    totalNotes: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { section: 'levels', loading: true } });
      
      // Load all data for stats
      const [levelsResponse, coursesResponse, notesResponse] = await Promise.all([
        apiService.getLevels(),
        apiService.getCourses(),
        apiService.getNotes(),
      ]);

      dispatch({ type: 'SET_DATA', payload: { section: 'levels', data: levelsResponse.data } });
      dispatch({ type: 'SET_DATA', payload: { section: 'courses', data: coursesResponse.data } });
      dispatch({ type: 'SET_DATA', payload: { section: 'notes', data: notesResponse.data } });

      console.log('HomeScreen loaded data:');
      console.log('Levels:', levelsResponse.data.length);
      console.log('Courses:', coursesResponse.data.length);
      console.log('Notes:', notesResponse.data.length);

      setStats({
        totalLevels: levelsResponse.data.length,
        totalCourses: coursesResponse.data.length,
        totalNotes: notesResponse.data.length,
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { section: 'levels', error: error.message } });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const getRecentNotes = () => {
    return state.user.recentLinks.slice(0, 5);
  };

  if (state.levels.loading && !refreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (state.levels.error) {
    return <ErrorBoundary error={state.levels.error} onRetry={loadInitialData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to PTEC Studymate</Text>
        <Text style={styles.welcomeSubtitle}>Your educational companion</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="school-outline" size={32} color="#2196F3" />
          <Text style={styles.statNumber}>{stats.totalLevels}</Text>
          <Text style={styles.statLabel}>Levels</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.totalCourses}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text-outline" size={32} color="#FF9800" />
          <Text style={styles.statNumber}>{stats.totalNotes}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Levels')}
          >
            <Ionicons name="layers-outline" size={24} color="#2196F3" />
            <Text style={styles.actionText}>Browse by Level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Courses')}
          >
            <Ionicons name="library-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Browse Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Notes')}
          >
            <Ionicons name="documents-outline" size={24} color="#FF9800" />
            <Text style={styles.actionText}>All Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('FavoritesTab')}
          >
            <Ionicons name="heart-outline" size={24} color="#F44336" />
            <Text style={styles.actionText}>My Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Notes */}
      {getRecentNotes().length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notes</Text>
          {getRecentNotes().map((note, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentNoteCard}
              onPress={() => navigation.navigate('NoteViewer', { note })}
            >
              <Ionicons name="document-text-outline" size={20} color="#FF9800" />
              <Text style={styles.recentNoteTitle} numberOfLines={1}>
                {note.title}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  welcomeSection: {
    backgroundColor: '#2196F3',
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  recentNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  recentNoteTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
});

export default HomeScreen;