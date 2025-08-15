import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import NoteCard from '../components/NoteCard';

const SearchScreen = ({ navigation }) => {
    const { state, dispatch } = useApp();
    const { colors } = useTheme();
    const styles = useThemedStyles(theme => createStyles(theme));
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, state.notes.data, state.courses.data, state.levels.data]);

    const performSearch = (query) => {
        const lowercaseQuery = query.toLowerCase();

        const filteredNotes = state.notes.data.filter(note => {
            const noteTitle = note.title.toLowerCase();
            const course = state.courses.data.find(c => c._id === note.course);
            const level = state.levels.data.find(l => l._id === note.level);

            return noteTitle.includes(lowercaseQuery) ||
                (course && course.title.toLowerCase().includes(lowercaseQuery)) ||
                (level && level.title.toLowerCase().includes(lowercaseQuery));
        });

        setSearchResults(filteredNotes);
    };

    const getCourseTitle = (courseId) => {
        const course = state.courses.data.find(c => c._id === courseId);
        return course ? course.title : 'Unknown Course';
    };

    const getLevelTitle = (levelId) => {
        const level = state.levels.data.find(l => l._id === levelId);
        return level ? level.title : 'Unknown Level';
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

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyStateText}>
                {searchQuery ? 'No results found' : 'Search for notes, courses, or levels'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search notes, courses, levels..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={searchResults}
                renderItem={renderNoteCard}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
    const { colors, shadows, spacing, borderRadius, typography } = theme;
    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.screenBackground,
        },
        searchContainer: {
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.elevated,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
        },
        searchInput: {
            flex: 1,
            ...typography.body1,
            marginLeft: spacing.sm,
            color: colors.text,
        },
        listContainer: {
            paddingVertical: spacing.sm,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: spacing.xxl * 2,
        },
        emptyStateText: {
            ...typography.body1,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.md,
        },
    });
};

export default SearchScreen;