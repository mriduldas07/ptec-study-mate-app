import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ModernCard = ({ 
  children, 
  style, 
  elevated = false, 
  glass = false, 
  gradient = false,
  ...props 
}) => {
  const { colors, isDark } = useTheme();

  const getCardStyle = () => {
    if (glass) {
      return {
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.border,
        backdropFilter: 'blur(20px)',
      };
    }
    
    if (elevated) {
      return {
        backgroundColor: colors.elevated,
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 8,
      };
    }

    return {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    };
  };

  return (
    <View 
      style={[
        styles.card,
        getCardStyle(),
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default ModernCard;