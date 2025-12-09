// PayRing Mobile - Appearance Settings Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore } from '../../src/store';

const THEMES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic PayRing blue and green theme',
    icon: 'sunny',
    iconColor: '#F59E0B',
    previewBg: '#FFFFFF',
    previewCard: '#F3F4F6',
    previewAccent: '#7C3AED',
    previewText: '#1F2937',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark with teal accents',
    icon: 'moon',
    iconColor: '#64748B',
    previewBg: '#0F172A',
    previewCard: '#1E293B',
    previewAccent: '#14B8A6',
    previewText: '#F8FAFC',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Vibrant gradients and bold colors',
    icon: 'sparkles',
    iconColor: '#EC4899',
    previewBg: '#1E1B4B',
    previewCard: 'rgba(255,255,255,0.1)',
    previewAccent: '#EC4899',
    previewText: '#F8FAFC',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean monochrome design',
    icon: 'ellipse-outline',
    iconColor: '#6B7280',
    previewBg: '#FAFAFA',
    previewCard: '#FFFFFF',
    previewAccent: '#374151',
    previewText: '#111827',
  },
];

export default function AppearanceScreen() {
  const systemColorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [selectedTheme, setSelectedTheme] = useState('default');
  const [autoTheme, setAutoTheme] = useState(theme === 'system');

  const currentTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleAutoThemeToggle = (enabled: boolean) => {
    setAutoTheme(enabled);
    if (enabled) {
      setTheme('system');
    } else {
      setTheme(selectedTheme === 'dark' ? 'dark' : 'light');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Appearance',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Theme */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Current Theme
            </Text>
            <View style={styles.currentThemeRow}>
              <View style={[styles.themeIcon, { backgroundColor: currentTheme.previewAccent }]}>
                <Ionicons name="color-palette" size={24} color="white" />
              </View>
              <View style={styles.currentThemeInfo}>
                <Text style={[styles.currentThemeName, { color: colors.text }]}>
                  {currentTheme.name}
                </Text>
                <Text style={[styles.currentThemeDesc, { color: colors.textSecondary }]}>
                  {currentTheme.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Theme Selection */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Choose Theme
            </Text>
            <View style={styles.themesGrid}>
              {THEMES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeCard,
                    {
                      borderColor: selectedTheme === t.id ? colors.primary : colors.border,
                      borderWidth: selectedTheme === t.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSelect(t.id)}
                >
                  {selectedTheme === t.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                  <View style={styles.themeCardHeader}>
                    <Ionicons name={t.icon as any} size={20} color={t.iconColor} />
                    <Text style={[styles.themeCardName, { color: colors.text }]}>{t.name}</Text>
                  </View>
                  <Text style={[styles.themeCardDesc, { color: colors.textMuted }]} numberOfLines={2}>
                    {t.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Preview
            </Text>
            <View style={[styles.previewContainer, { backgroundColor: currentTheme.previewBg }]}>
              <View style={[styles.previewCard, { backgroundColor: currentTheme.previewCard }]}>
                <View style={styles.previewHeader}>
                  <Text style={[styles.previewLabel, { color: currentTheme.previewText, opacity: 0.7 }]}>
                    Balance
                  </Text>
                  <TouchableOpacity style={[styles.previewBtn, { backgroundColor: currentTheme.previewAccent }]}>
                    <Text style={styles.previewBtnText}>SEND</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.previewAmount, { color: currentTheme.previewText }]}>
                  $25,430.50
                </Text>
              </View>
            </View>
          </View>

          {/* Display Options */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Display Options
            </Text>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Auto Theme</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                  Match system settings
                </Text>
              </View>
              <Switch
                value={autoTheme}
                onValueChange={handleAutoThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
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
  section: {
    margin: Spacing.md,
    marginBottom: 0,
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
  currentThemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: 0,
    gap: Spacing.md,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentThemeInfo: {
    flex: 1,
  },
  currentThemeName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  currentThemeDesc: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    paddingTop: 0,
    gap: Spacing.md,
  },
  themeCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  themeCardName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  themeCardDesc: {
    fontSize: FontSize.xs,
  },
  previewContainer: {
    margin: Spacing.md,
    marginTop: 0,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  previewCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  previewLabel: {
    fontSize: FontSize.sm,
  },
  previewBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  previewBtnText: {
    color: 'white',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  previewAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: 0,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  optionDesc: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
});
