// PayRing Mobile - Security & Privacy Screen
import React, { useState } from 'react';
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
import { useRouter, Stack } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore } from '../../src/store';

export default function SecurityScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const securityLevel = smsAlerts && emailAlerts && loginAlerts ? 'good' : 'moderate';

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Security & Privacy',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Security Level Card */}
          <View style={[
            styles.securityCard,
            { backgroundColor: securityLevel === 'good' ? '#10B981' : '#F59E0B' }
          ]}>
            <View style={styles.securityContent}>
              <View style={styles.securityIcon}>
                <Ionicons name="shield-checkmark" size={28} color="white" />
              </View>
              <View style={styles.securityText}>
                <View style={styles.securityTitleRow}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <Text style={styles.securityTitle}>
                    {securityLevel === 'good' ? 'Good Security Level' : 'Moderate Security'}
                  </Text>
                </View>
                <Text style={styles.securityDesc}>
                  {securityLevel === 'good' 
                    ? 'Your account is well protected' 
                    : 'Enable more security features'}
                </Text>
              </View>
            </View>
          </View>

          {/* Authentication Section */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Authentication
            </Text>

            {/* Change PIN */}
            <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="lock-closed" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Change PIN</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Update your 6-digit PIN
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Biometric Auth */}
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: '#3B82F620' }]}>
                <Ionicons name="finger-print" size={20} color="#3B82F6" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Biometric Authentication</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Face ID / Touch ID
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>

            {/* Two-Factor Auth */}
            <View style={styles.rowLast}>
              <View style={[styles.iconContainer, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="key" size={20} color="#10B981" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Two-Factor Authentication</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Add extra security
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Security Alerts Section */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Security Alerts
            </Text>

            {/* SMS Alerts */}
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: '#14B8A620' }]}>
                <Ionicons name="chatbubble" size={20} color="#14B8A6" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>SMS Alerts</Text>
              </View>
              <Switch
                value={smsAlerts}
                onValueChange={setSmsAlerts}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>

            {/* Email Alerts */}
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: '#6366F120' }]}>
                <Ionicons name="mail" size={20} color="#6366F1" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Email Alerts</Text>
              </View>
              <Switch
                value={emailAlerts}
                onValueChange={setEmailAlerts}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>

            {/* Login Alerts */}
            <View style={styles.rowLast}>
              <View style={[styles.iconContainer, { backgroundColor: '#F9731620' }]}>
                <Ionicons name="notifications" size={20} color="#F97316" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Login Alerts</Text>
              </View>
              <Switch
                value={loginAlerts}
                onValueChange={setLoginAlerts}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Privacy Section */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Privacy
            </Text>

            {/* Download Data */}
            <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name="download" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Download My Data</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Export your account data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity style={styles.rowLast} onPress={handleDeleteAccount}>
              <View style={[styles.iconContainer, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Permanently delete your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
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
  securityCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  securityIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityText: {
    flex: 1,
  },
  securityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: 'white',
  },
  securityDesc: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  rowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rowTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  rowSubtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
});
