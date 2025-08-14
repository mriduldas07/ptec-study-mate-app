import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import NoteCard from '../components/NoteCard';
import CourseCard from '../components/CourseCard';

const FavoritesScreen = ({ navigation }) => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'courses'

  const getCourseTitle = (courseId) => {
    const course = state.courses.data.find(c => c._id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const getLevelTitle = (levelId) => {
    const level = state.levels.data.find(l => l._id === levelId);
    return level ? level.title : 'Unknown Level';
  };

  const getNoteCountForCourse = (courseId) => {
    return state.notes.data.filter(note => note.course === courseId).length;
  };

  const handleToggleFavorite = (item, type) => {
    dispatch({ 
      type: 'REMOVE_FAVORITE', 
      payload: { type, id: item._id } 
    });
  };

  const handleNotePress = (note) => {
    dispatch({ type: 'ADD_RECENT_LINK', payload: note });
    navigation.navigate('NoteViewer', { 
      note,
      courseTitle: getCourseTitle(note.course),
      levelTitle: getLevelTitle(note.level)
    });
  };

  const handleCoursePress = (course) => {
    navigation.navigate('Notes', { 
      courseId: course._id, 
      courseTitle: course.title,
      levelTitle: getLevelTitle(course.level)
    });
  };

  const renderNoteCard = ({ item }) => (
    <NoteCard
      note={item}
      courseTitle={getCourseTitle(item.course)}
      levelTitle={getLevelTitle(item.level)}
      isFavorite={true}
      onToggleFavorite={() => handleToggleFavorite(item, 'notes')}
      onPress={() => handleNotePress(item)}
    />
  );

  const renderCourseCard = ({ item }) => (
    <CourseCard
      course={item}
      noteCount={getNoteCountForCourse(item._id)}
      levelTitle={getLevelTitle(item.level)}
      isFavorite={true}
      onToggleFavorite={() => handleToggleFavorite(item, 'courses')}
      onPress={() => handleCoursePress(item)}
    />
  ); 
 const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>
        No favorite {activeTab} yet
      </Text>
      <Text style={styles.emptyStateSubtext}>
        Tap the heart icon to add items to your favorites
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Notes ({state.favorites.notes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
          onPress={() => setActiveTab('courses')}
        >
          <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
            Courses ({state.favorites.courses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={activeTab === 'notes' ? state.favorites.notes : state.favorites.courses}
        renderItem={activeTab === 'notes' ? renderNoteCard : renderCourseCard}
        keyExtractor={(item) => item._id}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
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
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen;