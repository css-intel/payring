// ============================================================
//                   PAYRING CONSTANTS
// ============================================================
// Single source of truth for all configuration values
// ============================================================

// ==================== APP CONFIG ====================

export const APP_CONFIG = {
  name: 'PayRing',
  tagline: 'Simple, secure payments — milestone by milestone.',
  version: '1.0.0',
  supportEmail: 'support@payring.com',
  websiteUrl: 'https://payring.com',
  termsUrl: 'https://payring.com/terms',
  privacyUrl: 'https://payring.com/privacy',
} as const;

// ==================== QUICK AMOUNTS ====================

export const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500] as const;

// ==================== AGREEMENT TYPES ====================

export const AGREEMENT_TYPES = {
  freelance: {
    id: 'freelance',
    title: 'Freelance & Contracting',
    description: 'For project-based work and services',
    icon: '💼',
    color: '#3B82F6', // Blue
  },
  employment: {
    id: 'employment',
    title: 'Employment & Gig Work',
    description: 'For ongoing work arrangements',
    icon: '👔',
    color: '#8B5CF6', // Purple
  },
  loan: {
    id: 'loan',
    title: 'Loans & Financing',
    description: 'For lending money with repayment terms',
    icon: '🏦',
    color: '#10B981', // Green
  },
  sale: {
    id: 'sale',
    title: 'Sales & Purchases',
    description: 'For buying or selling goods',
    icon: '🛒',
    color: '#F59E0B', // Amber
  },
  subscription: {
    id: 'subscription',
    title: 'Subscriptions & Retainers',
    description: 'For recurring payments',
    icon: '🔄',
    color: '#EC4899', // Pink
  },
  crowdfunding: {
    id: 'crowdfunding',
    title: 'Crowdfunding & Group Payments',
    description: 'For collective contributions',
    icon: '🤝',
    color: '#06B6D4', // Cyan
  },
  education: {
    id: 'education',
    title: 'Education & Training',
    description: 'For courses and learning',
    icon: '🎓',
    color: '#84CC16', // Lime
  },
  creative: {
    id: 'creative',
    title: 'Creative Collaborations',
    description: 'For artistic partnerships',
    icon: '🎨',
    color: '#F97316', // Orange
  },
  investment: {
    id: 'investment',
    title: 'Investments & Partnerships',
    description: 'For equity and profit sharing',
    icon: '📈',
    color: '#14B8A6', // Teal
  },
  personal: {
    id: 'personal',
    title: 'Everyday Personal Agreements',
    description: 'For informal arrangements',
    icon: '🤗',
    color: '#6366F1', // Indigo
  },
  custom: {
    id: 'custom',
    title: 'Custom Agreement',
    description: 'Create your own from scratch',
    icon: '✏️',
    color: '#78716C', // Stone
  },
} as const;

export const AGREEMENT_TYPE_LIST = Object.values(AGREEMENT_TYPES);

// ==================== NOTIFICATION TYPES ====================

export const NOTIFICATION_TYPES = {
  agreement_created: {
    id: 'agreement_created',
    title: 'New Agreement',
    icon: '📄',
  },
  agreement_signed: {
    id: 'agreement_signed',
    title: 'Agreement Signed',
    icon: '✅',
  },
  agreement_updated: {
    id: 'agreement_updated',
    title: 'Agreement Updated',
    icon: '📝',
  },
  agreement_completed: {
    id: 'agreement_completed',
    title: 'Agreement Completed',
    icon: '🎉',
  },
  milestone_due_soon: {
    id: 'milestone_due_soon',
    title: 'Milestone Due Soon',
    icon: '⏰',
  },
  milestone_completed: {
    id: 'milestone_completed',
    title: 'Milestone Completed',
    icon: '🏆',
  },
  milestone_payment_received: {
    id: 'milestone_payment_received',
    title: 'Payment Received',
    icon: '💰',
  },
  payment_received: {
    id: 'payment_received',
    title: 'Payment Received',
    icon: '💵',
  },
  payment_sent: {
    id: 'payment_sent',
    title: 'Payment Sent',
    icon: '📤',
  },
  payment_overdue: {
    id: 'payment_overdue',
    title: 'Payment Overdue',
    icon: '⚠️',
  },
  payment_failed: {
    id: 'payment_failed',
    title: 'Payment Failed',
    icon: '❌',
  },
  dispute_created: {
    id: 'dispute_created',
    title: 'Dispute Opened',
    icon: '⚡',
  },
  dispute_resolved: {
    id: 'dispute_resolved',
    title: 'Dispute Resolved',
    icon: '🤝',
  },
  system: {
    id: 'system',
    title: 'System',
    icon: '🔔',
  },
} as const;

