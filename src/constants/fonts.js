import { Platform } from 'react-native';

// Safe font configurations that work across all platforms
export const FONT_WEIGHTS = {
  normal: Platform.select({
    ios: '400',
    android: 'normal',
    default: 'normal',
  }),
  medium: Platform.select({
    ios: '500',
    android: '500',
    default: '500',
  }),
  semibold: Platform.select({
    ios: '600',
    android: '600',
    default: '600',
  }),
  bold: Platform.select({
    ios: '700',
    android: 'bold',
    default: 'bold',
  }),
};

export const FONT_FAMILIES = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// Safe text styles that prevent font loading errors
export const TEXT_STYLES = {
  h1: {
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.bold,
    fontFamily: FONT_FAMILIES.bold,
  },
  h2: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    fontFamily: FONT_FAMILIES.bold,
  },
  h3: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.semibold,
    fontFamily: FONT_FAMILIES.medium,
  },
  body: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: FONT_FAMILIES.regular,
  },
  caption: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: FONT_FAMILIES.regular,
  },
  button: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
  },
};