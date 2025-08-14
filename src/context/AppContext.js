import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const initialState = {
  levels: {
    data: [],
    loading: false,
    error: null,
  },
  courses: {
    data: [],
    loading: false,
    error: null,
  },
  notes: {
    data: [],
    loading: false,
    error: null,
  },
  favorites: {
    notes: [],
    courses: [],
  },
  user: {
    preferences: {
      theme: 'light',
      language: 'en',
      defaultLinkBehavior: 'app',
    },
    recentLinks: [],
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          loading: action.payload.loading,
        },
      };
    case 'SET_DATA':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          data: action.payload.data,
          loading: false,
          error: null,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          error: action.payload.error,
          loading: false,
        },
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [action.payload.type]: [
            ...state.favorites[action.payload.type],
            action.payload.item,
          ],
        },
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [action.payload.type]: state.favorites[action.payload.type].filter(
            item => item._id !== action.payload.id
          ),
        },
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload,
          },
        },
      };
    case 'ADD_RECENT_LINK':
      return {
        ...state,
        user: {
          ...state.user,
          recentLinks: [
            action.payload,
            ...state.user.recentLinks.filter(link => link._id !== action.payload._id),
          ].slice(0, 10), // Keep only last 10
        },
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load favorites from AsyncStorage on app start
  useEffect(() => {
    loadFavorites();
    loadPreferences();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(favorites) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('preferences');
      if (preferences) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: JSON.parse(preferences) });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const savePreferences = async (preferences) => {
    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Save favorites whenever they change
  useEffect(() => {
    saveFavorites(state.favorites);
  }, [state.favorites]);

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences(state.user.preferences);
  }, [state.user.preferences]);

  const value = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};