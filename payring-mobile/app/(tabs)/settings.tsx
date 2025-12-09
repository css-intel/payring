// PayRing Mobile - Settings Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore, useUserStore, useNotificationStore } from '../../src/store';

export default function SettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();
  const { user, clearUser } = useUserStore();
  const { clearNotifications } = useNotificationStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [biometricAuth, setBiometricAuth] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            clearUser();
            clearNotifications();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Theme',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'System', onPress: () => setTheme('system') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person',
          label: 'Profile',
          value: user?.displayName || 'Set up profile',
          onPress: () => router.push('/settings/profile'),
        },
        {
          icon: 'wallet',
          label: 'Payment Methods',
          value: '2 cards',
          onPress: () => {},
        },
        {
          icon: 'shield-checkmark',
          label: 'Security',
          onPress: () => router.push('/settings/security'),
        },
        {
          icon: 'key',
          label: 'Biometric Login',
          isSwitch: true,
          value: biometricAuth,
          onToggle: setBiometricAuth,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          label: 'Push Notifications',
          isSwitch: true,
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: 'mail',
          label: 'Email Notifications',
          isSwitch: true,
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          icon: 'color-palette',
          label: 'Appearance',
          value: theme.charAt(0).toUpperCase() + theme.slice(1),
          onPress: () => router.push('/settings/appearance'),
        },
        {
          icon: 'globe',
          label: 'Language',
          value: 'English',
          onPress: () => {},
        },
        {
          icon: 'cash',
          label: 'Currency',
          value: 'USD',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help Center',
          onPress: () => {},
        },
        {
          icon: 'chatbubble',
          label: 'Contact Support',
          onPress: () => {},
        },
        {
          icon: 'document-text',
          label: 'Terms of Service',
          onPress: () => {},
        },
        {
          icon: 'lock-closed',
          label: 'Privacy Policy',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle',
          label: 'App Version',
          value: '1.0.0',
        },
        {
          icon: 'star',
          label: 'Rate PayRing',
          onPress: () => {},
        },
        {
          icon: 'share',
          label: 'Share PayRing',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingsItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                  disabled={item.isSwitch}
                >
                  <View style={[styles.settingsIcon, { backgroundColor: colors.surface }]}>
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  {item.isSwitch ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="white"
                    />
                  ) : item.value ? (
                    <View style={styles.settingsValueRow}>
                      <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>
                        {item.value}
                      </Text>
                      {item.onPress && (
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                      )}
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.signOutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Made with 💜 by PayRing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: FontSize.sm,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsLabel: {
    flex: 1,
    fontSize: FontSize.md,
  },
  settingsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingsValue: {
    fontSize: FontSize.sm,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  footerText: {
    fontSize: FontSize.sm,
  },
});
