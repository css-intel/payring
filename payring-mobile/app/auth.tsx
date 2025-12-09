// PayRing Mobile - Auth Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore, useUserStore } from '../../src/store';

export default function AuthScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { setUser } = useUserStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate auth - in real app, this would call Firebase
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        displayName: mode === 'signup' ? name : email.split('@')[0],
      });
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>💜</Text>
            </View>
            <Text style={[styles.appName, { color: colors.text }]}>PayRing</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Payments. Agreements. Trust.
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              {mode === 'login'
                ? 'Sign in to continue'
                : 'Sign up to get started'}
            </Text>

            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary },
                loading && styles.submitBtnDisabled,
              ]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="logo-google" size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="logo-apple" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Toggle Mode */}
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={[styles.toggleLink, { color: colors.primary }]}>
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.md,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSize.md,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  submitBtn: {
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: 'white',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.sm,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  toggleText: {
    fontSize: FontSize.md,
  },
  toggleLink: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
