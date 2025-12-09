// PayRing Mobile - Theme & Colors
export const Colors = {
  light: {
    primary: '#2364D2',
    primaryLight: '#4A8AE5',
    primaryDark: '#1A4A9E',
    secondary: '#10B981',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    
    border: '#E2E8F0',
    divider: '#F1F5F9',
    
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#2364D2',
  },
  dark: {
    primary: '#4A8AE5',
    primaryLight: '#6BA3F5',
    primaryDark: '#2364D2',
    secondary: '#34D399',
    accent: '#FBBF24',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    
    border: '#334155',
    divider: '#1E293B',
    
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#4A8AE5',
  },
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
