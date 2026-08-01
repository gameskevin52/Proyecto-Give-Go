export const Colors = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryLighter: '#81C784',
  primaryBackground: '#E8F5E9',
  
  secondary: '#FF6F00',
  secondaryLight: '#FFA726',
  
  success: '#2E7D32',
  warning: '#FF6F00',
  error: '#D32F2F',
  
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray: '#757575',
  grayLight: '#BDBDBD',
  grayBackground: '#F5F5F5',
  
  text: '#1A1A1A',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 28, fontWeight: 'bold' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  h4: { fontSize: 20, fontWeight: '600' as const },
  h5: { fontSize: 18, fontWeight: '500' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  small: { fontSize: 14, fontWeight: '400' as const },
  tiny: { fontSize: 12, fontWeight: '400' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 24,
  round: 999,
};

export const AppTheme = {
  colors: Colors,
  fonts: Fonts,
  spacing: Spacing,
  borderRadius: BorderRadius,
};