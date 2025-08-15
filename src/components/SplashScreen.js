import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const { colors } = useTheme();
    const styles = useThemedStyles(theme => createStyles(theme));
    
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const logoRotateAnim = useRef(new Animated.Value(0)).current;
    const textSlideAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Create smooth, fast animations sequence
        const logoAnimation = Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotateAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textSlideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]);

        // Progress bar animation
        const progressAnimation = Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: false,
        });

        // Pulse animation for logo
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Shimmer effect
        const shimmerAnimation = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Start animations
        logoAnimation.start();
        progressAnimation.start();
        
        // Start pulse after initial animation
        setTimeout(() => {
            pulseAnimation.start();
            shimmerAnimation.start();
        }, 1000);

        // Auto finish after 2.5 seconds (faster loading)
        const timer = setTimeout(() => {
            if (onFinish) {
                onFinish();
            }
        }, 2500);

        return () => {
            clearTimeout(timer);
            pulseAnimation.stop();
            shimmerAnimation.stop();
        };
    }, []);

    const logoRotate = logoRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Use theme colors for gradients
    const gradientColors = colors.isDark 
        ? [colors.screenBackground, colors.elevated, colors.surface]
        : [colors.primary, colors.secondary, colors.accent];

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Background Pattern */}
            <View style={styles.backgroundPattern}>
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.patternDot,
                            {
                                opacity: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.1],
                                }),
                                transform: [
                                    {
                                        scale: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo Container with Glow Effect */}
                <View style={styles.logoWrapper}>
                    <Animated.View
                        style={[
                            styles.logoGlow,
                            {
                                transform: [
                                    { scale: pulseAnim },
                                    { rotate: logoRotate },
                                ],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                transform: [
                                    { scale: pulseAnim },
                                    { rotate: logoRotate },
                                ],
                            },
                        ]}
                    >
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* Text Content */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            transform: [{ translateY: textSlideAnim }],
                        },
                    ]}
                >
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>PTEC Studymate</Text>
                        <Animated.View
                            style={[
                                styles.shimmer,
                                {
                                    transform: [{ translateX: shimmerTranslate }],
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.subtitle}>Your Educational Companion</Text>
                    <Text style={styles.tagline}>Learn • Organize • Excel</Text>
                </Animated.View>

                {/* Modern Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressWidth,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.loadingText}>Loading your notes...</Text>
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
    const { colors, spacing, typography, borderRadius, shadows } = theme;
    
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
        },
        backgroundPattern: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
        },
        patternDot: {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            margin: spacing.sm,
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
        },
        logoWrapper: {
            position: 'relative',
            marginBottom: spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoGlow: {
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            top: -20,
            left: -20,
            shadowColor: colors.isDark ? colors.textInverse : colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
        },
        logoContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.15)' : colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows.large,
        },
        logo: {
            width: 80,
            height: 80,
        },
        textContainer: {
            alignItems: 'center',
            marginBottom: spacing.xl,
        },
        titleWrapper: {
            position: 'relative',
            overflow: 'hidden',
            marginBottom: spacing.xs,
        },
        title: {
            ...typography.h1,
            color: colors.textInverse,
            textAlign: 'center',
            letterSpacing: 1,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        shimmer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            width: 30,
            transform: [{ skewX: '-20deg' }],
        },
        subtitle: {
            ...typography.h3,
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: spacing.xs,
            textAlign: 'center',
        },
        tagline: {
            ...typography.caption,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            letterSpacing: 2,
            textTransform: 'uppercase',
        },
        progressContainer: {
            width: width * 0.7,
            alignItems: 'center',
        },
        progressTrack: {
            width: '100%',
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: borderRadius.xs,
            overflow: 'hidden',
            marginBottom: spacing.md,
            ...shadows.small,
        },
        progressBar: {
            height: '100%',
            backgroundColor: colors.textInverse,
            borderRadius: borderRadius.xs,
            shadowColor: colors.textInverse,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
            elevation: 4,
        },
        loadingText: {
            ...typography.body2,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
        },
    });
};

export default SplashScreen;