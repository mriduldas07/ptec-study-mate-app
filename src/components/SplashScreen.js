import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animations
        const fadeIn = Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        });

        const scaleIn = Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        });

        const progressIn = Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
        });

        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        );

        // Start all animations
        Animated.parallel([fadeIn, scaleIn]).start();
        progressIn.start();
        spin.start();

        // Auto finish after 3 seconds
        const timer = setTimeout(() => {
            if (onFinish) {
                onFinish();
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
            spin.stop();
        };
    }, [fadeAnim, scaleAnim, spinValue, progressAnim, onFinish]);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Animated.View style={[styles.logoContainer, { transform: [{ rotate }] }]}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Text style={styles.title}>PTEC NoteBot</Text>
                <Text style={styles.subtitle}>Your Educational Companion</Text>

                <View style={styles.loadingContainer}>
                    <View style={styles.loadingBar}>
                        <Animated.View
                            style={[
                                styles.loadingProgress,
                                {
                                    transform: [{
                                        scaleX: progressAnim,
                                    }],
                                },
                            ]}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 40,
        textAlign: 'center',
    },
    loadingContainer: {
        width: width * 0.6,
        alignItems: 'center',
    },
    loadingBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingProgress: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 2,
    },
});

export default SplashScreen;