// PayRing Mobile - Settings Layout
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '../../src/store';
import { Colors } from '../../src/constants/theme';

export default function SettingsLayout() {
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    />
  );
}
