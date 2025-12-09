// PayRing Mobile - New Agreement Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useThemeStore } from '../../src/store';

const AGREEMENT_TEMPLATES = [
  { id: 'freelance', icon: '💼', label: 'Freelance Work', desc: 'Web, design, writing' },
  { id: 'creative', icon: '🎨', label: 'Creative Project', desc: 'Art, media, content' },
  { id: 'loan', icon: '🏦', label: 'Personal Loan', desc: 'Money lending' },
  { id: 'rent', icon: '🏠', label: 'Rent/Lease', desc: 'Property rentals' },
  { id: 'service', icon: '🔧', label: 'Service Agreement', desc: 'General services' },
  { id: 'custom', icon: '✏️', label: 'Custom', desc: 'Start from scratch' },
];

export default function NewAgreementScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const colors = Colors[colorScheme || 'light'];

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [milestones, setMilestones] = useState([
    { id: '1', title: '', amount: '', dueDate: '' },
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now().toString(), title: '', amount: '', dueDate: '' },
    ]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
    }
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleNext = () => {
    if (step === 1 && !selectedTemplate) {
      Alert.alert('Select Template', 'Please select an agreement type');
      return;
    }
    if (step === 2 && (!title || !counterparty)) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  const handleCreate = () => {
    Alert.alert(
      'Agreement Created!',
      'Your agreement has been created and sent for review.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Agreement Type</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Select a template to get started
      </Text>

      <View style={styles.templatesGrid}>
        {AGREEMENT_TEMPLATES.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              {
                backgroundColor: selectedTemplate === template.id ? `${colors.primary}10` : colors.card,
                borderColor: selectedTemplate === template.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedTemplate(template.id)}
          >
            <Text style={styles.templateIcon}>{template.icon}</Text>
            <Text style={[styles.templateLabel, { color: colors.text }]}>{template.label}</Text>
            <Text style={[styles.templateDesc, { color: colors.textMuted }]}>{template.desc}</Text>
            {selectedTemplate === template.id && (
              <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Assistant Card */}
      <TouchableOpacity style={[styles.aiCard, { backgroundColor: `${colors.primary}10`, borderColor: colors.primary }]}>
        <View style={styles.aiCardContent}>
          <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={20} color="white" />
          </View>
          <View style={styles.aiTextContent}>
            <Text style={[styles.aiTitle, { color: colors.text }]}>Use AI Assistant</Text>
            <Text style={[styles.aiDesc, { color: colors.textSecondary }]}>
              Describe your agreement and let AI draft it for you
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Basic Details</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Enter the agreement information
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Agreement Title *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g., Website Redesign Project"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Counterparty *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Name or email"
          placeholderTextColor={colors.textMuted}
          value={counterparty}
          onChangeText={setCounterparty}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Total Value</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="$0.00"
          placeholderTextColor={colors.textMuted}
          value={totalValue}
          onChangeText={setTotalValue}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Describe the scope of work..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Milestones</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Break your agreement into milestones
      </Text>

      {milestones.map((milestone, index) => (
        <View key={milestone.id} style={[styles.milestoneCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.milestoneHeader}>
            <Text style={[styles.milestoneNumber, { color: colors.primary }]}>
              Milestone {index + 1}
            </Text>
            {milestones.length > 1 && (
              <TouchableOpacity onPress={() => removeMilestone(milestone.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={[styles.milestoneInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Milestone title"
            placeholderTextColor={colors.textMuted}
            value={milestone.title}
            onChangeText={(v) => updateMilestone(milestone.id, 'title', v)}
          />

          <View style={styles.milestoneRow}>
            <TextInput
              style={[styles.milestoneInput, styles.halfInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount"
              placeholderTextColor={colors.textMuted}
              value={milestone.amount}
              onChangeText={(v) => updateMilestone(milestone.id, 'amount', v)}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.milestoneInput, styles.halfInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Due date"
              placeholderTextColor={colors.textMuted}
              value={milestone.dueDate}
              onChangeText={(v) => updateMilestone(milestone.id, 'dueDate', v)}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={[styles.addMilestoneBtn, { borderColor: colors.primary }]} onPress={addMilestone}>
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={[styles.addMilestoneText, { color: colors.primary }]}>Add Milestone</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Review & Send</Text>
      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
        Review your agreement before sending
      </Text>

      <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Type</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {AGREEMENT_TEMPLATES.find(t => t.id === selectedTemplate)?.label}
          </Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Title</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>{title || '-'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Counterparty</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>{counterparty || '-'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Total Value</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>{totalValue || '-'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Milestones</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>{milestones.length}</Text>
        </View>
      </View>

      <View style={[styles.noteCard, { backgroundColor: `${colors.warning}20`, borderColor: colors.warning }]}>
        <Ionicons name="information-circle" size={20} color={colors.warning} />
        <Text style={[styles.noteText, { color: colors.text }]}>
          Once sent, the counterparty will receive a notification to review and sign.
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Agreement',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressStep,
                  {
                    backgroundColor: s <= step ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            {step > 1 && (
              <TouchableOpacity
                style={[styles.backBtn, { borderColor: colors.border }]}
                onPress={() => setStep(step - 1)}
              >
                <Text style={[styles.backBtnText, { color: colors.text }]}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={styles.nextBtnText}>
                {step === 4 ? 'Create Agreement' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: Spacing.md,
  },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  templateCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    position: 'relative',
  },
  templateIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  templateLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  templateDesc: {
    fontSize: FontSize.xs,
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
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  aiDesc: {
    fontSize: FontSize.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSize.md,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    height: 100,
    fontSize: FontSize.md,
  },
  milestoneCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  milestoneNumber: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  milestoneInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  milestoneRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  addMilestoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addMilestoneText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  reviewCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  reviewLabel: {
    fontSize: FontSize.md,
  },
  reviewValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  backBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  nextBtn: {
    flex: 2,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: 'white',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
