import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import ModernCard from "../components/ModernCard";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { apiService } from "../services/api";

const HomeScreen = ({ navigation }) => {
  const { state, dispatch } = useApp();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalLevels: 0,
    totalCourses: 0,
    totalNotes: 0,
  });

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.2],
    extrapolate: "clamp",
  });
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  // Logo animation
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Use the enhanced themed styles hook
  const styles = useThemedStyles((theme) => createStyles(theme));

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: { section: "levels", loading: true },
      });

      // Load all data for stats
      const [levelsResponse, coursesResponse, notesResponse] =
        await Promise.all([
          apiService.getLevels(),
          apiService.getCourses(),
          apiService.getNotes(),
        ]);

      dispatch({
        type: "SET_DATA",
        payload: { section: "levels", data: levelsResponse.data },
      });
      dispatch({
        type: "SET_DATA",
        payload: { section: "courses", data: coursesResponse.data },
      });
      dispatch({
        type: "SET_DATA",
        payload: { section: "notes", data: notesResponse.data },
      });

      setStats({
        totalLevels: levelsResponse.data.length,
        totalCourses: coursesResponse.data.length,
        totalNotes: notesResponse.data.length,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: { section: "levels", error: error.message },
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const getRecentNotes = () => {
    return state.user.recentLinks.slice(0, 5);
  };

  if (state.levels.loading && !refreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (state.levels.error) {
    return (
      <ErrorBoundary error={state.levels.error} onRetry={loadInitialData} />
    );
  }

  return (
    <>
      <StatusBar barStyle={colors.statusBarStyle} />
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary, colors.secondary]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Welcome Section - Modern gradient header with parallax effect */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <LinearGradient
            colors={
              isDark
                ? [
                    "rgba(25,25,112,0.9)",
                    "rgba(65,105,225,0.7)",
                    "rgba(10,132,255,0.6)",
                  ]
                : [
                    "rgba(70,130,180,0.8)",
                    "rgba(30,144,255,0.7)",
                    "rgba(0,191,255,0.6)",
                  ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeBackground}
          />
          <View style={styles.welcomeFlexContainer}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Hello Buddy!</Text>
              <Text style={styles.welcomeSubtitle}>
                Your educational companion
              </Text>
              <LinearGradient
                colors={
                  isDark
                    ? [colors.primary, colors.primaryDark]
                    : [colors.primary, colors.secondary]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.welcomeBadge}
              >
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={16}
                  color={colors.textInverse}
                />
                <Text style={styles.welcomeBadgeText}>Smart Learning</Text>
              </LinearGradient>
            </View>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    {
                      rotate: logoRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                    { scale: logoScale },
                  ],
                },
              ]}
            >
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Stats Cards - Modern card design with shadows */}
        <View style={styles.statsSection}>
          <ModernCard style={styles.statsContainer} elevated>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary + "30", colors.primary + "10"]}
                style={styles.iconCircle}
              >
                <Ionicons
                  name="school-outline"
                  size={28}
                  color={colors.primary}
                />
              </LinearGradient>
              <Text style={styles.statNumber}>{stats.totalLevels}</Text>
              <Text style={styles.statLabel}>Levels</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.secondary + "30", colors.secondary + "10"]}
                style={styles.iconCircle}
              >
                <Ionicons
                  name="book-outline"
                  size={28}
                  color={colors.secondary}
                />
              </LinearGradient>
              <Text style={styles.statNumber}>{stats.totalCourses}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.accent + "30", colors.accent + "10"]}
                style={styles.iconCircle}
              >
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color={colors.accent}
                />
              </LinearGradient>
              <Text style={styles.statNumber}>{stats.totalNotes}</Text>
              <Text style={styles.statLabel}>Notes</Text>
            </View>
          </ModernCard>
        </View>

        {/* Quick Actions - Modern grid with subtle hover effects */}
        <ModernCard style={styles.section} elevated>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <MaterialCommunityIcons
              name="gesture-tap"
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Levels")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.primary + "25", colors.primary + "10"]}
                style={styles.actionIconContainer}
              >
                <Ionicons
                  name="layers-outline"
                  size={24}
                  color={colors.primary}
                />
              </LinearGradient>
              <Text style={styles.actionText}>Browse by Level</Text>
              <View style={styles.actionArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Courses")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.secondary + "25", colors.secondary + "10"]}
                style={styles.actionIconContainer}
              >
                <Ionicons
                  name="library-outline"
                  size={24}
                  color={colors.secondary}
                />
              </LinearGradient>
              <Text style={styles.actionText}>Browse Courses</Text>
              <View style={styles.actionArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.secondary}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Notes")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.accent + "25", colors.accent + "10"]}
                style={styles.actionIconContainer}
              >
                <Ionicons
                  name="documents-outline"
                  size={24}
                  color={colors.accent}
                />
              </LinearGradient>
              <Text style={styles.actionText}>All Notes</Text>
              <View style={styles.actionArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.accent}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("FavoritesTab")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.error + "25", colors.error + "10"]}
                style={styles.actionIconContainer}
              >
                <Ionicons name="heart-outline" size={24} color={colors.error} />
              </LinearGradient>
              <Text style={styles.actionText}>My Favorites</Text>
              <View style={styles.actionArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.error}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Recent Notes - Modern list with subtle animations */}
        {getRecentNotes().length > 0 && (
          <ModernCard style={styles.section} elevated>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Notes</Text>
              <MaterialCommunityIcons
                name="history"
                size={20}
                color={colors.primary}
              />
            </View>
            {getRecentNotes().map((note, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.recentNoteCard,
                  index === getRecentNotes().length - 1 && styles.lastNoteCard,
                ]}
                onPress={() => navigation.navigate("NoteViewer", { note })}
              >
                <LinearGradient
                  colors={[colors.accent + "25", colors.accent + "10"]}
                  style={styles.noteIconContainer}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={colors.accent}
                  />
                </LinearGradient>
                <View style={styles.noteTitleContainer}>
                  <Text style={styles.recentNoteTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <Text style={styles.noteSubtitle} numberOfLines={1}>
                    {note.course || "General Note"}
                  </Text>
                </View>
                <View style={styles.noteArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.accent}
                  />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("Notes")}
            >
              <LinearGradient
                colors={[colors.primary + "20", colors.primary + "05"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewAllGradient}
              >
                <Text style={styles.viewAllText}>View All Notes</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.primary}
                />
              </LinearGradient>
            </TouchableOpacity>
          </ModernCard>
        )}

        {/* Study Tips Section */}
        <ModernCard style={styles.section} elevated>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Study Tips</Text>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={[colors.primary + "30", colors.primary + "10"]}
              style={styles.tipIconContainer}
            >
              <MaterialCommunityIcons
                name="brain"
                size={24}
                color={colors.primary}
              />
            </LinearGradient>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Active Recall</Text>
              <Text style={styles.tipDescription}>
                Test yourself regularly instead of passive re-reading to improve
                retention.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={[colors.secondary + "30", colors.secondary + "10"]}
              style={styles.tipIconContainer}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={colors.secondary}
              />
            </LinearGradient>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Spaced Repetition</Text>
              <Text style={styles.tipDescription}>
                Review material at increasing intervals to optimize long-term
                memory.
              </Text>
            </View>
          </View>
        </ModernCard>
      </Animated.ScrollView>
    </>
  );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
  const { colors, shadows, spacing, borderRadius, typography, isDark } = theme;
  const windowWidth = Dimensions.get("window").width;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.screenBackground,
    },
    contentContainer: {
      paddingBottom: spacing.xl,
    },
    welcomeSection: {
      height: 200,
      position: "relative",
      marginBottom: spacing.lg,
    },
    welcomeBackground: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    welcomeFlexContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
    },
    welcomeTextContainer: {
      flex: 1,
      paddingLeft: spacing.md,
      justifyContent: "center",
    },
    logoContainer: {
      width: 120,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    logoImage: {
      width: "100%",
      height: "100%",
    },
    welcomeTitle: {
      ...typography.h2,
      color: colors.textInverse,
      marginBottom: spacing.xs,
      textAlign: "left",
      fontWeight: "bold",
      color: "white",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    welcomeSubtitle: {
      ...typography.body1,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "left",
      marginBottom: spacing.md,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    welcomeBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.round,
    },
    welcomeBadgeText: {
      ...typography.caption,
      color: colors.textInverse,
      fontWeight: "600",
      marginLeft: spacing.xs,
    },
    statsSection: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
    },
    statCard: {
      alignItems: "center",
      paddingHorizontal: spacing.md,
      flex: 1,
    },
    statDivider: {
      width: 1,
      height: "70%",
      backgroundColor: colors.divider,
      alignSelf: "center",
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.sm,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    statNumber: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.xs,
      fontWeight: "bold",
    },
    statLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: "600",
    },
    actionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    actionCard: {
      width: (windowWidth - (spacing.md * 2 + spacing.lg * 2 + spacing.md)) / 2,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      backgroundColor: isDark ? colors.card : "rgba(255, 255, 255, 0.9)",
      ...shadows.small,
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    actionText: {
      ...typography.body2,
      color: colors.text,
      fontWeight: "500",
      textAlign: "center",
    },
    actionArrow: {
      position: "absolute",
      bottom: spacing.xs,
      right: spacing.xs,
    },
    recentNoteCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    lastNoteCard: {
      borderBottomWidth: 0,
      marginBottom: 0,
    },
    noteIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    noteTitleContainer: {
      flex: 1,
      marginLeft: spacing.xs,
    },
    recentNoteTitle: {
      ...typography.body2,
      color: colors.text,
      fontWeight: "500",
    },
    noteSubtitle: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: 2,
    },
    noteArrow: {
      padding: spacing.xs,
    },
    viewAllButton: {
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    viewAllGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
    },
    viewAllText: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: "500",
      marginRight: spacing.xs,
    },
    tipCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tipIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    tipContent: {
      flex: 1,
    },
    tipTitle: {
      ...typography.body1,
      color: colors.text,
      fontWeight: "600",
      marginBottom: spacing.xs,
    },
    tipDescription: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    fabContainer: {
      position: "absolute",
      bottom: spacing.lg,
      right: spacing.lg,
      ...shadows.medium,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default HomeScreen;
