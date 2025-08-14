import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { state, dispatch } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
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
    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      {/* App Preferences */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        
        <SettingItem
          icon={isDark ? "moon" : "sunny"}
          title="Dark Mode"
          subtitle={`Currently: ${isDark ? 'Dark' : 'Light'} mode`}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.surface : colors.background}
            />
          }
        />
        
        <SettingItem
          icon="link-outline"
          title="Default Link Behavior"
          subtitle={`Open in: ${state.user.preferences.defaultLinkBehavior === 'app' ? 'App' : 'Browser'}`}
          onPress={handleLinkBehaviorChange}
        />
      </View>

      {/* Statistics */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.favorites.notes.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorite Notes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.favorites.courses.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorite Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.user.recentLinks.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Recent Links</Text>
          </View>
        </View>
      </View>

      {/* About & Support */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About & Support</Text>
        
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
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
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
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default SettingsScreen;