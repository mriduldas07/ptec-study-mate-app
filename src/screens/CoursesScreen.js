import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

const CoursesScreen = ({ navigation, route }) => {
  const { state, dispatch } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('title'); // 'title', 'newest', 'notes'
  const [dataLoaded, setDataLoaded] = useState(false);

  const { levelId, levelTitle } = route.params || {};

  useEffect(() => {
    loadCourses();
  }, [levelId]);

  // Force re-render when data is loaded
  useEffect(() => {
    
  }, [dataLoaded, state.notes.data, state.courses.data]);

  const loadCourses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { section: 'courses', loading: true } });

      // Load courses, notes, and levels to get complete data
      const [coursesResponse, notesResponse, levelsResponse] = await Promise.all([
        apiService.getCourses(),
        apiService.getNotes(),
        apiService.getLevels(),
      ]);

      dispatch({ type: 'SET_DATA', payload: { section: 'courses', data: coursesResponse.data } });
      dispatch({ type: 'SET_DATA', payload: { section: 'notes', data: notesResponse.data } });
      dispatch({ type: 'SET_DATA', payload: { section: 'levels', data: levelsResponse.data } });

      // Mark data as loaded to trigger re-render
      setDataLoaded(true);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { section: 'courses', error: error.message } });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const getLevelTitle = (levelId) => {
    const level = state.levels.data.find(l => l._id === levelId);
    return level ? level.title : 'Unknown Level';
  };

  const getNoteCountForCourse = (courseId) => {
    if (!state.notes.data || state.notes.data.length === 0) {
      return 0;
    }


    const filteredNotes = state.notes.data.filter(note => note.course._id === courseId);
    const count = filteredNotes.length;
    return count;
  };

  const getSortedCourses = () => {
    // If levelId is provided, filter courses by level, otherwise show all courses
    const courses = levelId
      ? state.courses.data.filter(course => course.level === levelId)
      : state.courses.data;

    return [...courses].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'notes':
          return getNoteCountForCourse(b._id) - getNoteCountForCourse(a._id);
        default:
          return 0;
      }
    });
  };

  const handleCoursePress = (course) => {
    navigation.navigate('Notes', {
      courseId: course._id,
      courseTitle: course.title,
      levelTitle: getLevelTitle(course.level)
    });
  };

  const isFavoriteCourse = (course) => {
    return state.favorites.courses.some(fav => fav._id === course._id);
  };

  const handleToggleFavoriteCourse = (course) => {
    if (isFavoriteCourse(course)) {
      dispatch({ 
        type: 'REMOVE_FAVORITE', 
        payload: { type: 'courses', id: course._id } 
      });
    } else {
      dispatch({ 
        type: 'ADD_FAVORITE', 
        payload: { type: 'courses', item: course } 
      });
    }
  };

  const renderCourseCard = ({ item }) => {
    const noteCount = getNoteCountForCourse(item._id);
    return (
      <CourseCard
        course={item}
        noteCount={noteCount}
        levelTitle={getLevelTitle(item.level)}
        isFavorite={isFavoriteCourse(item)}
        onToggleFavorite={handleToggleFavoriteCourse}
        onPress={() => handleCoursePress(item)}
      />
    );
  };

  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
        onPress={() => setSortBy('title')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
          A-Z
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
        onPress={() => setSortBy('newest')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.sortButtonTextActive]}>
          Newest
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'notes' && styles.sortButtonActive]}
        onPress={() => setSortBy('notes')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'notes' && styles.sortButtonTextActive]}>
          Most Notes
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>
        {levelId ? `No courses found for ${levelTitle}` : 'No courses available'}
      </Text>
    </View>
  );

  if ((state.courses.loading || state.notes.loading) && !refreshing) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  if (state.courses.error) {
    return <ErrorBoundary error={state.courses.error} onRetry={loadCourses} />;
  }

  return (
    <View style={styles.container}>
      {renderSortOptions()}
      <FlatList
        data={getSortedCourses()}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default CoursesScreen;