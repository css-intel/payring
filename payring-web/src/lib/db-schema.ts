// PayRing - Firestore Database Schema & Security Rules
// This file documents the database structure

/*
================================================================================
                        FIRESTORE DATABASE SCHEMA
================================================================================

Collection: users/{userId}
Purpose: Store user profiles and account information
--------------------------------------------------------------------------------
{
  id: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  username: string,              // @handle format, unique
  avatarUrl?: string,
  phoneNumber?: string,
  
  // Address (for KYC)
  address?: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  
  // Account status
  kycStatus: 'pending' | 'incomplete' | 'approved' | 'rejected',
  accountTier: 'basic' | 'verified' | 'premium' | 'business',
  isActive: boolean,
  
  // Preferences
  preferences: {
    theme: 'light' | 'dark' | 'system',
    notifications: {
      email: boolean,
      push: boolean,
      sms: boolean
    },
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts',
      transactionHistory: 'visible' | 'hidden'
    }
  },
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastActiveAt: Timestamp
}

Subcollection: users/{userId}/wallets/{walletId}
--------------------------------------------------------------------------------
{
  id: string,
  currency: string,              // 'USD'
  balance: number,               // In cents
  pendingBalance: number,        // Money in escrow
  availableBalance: number,      // Can be withdrawn
  isDefault: boolean,
  lastUpdated: Timestamp
}

Subcollection: users/{userId}/paymentMethods/{methodId}
--------------------------------------------------------------------------------
{
  id: string,
  type: 'bank' | 'card' | 'paypal',
  displayName: string,
  lastFour: string,
  bankName?: string,
  isDefault: boolean,
  isVerified: boolean,
  stripePaymentMethodId?: string,
  createdAt: Timestamp
}

Collection: agreements/{agreementId}
Purpose: Store payment agreements and contracts
--------------------------------------------------------------------------------
{
  id: string,
  title: string,
  type: 'freelance' | 'loan' | 'sale' | 'subscription' | 'custom',
  status: 'draft' | 'pending_signatures' | 'active' | 'in_progress' | 'completed' | 'cancelled' | 'disputed',
  
  // Parties
  creatorId: string,
  parties: [{
    userId: string,
    displayName: string,
    username: string,
    avatarUrl?: string,
    role: 'creator' | 'counterparty' | 'witness',
    hasSigned: boolean,
    signedAt?: Timestamp
  }],
  
  // Terms
  terms: {
    description: string,
    deliverables?: string[],
    startDate?: Timestamp,
    endDate?: Timestamp,
    paymentTerms?: string,
    cancellationPolicy?: string,
    disputeResolution?: string
  },
  
  // Financials
  totalValueCents: number,
  paidAmountCents: number,
  remainingAmountCents: number,
  currency: string,
  
  // Progress
  completedMilestones: number,
  totalMilestones: number,
  progressPercent: number,
  
  // AI-generated
  aiGenerated: boolean,
  aiSummary?: string,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  signedAt?: Timestamp,
  completedAt?: Timestamp
}

Subcollection: agreements/{agreementId}/milestones/{milestoneId}
--------------------------------------------------------------------------------
{
  id: string,
  title: string,
  description?: string,
  order: number,
  
  // Amount
  amountCents: number,
  currency: string,
  
  // Status
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'completed' | 'paid' | 'disputed',
  
  // Dates
  dueDate?: Timestamp,
  submittedAt?: Timestamp,
  approvedAt?: Timestamp,
  paidAt?: Timestamp,
  
  // Deliverables
  deliverables?: string[],
  attachments?: string[],
  
  // Payment tracking
  paymentId?: string,
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}

Collection: payments/{paymentId}
Purpose: Track all money movements
--------------------------------------------------------------------------------
{
  id: string,
  type: 'send' | 'request' | 'milestone' | 'refund' | 'escrow_release',
  
  // Parties
  senderId: string,
  senderName: string,
  receiverId: string,
  receiverName: string,
  
  // Amount
  amountCents: number,
  feeCents: number,
  netAmountCents: number,
  currency: string,
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded',
  statusMessage?: string,
  
  // Metadata
  note?: string,
  reference?: string,
  
  // Linked entities
  agreementId?: string,
  milestoneId?: string,
  
  // Stripe
  stripePaymentIntentId?: string,
  stripeTransferId?: string,
  
  // Timestamps
  createdAt: Timestamp,
  processedAt?: Timestamp,
  completedAt?: Timestamp
}

Collection: notifications/{notificationId}
--------------------------------------------------------------------------------
{
  id: string,
  userId: string,
  type: string,                  // 'payment_received', 'agreement_signed', etc.
  title: string,
  message: string,
  
  // Linked entities
  agreementId?: string,
  milestoneId?: string,
  paymentId?: string,
  
  // Status
  isRead: boolean,
  isArchived: boolean,
  
  // Display
  actionUrl?: string,
  
  createdAt: Timestamp,
  readAt?: Timestamp
}

Collection: contacts/{contactId}
--------------------------------------------------------------------------------
{
  id: string,
  ownerId: string,               // User who owns this contact
  contactUserId?: string,        // If they're a PayRing user
  displayName: string,
  username?: string,
  email?: string,
  phoneNumber?: string,
  avatarUrl?: string,
  isFavorite: boolean,
  
  // Stats
  totalTransactions: number,
  lastInteraction?: Timestamp,
  
  createdAt: Timestamp
}

Collection: disputes/{disputeId}
--------------------------------------------------------------------------------
{
  id: string,
  agreementId: string,
  milestoneId?: string,
  
  // Parties
  initiatorId: string,
  respondentId: string,
  
  // Details
  reason: string,
  description: string,
  evidence?: string[],
  
  // Status
  status: 'open' | 'under_review' | 'resolved' | 'escalated',
  resolution?: string,
  resolvedBy?: string,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  resolvedAt?: Timestamp
}

================================================================================
                        FIRESTORE SECURITY RULES
================================================================================
*/

