import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const SettingsScreen = () => {
  const { state, dispatch } = useApp();

  const handleThemeToggle = () => {
    const newTheme = state.user.preferences.theme === 'light' ? 'dark' : 'light';
    dispatch({ 
      type: 'UPDATE_PREFERENCES', 
      payload: { theme: newTheme } 
    });
  };

  const handleLinkBehaviorChange = () => {
    const options = ['app', 'browser'];
    const currentIndex = options.indexOf(state.user.preferences.defaultLinkBehavior);
    const nextIndex = (currentIndex + 1) % options.length;
    
    dispatch({ 
      type: 'UPDATE_PREFERENCES', 
      payload: { defaultLinkBehavior: options[nextIndex] } 
    });
  };

  const showAbout = () => {
    Alert.alert(
      'About PTEC NoteBot',
      'Version 1.0.0\n\nA comprehensive educational app for accessing course notes and materials.\n\nDeveloped for PTEC students.',
      [{ text: 'OK' }]
    );
  };

  const showHelp = () => {
    Alert.alert(
      'Help & Support',
      'For support and questions:\n\n• Browse levels to find courses\n• Tap heart to add favorites\n• Use search to find specific notes\n• Tap "Open" to view files in Google Drive',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#2196F3" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingItem
          icon="moon-outline"
          title="Theme"
          subtitle={`Currently: ${state.user.preferences.theme === 'light' ? 'Light' : 'Dark'}`}
          onPress={handleThemeToggle}
        />
        
        <SettingItem
          icon="link-outline"
          title="Default Link Behavior"
          subtitle={`Open in: ${state.user.preferences.defaultLinkBehavior === 'app' ? 'App' : 'Browser'}`}
          onPress={handleLinkBehaviorChange}
        />
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.favorites.notes.length}</Text>
            <Text style={styles.statLabel}>Favorite Notes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.favorites.courses.length}</Text>
            <Text style={styles.statLabel}>Favorite Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.user.recentLinks.length}</Text>
            <Text style={styles.statLabel}>Recent Links</Text>
          </View>
        </View>
      </View>

      {/* About & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About & Support</Text>
        
        <SettingItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help using the app"
          onPress={showHelp}
        />
        
        <SettingItem
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={showAbout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default SettingsScreen;