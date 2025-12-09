// ============================================================
//                   PAYRING CORE DATA MODELS
// ============================================================
// These types are the single source of truth for all PayRing
// applications (web, iOS, Android). Keep them in sync.
// ============================================================

// ==================== BASE TYPES ====================

export type Currency = {
  amountMinor: number; // Amount in cents (e.g., 12570 = $125.70)
  currency: string;    // ISO 4217 code (e.g., "USD")
  formatted: string;   // Display string (e.g., "$125.70")
};

export type Timestamp = {
  iso: string;         // ISO 8601 timestamp
  relative: string;    // Human-readable (e.g., "2 hours ago")
};

// ==================== USER MODEL ====================

export type KYCStatus = 'pending' | 'incomplete' | 'approved' | 'rejected';
export type AccountTier = 'basic' | 'verified' | 'premium' | 'business';
export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    transactionHistory: 'visible' | 'hidden';
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    lastPasswordChange?: string;
  };
}

export interface UserLimits {
  dailyTransactionLimit: Currency;
  weeklyTransactionLimit: Currency;
  monthlyTransactionLimit: Currency;
  maxAgreementValue: Currency;
}

export interface UserMetrics {
  completedAgreements: number;
  totalEarned: Currency;
  totalSpent: Currency;
  satisfactionRating: number; // 0-100
  averageResponseTime: string; // e.g., "< 1 hour"
}

export interface ConnectedBank {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'business';
  lastFour: string;
  isVerified: boolean;
  isPrimary: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'card' | 'paypal' | 'crypto';
  displayName: string;
  lastFour?: string;
  isDefault: boolean;
  expiryDate?: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  displayName: string;
  username: string; // @handle format
  avatarUrl?: string;
  
  // Address
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Account status
  kycStatus: KYCStatus;
  accountTier: AccountTier;
  isActive: boolean;
  
  // Financial
  connectedBanks: ConnectedBank[];
  paymentMethods: PaymentMethod[];
  
  // Settings
  preferences: UserPreferences;
  limits: UserLimits;
  
  // Metrics
  metrics: UserMetrics;
  
  // Business (optional)
  businessInfo?: {
    businessName: string;
    taxId: string;
    businessType: string;
    website?: string;
  };
  
  // Timestamps
  createdAt: string;
  lastActiveAt: string;
  
  // Risk scoring (internal)
  riskScore?: number;
}

// ==================== WALLET MODEL ====================

export interface Wallet {
  id: string;
  userId: string;
  balance: Currency;
  pendingBalance: Currency; // Money in escrow
  availableBalance: Currency; // Can be withdrawn
  currency: string;
  isLocked: boolean;
  lastUpdated: string;
}

// ==================== CONTACT MODEL ====================

export interface Contact {
  id: string;
  userId: string; // Owner of this contact
  contactUserId?: string; // If they're a PayRing user
  displayName: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isFavorite: boolean;
  lastInteraction?: string;
  totalTransactions: number;
  createdAt: string;
}

// ==================== PAYMENT MODEL ====================

export type PaymentType = 'send' | 'request' | 'milestone' | 'refund';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Payment {
  id: string;
  type: PaymentType;
  
  // Parties
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  
  // Amount
  amount: Currency;
  fee?: Currency;
  netAmount?: Currency;
  
  // Status
  status: PaymentStatus;
  statusMessage?: string;
  
  // Metadata
  note?: string;
  reference?: string;
  
  // Linked entities
  agreementId?: string;
  milestoneId?: string;
  
  // Timestamps
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
}

// ==================== AGREEMENT MODEL ====================

export type AgreementType = 
  | 'freelance'
  | 'employment'
  | 'loan'
  | 'sale'
  | 'subscription'
  | 'crowdfunding'
  | 'education'
  | 'creative'
  | 'investment'
  | 'personal'
  | 'custom';

