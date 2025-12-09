// PayRing Mobile - Agreements Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore } from '../../src/store';

const AGREEMENT_TYPES = {
  freelance: { icon: '💼', color: '#3B82F6' },
  creative: { icon: '🎨', color: '#F97316' },
  loan: { icon: '🏦', color: '#10B981' },
};

export default function AgreementsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Drafts' },
  ];

  const agreements = [
    {
      id: '1',
      title: 'Website Redesign',
      type: 'freelance',
      counterparty: 'Tech Startup Inc',
      status: 'active',
      progress: 66,
      milestones: '2/3',
      totalValue: '$3,000',
      updatedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'Logo Design Package',
      type: 'creative',
      counterparty: 'Coffee Shop Co',
      status: 'active',
      progress: 33,
      milestones: '1/3',
      totalValue: '$450',
      updatedAt: '1 week ago',
    },
    {
      id: '3',
      title: 'Personal Loan',
      type: 'loan',
      counterparty: 'John Smith',
      status: 'active',
      progress: 50,
      milestones: '3/6',
      totalValue: '$1,200',
      updatedAt: '3 days ago',
    },
  ];

  const stats = {
    active: 3,
    completed: 8,
    totalEarned: '$12,150',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#DBEAFE', text: '#2563EB', label: 'Active' };
      case 'completed':
        return { bg: '#D1FAE5', text: '#059669', label: 'Completed' };
      case 'draft':
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Draft' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', label: status };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Agreements</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Manage your contracts
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.newBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/agreements/new')}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.newBtnText}>New</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.active}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>{stats.completed}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalEarned}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earned</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchText, { color: colors.text }]}
              placeholder="Search agreements..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
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

        {/* Agreements List */}
        <View style={styles.listContainer}>
          {agreements.map((agreement) => {
            const typeConfig = AGREEMENT_TYPES[agreement.type as keyof typeof AGREEMENT_TYPES];
            const statusConfig = getStatusBadge(agreement.status);

            return (
              <TouchableOpacity
                key={agreement.id}
                style={[styles.agreementCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/agreements/${agreement.id}`)}
              >
                <View style={styles.agreementHeader}>
                  <View
                    style={[styles.typeIcon, { backgroundColor: `${typeConfig.color}20` }]}
                  >
                    <Text style={styles.typeEmoji}>{typeConfig.icon}</Text>
                  </View>
                  <View style={styles.agreementInfo}>
                    <View style={styles.agreementTitleRow}>
                      <Text style={[styles.agreementTitle, { color: colors.text }]} numberOfLines={1}>
                        {agreement.title}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                        <Text style={[styles.statusText, { color: statusConfig.text }]}>
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.counterparty, { color: colors.textSecondary }]}>
                      {agreement.counterparty}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBg, { backgroundColor: colors.surface }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${agreement.progress}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {agreement.milestones}
                  </Text>
                </View>

                <View style={styles.agreementFooter}>
                  <Text style={[styles.totalValue, { color: colors.text }]}>
                    {agreement.totalValue}
                  </Text>
                  <Text style={[styles.updatedAt, { color: colors.textMuted }]}>
                    {agreement.updatedAt}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  newBtnText: {
    color: 'white',
    fontWeight: FontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    fontSize: FontSize.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: FontSize.md,
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
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  agreementCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  agreementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 24,
  },
  agreementInfo: {
    flex: 1,
  },
  agreementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  agreementTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  counterparty: {
    fontSize: FontSize.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  agreementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  updatedAt: {
    fontSize: FontSize.xs,
  },
});
