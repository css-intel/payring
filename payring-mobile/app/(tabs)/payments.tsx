// PayRing Mobile - Payments Screen
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

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function PaymentsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [activeTab, setActiveTab] = useState<'send' | 'request'>('send');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const recentContacts = [
    { id: '1', name: 'Sarah W.', initials: 'SW' },
    { id: '2', name: 'Mike J.', initials: 'MJ' },
    { id: '3', name: 'Emily R.', initials: 'ER' },
    { id: '4', name: 'David K.', initials: 'DK' },
  ];

  const handleSubmit = () => {
    router.push({
      pathname: '/payments/confirm',
      params: { type: activeTab, amount, recipient, note },
    });
  };

  const isValid = amount && parseFloat(amount) > 0 && recipient;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Instant Payments</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Send or request money instantly
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'send' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveTab('send')}
            >
              <Ionicons
                name="send"
                size={18}
                color={activeTab === 'send' ? 'white' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'send' ? 'white' : colors.textSecondary },
                ]}
              >
                Send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'request' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveTab('request')}
            >
              <Ionicons
                name="download"
                size={18}
                color={activeTab === 'request' ? 'white' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'request' ? 'white' : colors.textSecondary },
                ]}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: activeTab === 'send' ? `${colors.primary}10` : `${colors.success}10`,
                borderColor: activeTab === 'send' ? `${colors.primary}30` : `${colors.success}30`,
              },
            ]}
          >
            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: activeTab === 'send' ? `${colors.primary}20` : `${colors.success}20`,
                },
              ]}
            >
              <Ionicons
                name={activeTab === 'send' ? 'send' : 'download'}
                size={32}
                color={activeTab === 'send' ? colors.primary : colors.success}
              />
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              {activeTab === 'send' ? 'Send Money' : 'Request Money'}
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              {activeTab === 'send'
                ? 'Transfer money instantly to anyone'
                : 'Request payment from clients or friends'}
            </Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
            <TextInput
              style={[styles.amountText, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountBtn,
                  {
                    backgroundColor: amount === String(value) ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setAmount(String(value))}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    { color: amount === String(value) ? 'white' : colors.text },
                  ]}
                >
                  ${value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recipient Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            {activeTab === 'send' ? 'Send to' : 'Request from'}
          </Text>
          <View style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.inputText, { color: colors.text }]}
              placeholder="Email, phone, or @username"
              placeholderTextColor={colors.textMuted}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Recent Contacts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.contactsRow}>
              {recentContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    recipient === `@${contact.name.toLowerCase().replace(' ', '')}` && {
                      backgroundColor: `${colors.primary}10`,
                    },
                  ]}
                  onPress={() => setRecipient(`@${contact.name.toLowerCase().replace(' ', '')}`)}
                >
                  <View style={[styles.contactAvatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.contactInitials}>{contact.initials}</Text>
                  </View>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Note Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Note (optional)</Text>
          <View style={[styles.noteInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.inputText, { color: colors.text }]}
              placeholder="What's this for?"
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: isValid ? colors.primary : colors.surface },
            ]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text
              style={[
                styles.submitText,
                { color: isValid ? 'white' : colors.textMuted },
              ]}
            >
              {activeTab === 'send' ? 'Send Payment' : 'Request Payment'}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isValid ? 'white' : colors.textMuted}
            />
          </TouchableOpacity>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
  },
  tabContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  tabText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  heroContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  heroCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 64,
  },
  currencySymbol: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.sm,
  },
  amountText: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickAmountBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  quickAmountText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  inputText: {
    flex: 1,
    fontSize: FontSize.md,
  },
  noteInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 80,
    gap: Spacing.sm,
  },
  contactsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  contactItem: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    color: 'white',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  contactName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  submitContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 56,
    borderRadius: BorderRadius.lg,
  },
  submitText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
});
