import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(theme => createStyles(theme));
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ rotate }] }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

// Create styles using the themed styles hook for better dark/light mode support
const createStyles = (theme) => {
  const { colors, spacing, typography } = theme;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.screenBackground,
    },
    logoContainer: {
      width: 90,
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface + '30',
      borderRadius: 45,
      padding: spacing.md,
    },
    logo: {
      width: 60,
      height: 60,
    },
    message: {
      marginTop: spacing.lg,
      ...typography.h4,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default LoadingSpinner;