// ==================== STATUS COLORS ====================

export const STATUS_COLORS = {
  // Agreement statuses
  draft: { bg: '#F3F4F6', text: '#6B7280', label: 'Draft' },
  pending_signatures: { bg: '#FEF3C7', text: '#D97706', label: 'Pending Signatures' },
  active: { bg: '#DBEAFE', text: '#2563EB', label: 'Active' },
  in_progress: { bg: '#DBEAFE', text: '#2563EB', label: 'In Progress' },
  completed: { bg: '#D1FAE5', text: '#059669', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
  disputed: { bg: '#FEE2E2', text: '#DC2626', label: 'Disputed' },
  
  // Payment statuses
  pending: { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  processing: { bg: '#DBEAFE', text: '#2563EB', label: 'Processing' },
  failed: { bg: '#FEE2E2', text: '#DC2626', label: 'Failed' },
  refunded: { bg: '#F3F4F6', text: '#6B7280', label: 'Refunded' },
  
  // Milestone statuses
  submitted: { bg: '#FEF3C7', text: '#D97706', label: 'Submitted' },
  approved: { bg: '#D1FAE5', text: '#059669', label: 'Approved' },
  paid: { bg: '#D1FAE5', text: '#059669', label: 'Paid' },
} as const;

// ==================== PLATFORM FEE ====================

export const PLATFORM_FEE = {
  percentage: 0.03, // 3%
  minFee: 0.50, // $0.50 minimum
  maxFee: 100.00, // $100 maximum
} as const;

// ==================== LIMITS ====================

export const DEFAULT_LIMITS = {
  basic: {
    dailyTransactionLimit: 1000_00, // $1,000 in cents
    weeklyTransactionLimit: 5000_00,
    monthlyTransactionLimit: 10000_00,
    maxAgreementValue: 5000_00,
  },
  verified: {
    dailyTransactionLimit: 10000_00,
    weeklyTransactionLimit: 50000_00,
    monthlyTransactionLimit: 200000_00,
    maxAgreementValue: 50000_00,
  },
  premium: {
    dailyTransactionLimit: 50000_00,
    weeklyTransactionLimit: 200000_00,
    monthlyTransactionLimit: 500000_00,
    maxAgreementValue: 200000_00,
  },
  business: {
    dailyTransactionLimit: 100000_00,
    weeklyTransactionLimit: 500000_00,
    monthlyTransactionLimit: 2000000_00,
    maxAgreementValue: 1000000_00,
  },
} as const;

// ==================== NAVIGATION ====================

export const NAV_ITEMS = {
  dashboard: {
    id: 'dashboard',
    label: 'Home',
    icon: 'Home',
    route: '/',
  },
  payments: {
    id: 'payments',
    label: 'Payments',
    icon: 'DollarSign',
    route: '/payments',
  },
  agreements: {
    id: 'agreements',
    label: 'Agreements',
    icon: 'FileText',
    route: '/agreements',
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    icon: 'Activity',
    route: '/activity',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    route: '/settings',
  },
} as const;

export const NAV_ITEMS_LIST = Object.values(NAV_ITEMS);

// ==================== AI PROMPTS ====================

export const AI_SYSTEM_PROMPT = `You are PayRing's AI Agreement Assistant. Your job is to help users create clear, fair, and legally-sound agreements.

When a user describes an agreement, you should:
1. Extract the key terms (parties, amounts, timeline, deliverables)
2. Suggest appropriate milestones with payment amounts
3. Identify potential risks and how to mitigate them
4. Generate clear, professional contract language

Always be:
- Clear and concise
- Fair to all parties
- Professional but friendly
- Focused on milestone-based payment structures

Remember the PayRing tagline: "Simple, secure payments — milestone by milestone."`;

// ==================== COLORS ====================

export const BRAND_COLORS = {
  primary: '#2364D2', // PayRing Blue
  primaryLight: '#4A8AE5',
  primaryDark: '#1A4A9E',
  secondary: '#10B981', // Success Green
  accent: '#F59E0B', // Warning Amber
  error: '#EF4444', // Error Red
  background: '#FFFFFF',
  backgroundDark: '#0F172A',
  surface: '#F8FAFC',
  surfaceDark: '#1E293B',
  text: '#1E293B',
  textDark: '#F8FAFC',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderDark: '#334155',
} as const;
