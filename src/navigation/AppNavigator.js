import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import LevelsScreen from '../screens/LevelsScreen';
import CoursesScreen from '../screens/CoursesScreen';
import NotesScreen from '../screens/NotesScreen';
import NoteViewerScreen from '../screens/NoteViewerScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'PTEC NoteBot' }}
    />
    <Stack.Screen 
      name="Levels" 
      component={LevelsScreen} 
      options={{ title: 'Levels' }}
    />
    <Stack.Screen 
      name="Courses" 
      component={CoursesScreen} 
      options={({ route }) => ({ 
        title: route.params?.levelTitle ? `${route.params.levelTitle} Courses` : 'All Courses' 
      })}
    />
    <Stack.Screen 
      name="Notes" 
      component={NotesScreen} 
      options={{ title: 'Notes' }}
    />
    <Stack.Screen 
      name="NoteViewer" 
      component={NoteViewerScreen} 
      options={{ title: 'Note Details' }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{ title: 'Search' }}
    />
    <Stack.Screen 
      name="Notes" 
      component={NotesScreen} 
      options={({ route }) => ({ 
        title: route.params?.courseTitle ? `${route.params.courseTitle} Notes` : 'Notes' 
      })}
    />
    <Stack.Screen 
      name="NoteViewer" 
      component={NoteViewerScreen} 
      options={{ title: 'Note Details' }}
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Favorites" 
      component={FavoritesScreen} 
      options={{ title: 'Favorites' }}
    />
    <Stack.Screen 
      name="Notes" 
      component={NotesScreen} 
      options={({ route }) => ({ 
        title: route.params?.courseTitle ? `${route.params.courseTitle} Notes` : 'Notes' 
      })}
    />
    <Stack.Screen 
      name="NoteViewer" 
      component={NoteViewerScreen} 
      options={{ title: 'Note Details' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'SearchTab') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'FavoritesTab') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'SettingsTab') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="SearchTab" 
          component={SearchStack} 
          options={{ tabBarLabel: 'Search' }}
        />
        <Tab.Screen 
          name="FavoritesTab" 
          component={FavoritesStack} 
          options={{ tabBarLabel: 'Favorites' }}
        />
        <Tab.Screen 
          name="SettingsTab" 
          component={SettingsStack} 
          options={{ tabBarLabel: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;