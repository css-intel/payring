// PayRing Mobile - Root Layout
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeStore, useUserStore } from '../src/store';
import { Colors } from '../src/constants/theme';

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { user, isLoading } = useUserStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  // Handle auth redirect
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to auth if not logged in
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // Redirect to home if logged in but on auth screen
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen 
          name="payments/confirm" 
          options={{ 
            title: 'Confirm Payment',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="agreements/[id]" 
          options={{ 
            title: 'Agreement Details',
          }} 
        />
        <Stack.Screen 
          name="agreements/new" 
          options={{ 
            title: 'New Agreement',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="settings/profile" 
          options={{ 
            title: 'Profile Settings',
          }} 
        />
        <Stack.Screen 
          name="settings/security" 
          options={{ 
            title: 'Security & Privacy',
          }} 
        />
        <Stack.Screen 
          name="settings/appearance" 
          options={{ 
            title: 'Appearance',
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}
