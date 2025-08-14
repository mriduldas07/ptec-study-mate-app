import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import LevelCard from '../components/LevelCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

const LevelsScreen = ({ navigation }) => {
  const { state, dispatch } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (state.levels.data.length === 0) {
      loadLevels();
    }
  }, []);

  const loadLevels = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { section: 'levels', loading: true } });
      const response = await apiService.getLevels();
      dispatch({ type: 'SET_DATA', payload: { section: 'levels', data: response.data } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { section: 'levels', error: error.message } });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLevels();
    setRefreshing(false);
  };

  const getCourseCountForLevel = (levelId) => {
    return state.courses.data.filter(course => course.level === levelId).length;
  };

  const handleLevelPress = (level) => {
    navigation.navigate('Courses', { 
      levelId: level._id, 
      levelTitle: level.title 
    });
  };

  const renderLevelCard = ({ item }) => (
    <LevelCard
      level={item}
      courseCount={getCourseCountForLevel(item._id)}
      onPress={() => handleLevelPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No levels available</Text>
    </View>
  );

  if (state.levels.loading && !refreshing) {
    return <LoadingSpinner message="Loading levels..." />;
  }

  if (state.levels.error) {
    return <ErrorBoundary error={state.levels.error} onRetry={loadLevels} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.levels.data}
        renderItem={renderLevelCard}
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
  },
});

export default LevelsScreen;