export type AgreementStatus = 
  | 'draft'
  | 'pending_signatures'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface AgreementParty {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  role: 'creator' | 'counterparty' | 'witness';
  hasSigned: boolean;
  signedAt?: string;
  stripeAccountId?: string; // For payouts
}

export interface AgreementTerms {
  description: string;
  deliverables?: string[];
  startDate?: string;
  endDate?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
  disputeResolution?: string;
  additionalTerms?: string;
}

export interface Agreement {
  id: string;
  title: string;
  type: AgreementType;
  status: AgreementStatus;
  
  // Parties
  creatorId: string;
  parties: AgreementParty[];
  
  // Terms
  terms: AgreementTerms;
  
  // Financials
  totalValue: Currency;
  paidAmount: Currency;
  remainingAmount: Currency;
  
  // Progress
  milestones: Milestone[];
  completedMilestones: number;
  totalMilestones: number;
  progressPercent: number;
  
  // AI-generated (if applicable)
  aiGenerated: boolean;
  aiRiskAnalysis?: string;
  aiSummary?: string;
  
  // Template reference
  templateId?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  completedAt?: string;
}

// ==================== MILESTONE MODEL ====================

export type MilestoneStatus = 
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'completed'
  | 'paid'
  | 'disputed';

export interface Milestone {
  id: string;
  agreementId: string;
  
  // Details
  title: string;
  description?: string;
  order: number; // Sequence in the agreement
  
  // Amount
  amount: Currency;
  
  // Status
  status: MilestoneStatus;
  
  // Dates
  dueDate?: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  
  // Payout tracking
  payoutId?: string;
  payoutStatus?: 'pending' | 'processing' | 'sent' | 'failed';
  
  // Deliverables
  deliverables?: string[];
  attachments?: string[];
}

// ==================== TEMPLATE MODEL ====================

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'currency';
  placeholder?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string | number;
}

export interface TemplateMilestone {
  title: string;
  description?: string;
  amountPercent?: number; // Percentage of total
  dueDaysFromStart?: number;
}

export interface Template {
  id: string;
  type: AgreementType;
  title: string;
  description: string;
  icon: string; // Icon name or emoji
  color: string; // Hex color
  
  // Template structure
  fields: TemplateField[];
  defaultMilestones: TemplateMilestone[];
  defaultTerms?: Partial<AgreementTerms>;
  
  // Metadata
  isSystem: boolean; // Built-in vs user-created
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== NOTIFICATION MODEL ====================

export type NotificationType = 
  | 'agreement_created'
  | 'agreement_signed'
  | 'agreement_updated'
  | 'agreement_completed'
  | 'milestone_due_soon'
  | 'milestone_completed'
  | 'milestone_payment_received'
  | 'payment_received'
  | 'payment_sent'
  | 'payment_overdue'
  | 'payment_failed'
  | 'dispute_created'
  | 'dispute_resolved'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  
  // Content
  title: string;
  message: string;
  
  // Linked entities
  agreementId?: string;
  milestoneId?: string;
  paymentId?: string;
  
  // Display
  icon?: string;
  actionUrl?: string;
  
  // Status
  isRead: boolean;
  isArchived: boolean;
  
  // Timestamps
  createdAt: string;
  readAt?: string;
}

// ==================== ACTIVITY FEED MODEL ====================

export type ActivityType = 
  | 'payment_received'
  | 'payment_sent'
  | 'milestone_completed'
  | 'agreement_created'
  | 'agreement_signed'
  | 'request_received'
  | 'refund';

export type ActivityStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'disputed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  counterpartyName: string;
  counterpartyAvatar?: string;
  amount: Currency & { sign: '+' | '-' | '±' };
  status: ActivityStatus;
  timestamp: Timestamp;
  
  // Linked entities
  agreementId?: string;
  paymentId?: string;
  
  // UI state
  isNew?: boolean;
}

// ==================== PAGINATION ====================

export interface Pagination {
  cursor?: string | null;
  hasMore: boolean;
  totalCount?: number;
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiListResponse<T> extends ApiResponse<Page<T>> {}
