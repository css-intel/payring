// PayRing Mobile - Activity Screen
import React, { useState } from 'react';
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
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore, useNotificationStore } from '../../src/store';

export default function ActivityScreen() {
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [filter, setFilter] = useState<'all' | 'payments' | 'agreements' | 'alerts'>('all');

  const filters = [
    { value: 'all', label: 'All', icon: 'apps' as const },
    { value: 'payments', label: 'Payments', icon: 'card' as const },
    { value: 'agreements', label: 'Agreements', icon: 'document-text' as const },
    { value: 'alerts', label: 'Alerts', icon: 'notifications' as const },
  ];

  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'payment_received',
      title: 'Payment Received',
      description: 'Sarah M. sent you $150.00 for "Logo Design"',
      time: '2 hours ago',
      icon: 'arrow-down' as const,
      iconBg: '#D1FAE5',
      iconColor: '#059669',
      read: false,
    },
    {
      id: '2',
      type: 'milestone_complete',
      title: 'Milestone Completed',
      description: 'Website Redesign - Phase 2 marked complete',
      time: '5 hours ago',
      icon: 'checkmark-circle' as const,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      read: false,
    },
    {
      id: '3',
      type: 'agreement_signed',
      title: 'Agreement Signed',
      description: 'Coffee Shop Co signed "Logo Design Package"',
      time: 'Yesterday',
      icon: 'create' as const,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      read: true,
    },
    {
      id: '4',
      type: 'payment_sent',
      title: 'Payment Sent',
      description: 'You sent $50.00 to John D.',
      time: 'Yesterday',
      icon: 'arrow-up' as const,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      read: true,
    },
    {
      id: '5',
      type: 'milestone_due',
      title: 'Milestone Due Soon',
      description: 'Personal Loan - Payment 4 due in 3 days',
      time: '2 days ago',
      icon: 'time' as const,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      read: true,
    },
    {
      id: '6',
      type: 'payment_received',
      title: 'Payment Received',
      description: 'Tech Startup Inc sent you $1,000.00',
      time: '3 days ago',
      icon: 'arrow-down' as const,
      iconBg: '#D1FAE5',
      iconColor: '#059669',
      read: true,
    },
  ];

  const unreadCount = activities.filter(a => !a.read).length;

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'payments') {
      return activity.type.includes('payment');
    }
    if (filter === 'agreements') {
      return activity.type.includes('agreement') || activity.type.includes('milestone');
    }
    if (filter === 'alerts') {
      return activity.type.includes('due') || activity.type.includes('alert');
    }
    return true;
  });

  const groupedActivities: Record<string, typeof activities> = {};
  filteredActivities.forEach(activity => {
    const date = activity.time.includes('hours') || activity.time.includes('minutes')
      ? 'Today'
      : activity.time.includes('Yesterday')
      ? 'Yesterday'
      : 'Earlier';
    
    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    groupedActivities[date].push(activity);
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up!'}
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={[styles.markAllBtn, { borderColor: colors.border }]}
                onPress={markAllAsRead}
              >
                <Ionicons name="checkmark-done" size={16} color={colors.primary} />
                <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filtersRow}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: filter === f.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFilter(f.value as any)}
              >
                <Ionicons
                  name={f.icon}
                  size={16}
                  color={filter === f.value ? 'white' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterText,
                    { color: filter === f.value ? 'white' : colors.text },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Activity List */}
        <View style={styles.listContainer}>
          {Object.entries(groupedActivities).map(([date, items]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>{date}</Text>
              {items.map((activity, index) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityCard,
                    { 
                      backgroundColor: activity.read ? colors.card : `${colors.primary}08`,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}>
                    <Ionicons name={activity.icon} size={20} color={activity.iconColor} />
                  </View>
                  <View style={styles.activityContent}>
                    <View style={styles.activityTitleRow}>
                      <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
                        {activity.title}
                      </Text>
                      {!activity.read && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <Text style={[styles.activityDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                      {activity.description}
                    </Text>
                    <Text style={[styles.activityTime, { color: colors.textMuted }]}>
                      {activity.time}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {filteredActivities.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="notifications-off" size={32} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No activity yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Your recent activity will appear here
            </Text>
          </View>
        )}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  filtersScroll: {
    marginBottom: Spacing.md,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityDesc: {
    fontSize: FontSize.sm,
    marginBottom: 4,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: FontSize.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  emptyDesc: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});
