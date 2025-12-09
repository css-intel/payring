// PayRing Mobile - Dashboard Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useAuthStore, useThemeStore } from '../../src/store';

export default function DashboardScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  // Mock data
  const mockUser = user || {
    displayName: 'Alex Chen',
    username: '@alexc',
    balance: { formatted: '$1,256.70' },
  };

  const quickActions = [
    { icon: 'send', label: 'Send', color: colors.primary, route: '/payments' },
    { icon: 'download', label: 'Request', color: colors.success, route: '/payments' },
    { icon: 'add-circle', label: 'Agreement', color: '#8B5CF6', route: '/agreements/new' },
    { icon: 'folder', label: 'Templates', color: colors.accent, route: '/agreements' },
  ];

  const recentActivity = [
    { id: '1', title: 'Payment from Sarah', amount: '+$250.00', time: '2h ago', isPositive: true },
    { id: '2', title: 'Milestone completed', amount: '+$500.00', time: '5h ago', isPositive: true },
    { id: '3', title: 'Payment to Mike', amount: '-$75.00', time: '1d ago', isPositive: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.avatarText}>
                  {mockUser.displayName.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{mockUser.displayName}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => router.push('/activity')}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{mockUser.balance.formatted}</Text>
            <View style={styles.balanceGrowth}>
              <Ionicons name="trending-up" size={16} color="#10B981" />
              <Text style={styles.growthText}>+12.5% this month</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionButton}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            FEATURES
          </Text>
          <View style={styles.featuresGrid}>
            {[
              { icon: 'flash', title: 'Instant Payments', desc: 'Release money as work gets done' },
              { icon: 'document-text', title: 'Smart Agreements', desc: 'AI-powered contract generation' },
              { icon: 'notifications', title: 'Track & Notify', desc: 'Real-time milestone updates' },
              { icon: 'folder-open', title: 'Templates', desc: 'Freelance, loans, sales & more' },
            ].map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name={feature.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  {feature.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              RECENT ACTIVITY
            </Text>
            <TouchableOpacity onPress={() => router.push('/activity')}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recentActivity.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  index < recentActivity.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                ]}
              >
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: item.isPositive ? '#D1FAE5' : '#FEE2E2' },
                ]}>
                  <Ionicons
                    name={item.isPositive ? 'arrow-down' : 'arrow-up'}
                    size={16}
                    color={item.isPositive ? '#059669' : '#DC2626'}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.activityTime, { color: colors.textMuted }]}>
                    {item.time}
                  </Text>
                </View>
                <Text style={[
                  styles.activityAmount,
                  { color: item.isPositive ? '#059669' : '#DC2626' },
                ]}>
                  {item.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            Simple, secure payments — milestone by milestone.
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
  },
  userName: {
    color: 'white',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  notificationBtn: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.md,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
    marginBottom: 4,
  },
  balanceAmount: {
    color: 'white',
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  balanceGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    color: '#10B981',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  featureCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: FontSize.xs,
  },
  activityCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  activityTime: {
    fontSize: FontSize.xs,
  },
  activityAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  taglineContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  tagline: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
