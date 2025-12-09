// PayRing Mobile - Profile Settings Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore, useUserStore } from '../../src/store';

export default function ProfileScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [profile] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    username: '@alexc.design',
    email: 'alex.chen@designstudio.com',
    emailVerified: true,
    phone: '+1 (555) 123-4567',
    phoneVerified: true,
    accountVerified: true,
  });

  const profileFields = [
    { label: 'First Name', value: profile.firstName },
    { label: 'Last Name', value: profile.lastName },
    { label: 'Username', value: profile.username },
    { label: 'Email Address', value: profile.email, verified: profile.emailVerified },
    { label: 'Phone Number', value: profile.phone, verified: profile.phoneVerified },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile Settings',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Photo Section */}
          <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.photoRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </Text>
              </View>
              <View style={styles.photoInfo}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {profile.firstName} {profile.lastName}
                </Text>
                <Text style={[styles.username, { color: colors.textSecondary }]}>
                  {profile.username}
                </Text>
                {profile.accountVerified && (
                  <View style={styles.verifiedRow}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={[styles.verifiedText, { color: colors.success }]}>
                      Verified Account
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Personal Information
            </Text>

            {profileFields.map((field, index) => (
              <TouchableOpacity
                key={field.label}
                style={[
                  styles.fieldRow,
                  index < profileFields.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.fieldContent}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                    {field.label}
                  </Text>
                  <View style={styles.fieldValueRow}>
                    <Text style={[styles.fieldValue, { color: colors.text }]}>{field.value}</Text>
                    {field.verified && (
                      <View style={[styles.verifiedBadge, { backgroundColor: `${colors.success}20` }]}>
                        <Text style={[styles.verifiedBadgeText, { color: colors.success }]}>
                          Verified
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="create-outline" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Verification Card */}
          <View style={styles.verificationCard}>
            <View style={styles.verificationContent}>
              <View style={styles.verificationIcon}>
                <Ionicons name="shield-checkmark" size={28} color="white" />
              </View>
              <View style={styles.verificationText}>
                <Text style={styles.verificationTitle}>Account Verified</Text>
                <Text style={styles.verificationDesc}>Your identity has been confirmed</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoSection: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  photoInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  username: {
    fontSize: FontSize.md,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  cameraBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    marginBottom: 2,
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fieldValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  verifiedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  verifiedBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  verificationCard: {
    margin: Spacing.md,
    marginTop: 0,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: '#10B981',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  verificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: 'white',
  },
  verificationDesc: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