export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isParticipant(parties) {
      return isSignedIn() && request.auth.uid in parties;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // Users cannot delete their accounts directly
      
      // Wallets subcollection
      match /wallets/{walletId} {
        allow read: if isOwner(userId);
        allow write: if false; // Only backend can modify wallets
      }
      
      // Payment methods subcollection
      match /paymentMethods/{methodId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
        allow update: if isOwner(userId);
        allow delete: if isOwner(userId);
      }
    }
    
    // Agreements collection
    match /agreements/{agreementId} {
      allow read: if isSignedIn() && (
        resource.data.creatorId == request.auth.uid ||
        request.auth.uid in resource.data.participantIds
      );
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        resource.data.creatorId == request.auth.uid ||
        request.auth.uid in resource.data.participantIds
      );
      allow delete: if resource.data.creatorId == request.auth.uid && 
                       resource.data.status == 'draft';
      
      // Milestones subcollection
      match /milestones/{milestoneId} {
        allow read: if isSignedIn() && (
          get(/databases/$(database)/documents/agreements/$(agreementId)).data.creatorId == request.auth.uid ||
          request.auth.uid in get(/databases/$(database)/documents/agreements/$(agreementId)).data.participantIds
        );
        allow write: if isSignedIn() && (
          get(/databases/$(database)/documents/agreements/$(agreementId)).data.creatorId == request.auth.uid ||
          request.auth.uid in get(/databases/$(database)/documents/agreements/$(agreementId)).data.participantIds
        );
      }
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if isSignedIn() && (
        resource.data.senderId == request.auth.uid ||
        resource.data.receiverId == request.auth.uid
      );
      allow create: if isSignedIn() && request.resource.data.senderId == request.auth.uid;
      allow update: if false; // Only backend can update payments
      allow delete: if false;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if false; // Only backend creates notifications
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Contacts collection
    match /contacts/{contactId} {
      allow read: if isSignedIn() && resource.data.ownerId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
      allow update: if isSignedIn() && resource.data.ownerId == request.auth.uid;
      allow delete: if isSignedIn() && resource.data.ownerId == request.auth.uid;
    }
    
    // Disputes collection
    match /disputes/{disputeId} {
      allow read: if isSignedIn() && (
        resource.data.initiatorId == request.auth.uid ||
        resource.data.respondentId == request.auth.uid
      );
      allow create: if isSignedIn();
      allow update: if false; // Only backend can update disputes
      allow delete: if false;
    }
  }
}
`;

export default FIRESTORE_RULES;
