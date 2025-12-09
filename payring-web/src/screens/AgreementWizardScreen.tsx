/**
 * Agreement Wizard Screen
 * Multi-step wizard for creating new agreements
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import {
  createAgreement,
  AgreementType,
  CreateAgreementData,
  MilestoneStatus,
} from '../services/agreements.service';
import { searchUsers, UserSearchResult } from '../services/contacts.service';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  PenSquare,
  UserPlus,
  DollarSign,
  ClipboardCheck,
  Search,
  X,
} from 'lucide-react';

// Step definitions
const STEPS = [
  { id: 1, name: 'Method', icon: Sparkles },
  { id: 2, name: 'Details', icon: FileText },
  { id: 3, name: 'Counterparty', icon: UserPlus },
  { id: 4, name: 'Milestones', icon: DollarSign },
  { id: 5, name: 'Review', icon: ClipboardCheck },
];

// Agreement type options
const AGREEMENT_TYPES: { value: AgreementType; label: string; description: string }[] = [
  { value: 'freelance', label: 'Freelance Work', description: 'For freelance projects and gig work' },
  { value: 'loan', label: 'Personal Loan', description: 'For lending money to friends or family' },
  { value: 'sale', label: 'Product Sale', description: 'For selling goods or products' },
  { value: 'subscription', label: 'Subscription', description: 'For recurring services or subscriptions' },
  { value: 'rental', label: 'Rental', description: 'For renting equipment, property, or items' },
  { value: 'custom', label: 'Custom Agreement', description: 'Create your own custom agreement' },
];

// Creation method options
type CreationMethod = 'ai' | 'template' | 'manual';

interface MilestoneForm {
  id: string;
  title: string;
  description: string;
  amountCents: number;
  dueDate: string;
  deliverables: string[];
}

export default function AgreementWizardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  // Current step
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Creation method
  const [creationMethod, setCreationMethod] = useState<CreationMethod>('manual');
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Step 2: Agreement details
  const [title, setTitle] = useState('');
  const [agreementType, setAgreementType] = useState<AgreementType>('freelance');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('Either party may cancel with 7 days written notice. Completed milestones will be paid in full.');

  // Step 3: Counterparty
  const [counterpartySearch, setCounterpartySearch] = useState('');
  const [counterpartyResults, setCounterpartyResults] = useState<UserSearchResult[]>([]);
  const [selectedCounterparty, setSelectedCounterparty] = useState<UserSearchResult | null>(null);
  const [counterpartyEmail, setCounterpartyEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Step 4: Milestones
  const [totalAmount, setTotalAmount] = useState('');
  const [currency] = useState('USD');
  const [milestones, setMilestones] = useState<MilestoneForm[]>([
    {
      id: '1',
      title: '',
      description: '',
      amountCents: 0,
      dueDate: '',
      deliverables: [''],
    },
  ]);

  // Check if we have pre-filled data from navigation
  useEffect(() => {
    const state = location.state as { input?: string; method?: string; templateId?: string } | null;
    if (state?.input) {
      setAiPrompt(state.input);
      setCreationMethod('ai');
      // Auto-generate from AI prompt
      handleAiGenerate(state.input);
    }
    if (state?.templateId) {
      setSelectedTemplateId(state.templateId);
      setCreationMethod('template');
      // Load template data
      loadTemplate(state.templateId);
    }
  }, [location.state]);

  // Search for counterparty
  useEffect(() => {
    const search = async () => {
      if (counterpartySearch.length < 2) {
        setCounterpartyResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsers(counterpartySearch);
        // Filter out current user
        setCounterpartyResults(results.filter((r) => r.id !== user?.id));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [counterpartySearch, user?.id]);

  // AI Generation (simulated for now - would connect to OpenAI/Claude)
  const handleAiGenerate = async (prompt: string) => {
    // Simulate AI generation
    const lowercasePrompt = prompt.toLowerCase();
    
    if (lowercasePrompt.includes('website') || lowercasePrompt.includes('web')) {
      setTitle('Website Development Project');
      setAgreementType('freelance');
      setDescription('Development of a custom website including design, development, and deployment.');
      setDeliverables(['Website design mockups', 'Responsive frontend development', 'Backend integration', 'Deployment and launch']);
      setPaymentTerms('50% upfront, 50% upon completion');
      setTotalAmount('5000');
      setMilestones([
        { id: '1', title: 'Design Phase', description: 'Create wireframes and design mockups', amountCents: 150000, dueDate: '', deliverables: ['Wireframes', 'Design mockups'] },
        { id: '2', title: 'Development', description: 'Build the website', amountCents: 250000, dueDate: '', deliverables: ['Functional website', 'Responsive design'] },
        { id: '3', title: 'Launch', description: 'Deploy and launch', amountCents: 100000, dueDate: '', deliverables: ['Live website', 'Documentation'] },
      ]);
    } else if (lowercasePrompt.includes('loan') || lowercasePrompt.includes('borrow') || lowercasePrompt.includes('lend')) {
      setTitle('Personal Loan Agreement');
      setAgreementType('loan');
      setDescription('Personal loan agreement with agreed repayment terms.');
      setPaymentTerms('Monthly repayments over agreed period');
      setTotalAmount('1000');
      setMilestones([
        { id: '1', title: 'Loan Disbursement', description: 'Initial loan amount', amountCents: 100000, dueDate: '', deliverables: ['Funds transferred'] },
      ]);
    } else {
      // Generic agreement
      setTitle('Service Agreement');
      setAgreementType('custom');
      setDescription(prompt);
      setPaymentTerms('Payment upon completion of milestones');
      setTotalAmount('1000');
    }
  };

  // Load template (simulated)
  const loadTemplate = async (templateId: string) => {
    // Would fetch from templates service
    console.log('Loading template:', templateId);
    // Pre-fill based on template
  };

  // Validate current step
  const validateStep = (): boolean => {
    setError(null);

    switch (currentStep) {
      case 1:
        return true; // Method selection is always valid

      case 2:
        if (!title.trim()) {
          setError('Please enter an agreement title');
          return false;
        }
        if (!description.trim()) {
          setError('Please enter a description');
          return false;
        }
        return true;

      case 3:
        if (!selectedCounterparty && !counterpartyEmail.trim()) {
          setError('Please select a counterparty or enter their email');
          return false;
        }
        if (counterpartyEmail && !counterpartyEmail.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;

      case 4:
        const amount = parseFloat(totalAmount);
        if (!amount || amount <= 0) {
          setError('Please enter a valid total amount');
          return false;
        }
        const validMilestones = milestones.filter((m) => m.title.trim());
        if (validMilestones.length === 0) {
          setError('Please add at least one milestone');
          return false;
        }
        return true;

      case 5:
        return true;

      default:
        return true;
    }
  };

  // Navigate between steps
  const goToStep = (step: number) => {
    if (step < currentStep || validateStep()) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Add/remove deliverables
  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const updateDeliverable = (index: number, value: string) => {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  };

  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index));
    }
  };

  // Add/remove milestones
  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        amountCents: 0,
        dueDate: '',
        deliverables: [''],
      },
    ]);
  };

  const updateMilestone = (id: string, field: keyof MilestoneForm, value: string | number | string[]) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id));
    }
  };

  // Auto-distribute amounts when total changes
  const distributeAmounts = () => {
    const total = parseFloat(totalAmount) * 100;
    if (!total || milestones.length === 0) return;

    const perMilestone = Math.floor(total / milestones.length);
    const remainder = total - perMilestone * milestones.length;

    setMilestones(
      milestones.map((m, i) => ({
        ...m,
        amountCents: perMilestone + (i === 0 ? remainder : 0),
      }))
    );
  };

  // Submit agreement
  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!user) {
      setError('You must be logged in to create an agreement');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const validMilestones = milestones
        .filter((m) => m.title.trim())
        .map((m, index) => ({
          title: m.title,
          description: m.description,
          order: index + 1,
          amountCents: m.amountCents,
          currency,
          status: 'pending' as MilestoneStatus,
          dueDate: m.dueDate ? new Date(m.dueDate) : undefined,
          deliverables: m.deliverables.filter((d) => d.trim()),
        }));

      const agreementData: CreateAgreementData = {
        title,
        type: agreementType,
        counterpartyEmail: selectedCounterparty?.email || counterpartyEmail,
        counterpartyUsername: selectedCounterparty?.username,
        terms: {
          description,
          deliverables: deliverables.filter((d) => d.trim()),
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          paymentTerms,
          cancellationPolicy,
          disputeResolution: 'Disputes will be handled through PayRing mediation.',
        },
        totalValueCents: parseFloat(totalAmount) * 100,
        currency,
        milestones: validMilestones,
      };

      const agreementId = await createAgreement(agreementData);
      navigate(`/agreements/${agreementId}`, { replace: true });
    } catch (err) {
      console.error('Create agreement error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create agreement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => goToStep(step.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  currentStep > step.id
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Step 1: Method Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How would you like to create your agreement?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Choose a method that works best for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Assist */}
        <button
          onClick={() => setCreationMethod('ai')}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            creationMethod === 'ai'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
          }`}
        >
          <Sparkles className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Assist</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Describe what you need and let AI create the agreement for you
          </p>
        </button>

        {/* Template */}
        <button
          onClick={() => setCreationMethod('template')}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            creationMethod === 'template'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
          }`}
        >
          <FileText className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Use Template</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Start with a pre-built template and customize it
          </p>
        </button>

        {/* Manual */}
        <button
          onClick={() => setCreationMethod('manual')}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            creationMethod === 'manual'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
          }`}
        >
          <PenSquare className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Create Manually</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Build your agreement from scratch step by step
          </p>
        </button>
      </div>

      {/* AI Prompt Input */}
      {creationMethod === 'ai' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your agreement
          </label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., I need a freelance agreement for building a website. The project is worth $5,000 and should be completed in 6 weeks with 3 milestones..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
          />
          <button
            onClick={() => handleAiGenerate(aiPrompt)}
            disabled={!aiPrompt.trim()}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate Agreement
          </button>
        </div>
      )}

      {/* Template Selection */}
      {creationMethod === 'template' && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: 'freelance', name: 'Freelance Project', emoji: '💻' },
            { id: 'loan', name: 'Personal Loan', emoji: '💰' },
            { id: 'sale', name: 'Product Sale', emoji: '🛒' },
            { id: 'rental', name: 'Rental Agreement', emoji: '🏠' },
            { id: 'consulting', name: 'Consulting', emoji: '📊' },
            { id: 'custom', name: 'Custom', emoji: '📝' },
          ].map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplateId(template.id);
                setAgreementType(template.id as AgreementType);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplateId === template.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{template.emoji}</span>
              <span className="font-medium text-gray-900 dark:text-white">{template.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Step 2: Agreement Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agreement Details</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Enter the basic information about your agreement</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Agreement Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Website Development Project"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Agreement Type
        </label>
        <select
          value={agreementType}
          onChange={(e) => setAgreementType(e.target.value as AgreementType)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {AGREEMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this agreement covers..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Deliverables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Deliverables
        </label>
        {deliverables.map((deliverable, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={deliverable}
              onChange={(e) => updateDeliverable(index, e.target.value)}
              placeholder={`Deliverable ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {deliverables.length > 1 && (
              <button
                onClick={() => removeDeliverable(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDeliverable}
          className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Deliverable
        </button>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Terms
        </label>
        <input
          type="text"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder="e.g., 50% upfront, 50% upon completion"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Cancellation Policy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cancellation Policy
        </label>
        <textarea
          value={cancellationPolicy}
          onChange={(e) => setCancellationPolicy(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={2}
        />
      </div>
    </div>
  );

  // Step 3: Counterparty
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Counterparty</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Who is this agreement with?</p>
      </div>

      {/* Selected Counterparty */}
      {selectedCounterparty && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {selectedCounterparty.displayName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedCounterparty.displayName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{selectedCounterparty.username} • {selectedCounterparty.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCounterparty(null)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {!selectedCounterparty && (
        <>
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search PayRing Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={counterpartySearch}
                onChange={(e) => setCounterpartySearch(e.target.value)}
                placeholder="Search by name, username, or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Search Results */}
            {counterpartyResults.length > 0 && (
              <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {counterpartyResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      setSelectedCounterparty(result);
                      setCounterpartySearch('');
                      setCounterpartyResults([]);
                    }}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                  >
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {result.displayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.displayName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{result.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Email Invite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invite by Email
            </label>
            <input
              type="email"
              value={counterpartyEmail}
              onChange={(e) => setCounterpartyEmail(e.target.value)}
              placeholder="Enter email address..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              They'll receive an invitation to join PayRing and sign the agreement.
            </p>
          </div>
        </>
      )}
    </div>
  );

  // Step 4: Milestones
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment & Milestones</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Set up the payment schedule</p>
      </div>

      {/* Total Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Total Agreement Value *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={distributeAmounts}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Distribute evenly across milestones
        </button>
      </div>

      {/* Milestones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Milestones
        </label>

        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Milestone {index + 1}
              </h4>
              {milestones.length > 1 && (
                <button
                  onClick={() => removeMilestone(milestone.id)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title *</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                  placeholder="e.g., Initial Deposit"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={milestone.amountCents / 100 || ''}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'amountCents', parseFloat(e.target.value) * 100 || 0)
                    }
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                  placeholder="What needs to be delivered for this milestone?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addMilestone}
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Milestone
        </button>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Value</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${parseFloat(totalAmount || '0').toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-400">Milestone Total</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${(milestones.reduce((sum, m) => sum + m.amountCents, 0) / 100).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Step 5: Review
  const renderStep5 = () => {
    const validMilestones = milestones.filter((m) => m.title.trim());

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Send</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Review your agreement before sending</p>
        </div>

        {/* Agreement Summary */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h3 className="text-xl font-bold">{title || 'Untitled Agreement'}</h3>
            <p className="text-indigo-200 mt-1 capitalize">{agreementType.replace('_', ' ')}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</h4>
              <p className="text-gray-900 dark:text-white">{description || 'No description provided'}</p>
            </div>

            {deliverables.filter((d) => d.trim()).length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Deliverables</h4>
                <ul className="list-disc list-inside text-gray-900 dark:text-white">
                  {deliverables.filter((d) => d.trim()).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {startDate && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Date</h4>
                  <p className="text-gray-900 dark:text-white">{new Date(startDate).toLocaleDateString()}</p>
                </div>
              )}
              {endDate && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End Date</h4>
                  <p className="text-gray-900 dark:text-white">{new Date(endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Counterparty</h4>
              <p className="text-gray-900 dark:text-white">
                {selectedCounterparty
                  ? `${selectedCounterparty.displayName} (@${selectedCounterparty.username})`
                  : counterpartyEmail || 'Not specified'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Value</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${parseFloat(totalAmount || '0').toLocaleString()} {currency}
              </p>
            </div>
          </div>

          {/* Milestones */}
          {validMilestones.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                Milestones ({validMilestones.length})
              </h4>
              <div className="space-y-3">
                {validMilestones.map((m, index) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {m.title}
                      </p>
                      {m.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(m.amountCents / 100).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            By creating this agreement, you agree to PayRing's Terms of Service. The counterparty
            will receive a notification to review and sign this agreement. Funds will be held in
            escrow until milestones are completed and approved.
          </p>
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create Agreement</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create & Send Agreement
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
