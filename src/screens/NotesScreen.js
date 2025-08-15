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
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import NoteCard from '../components/NoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { getCourseTitle, getLevelTitle } from '../utils/textUtils';

const NotesScreen = ({ navigation, route }) => {
    const { state, dispatch } = useApp();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'title', 'oldest'

    // Fallback colors in case theme is not available
    const safeColors = colors || {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        primary: '#2196F3',
        textSecondary: '#666666',
        textTertiary: '#999999',
        border: '#E0E0E0',
        pressed: 'rgba(0, 0, 0, 0.1)',
    };

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

    // Using utility functions for safe text rendering

    const getSortedNotes = () => {
        const notes = courseId
            ? state.notes.data.filter(note => {
                const courseIdToCheck = typeof note.course === 'string' ? note.course : note.course?._id;
                return courseIdToCheck === courseId;
            })
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
            courseTitle: getCourseTitle(note.course, state.courses.data),
            levelTitle: getLevelTitle(note.course ? note.course.level : note.level, state.levels.data)
        });
    };

    const renderNoteCard = ({ item }) => (
        <NoteCard
            note={item}
            courseTitle={getCourseTitle(item.course, state.courses.data)}
            levelTitle={getLevelTitle(item.course ? item.course.level : item.level, state.levels.data)}
            isFavorite={isFavorite(item)}
            onToggleFavorite={handleToggleFavorite}
            onPress={() => handleNotePress(item)}
        />
    );

    const renderSortOptions = () => (
        <View style={[styles.sortContainer, { backgroundColor: safeColors.surface, borderBottomColor: safeColors.border }]}>
            <Text style={[styles.sortLabel, { color: safeColors.textSecondary }]}>Sort by:</Text>
            <TouchableOpacity
                style={[
                    styles.sortButton,
                    { backgroundColor: sortBy === 'newest' ? safeColors.primary : safeColors.pressed }
                ]}
                onPress={() => setSortBy('newest')}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.sortButtonText,
                    { color: sortBy === 'newest' ? 'white' : safeColors.textSecondary }
                ]}>
                    Newest
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.sortButton,
                    { backgroundColor: sortBy === 'title' ? safeColors.primary : safeColors.pressed }
                ]}
                onPress={() => setSortBy('title')}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.sortButtonText,
                    { color: sortBy === 'title' ? 'white' : safeColors.textSecondary }
                ]}>
                    A-Z
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.sortButton,
                    { backgroundColor: sortBy === 'oldest' ? safeColors.primary : safeColors.pressed }
                ]}
                onPress={() => setSortBy('oldest')}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.sortButtonText,
                    { color: sortBy === 'oldest' ? 'white' : safeColors.textSecondary }
                ]}>
                    Oldest
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {renderSortOptions()}
            <FlatList
                data={getSortedNotes()}
                renderItem={renderNoteCard}
                keyExtractor={(item) => item._id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.listContainer, { backgroundColor: colors.background }]}
                style={{ backgroundColor: colors.background }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
    },
    sortLabel: {
        fontSize: 15,
        fontWeight: '500',
        marginRight: 16,
    },
    sortButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    sortButtonText: {
        fontSize: 13,
        fontWeight: '500',
    },
    listContainer: {
        paddingVertical: 16,
        paddingBottom: 32,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '500',
    },
});

export default NotesScreen;