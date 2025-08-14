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
import NoteCard from '../components/NoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

const NotesScreen = ({ navigation, route }) => {
    const { state, dispatch } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'title', 'oldest'

    const { courseId, courseTitle, levelTitle } = route.params || {};

    useEffect(() => {
        loadNotes();
    }, [courseId]);

    const loadNotes = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: { section: 'notes', loading: true } });

            // Load notes, courses, and levels to get complete data
            const [notesResponse, coursesResponse, levelsResponse] = await Promise.all([
                courseId ? apiService.getNotesByCourse(courseId) : apiService.getNotes(),
                apiService.getCourses(),
                apiService.getLevels(),
            ]);

            dispatch({ type: 'SET_DATA', payload: { section: 'notes', data: notesResponse.data } });
            dispatch({ type: 'SET_DATA', payload: { section: 'courses', data: coursesResponse.data } });
            dispatch({ type: 'SET_DATA', payload: { section: 'levels', data: levelsResponse.data } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: { section: 'notes', error: error.message } });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotes();
        setRefreshing(false);
    };

    const getCourseTitle = (courseId) => {
        return courseId ? courseId.title : 'Unknown Course';
    };

    const getLevelTitle = (levelId) => {
        const level = state.levels.data.find(l => l._id === levelId);
        return level ? level.title : 'Unknown Level';
    };

    const getSortedNotes = () => {
        const notes = courseId
            ? state.notes.data.filter(note => note.course._id === courseId)
            : state.notes.data;

        return [...notes].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                default:
                    return 0;
            }
        });
    };

    const isFavorite = (note) => {
        return state.favorites.notes.some(fav => fav._id === note._id);
    };

    const handleToggleFavorite = (note) => {
        if (isFavorite(note)) {
            dispatch({
                type: 'REMOVE_FAVORITE',
                payload: { type: 'notes', id: note._id }
            });
        } else {
            dispatch({
                type: 'ADD_FAVORITE',
                payload: { type: 'notes', item: note }
            });
        }
    };

    const handleNotePress = (note) => {
        // Add to recent links
        dispatch({ type: 'ADD_RECENT_LINK', payload: note });

        navigation.navigate('NoteViewer', {
            note,
            courseTitle: getCourseTitle(note.course),
            levelTitle: getLevelTitle(note.level)
        });
    };

    const renderNoteCard = ({ item }) => (
        <NoteCard
            note={item}
            courseTitle={getCourseTitle(item.course)}
            levelTitle={getLevelTitle(item.level)}
            isFavorite={isFavorite(item)}
            onToggleFavorite={handleToggleFavorite}
            onPress={() => handleNotePress(item)}
        />
    );

    const renderSortOptions = () => (
        <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
                onPress={() => setSortBy('newest')}
            >
                <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.sortButtonTextActive]}>
                    Newest
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
                onPress={() => setSortBy('title')}
            >
                <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
                    A-Z
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'oldest' && styles.sortButtonActive]}
                onPress={() => setSortBy('oldest')}
            >
                <Text style={[styles.sortButtonText, sortBy === 'oldest' && styles.sortButtonTextActive]}>
                    Oldest
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
                {courseId ? `No notes found for ${courseTitle}` : 'No notes available'}
            </Text>
        </View>
    );

    if ((state.notes.loading || state.courses.loading || state.levels.loading) && !refreshing) {
        return <LoadingSpinner message="Loading notes..." />;
    }

    if (state.notes.error) {
        return <ErrorBoundary error={state.notes.error} onRetry={loadNotes} />;
    }

    return (
        <View style={styles.container}>
            {renderSortOptions()}
            <FlatList
                data={getSortedNotes()}
                renderItem={renderNoteCard}
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

export default NotesScreen;