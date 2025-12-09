// PayRing - Agreements Service
// Complete agreement management with milestones

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Types
export type AgreementType = 'freelance' | 'loan' | 'sale' | 'subscription' | 'rental' | 'custom';
export type AgreementStatus = 'draft' | 'pending_signatures' | 'active' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'completed' | 'paid' | 'disputed';

export interface AgreementParty {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  role: 'creator' | 'counterparty' | 'witness';
  hasSigned: boolean;
  signedAt?: Date;
}

export interface AgreementTerms {
  description: string;
  deliverables?: string[];
  startDate?: Date;
  endDate?: Date;
  paymentTerms?: string;
  cancellationPolicy?: string;
  disputeResolution?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  order: number;
  amountCents: number;
  currency: string;
  status: MilestoneStatus;
  dueDate?: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  deliverables?: string[];
  attachments?: string[];
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agreement {
  id: string;
  title: string;
  type: AgreementType;
  status: AgreementStatus;
  creatorId: string;
  parties: AgreementParty[];
  participantIds: string[];
  terms: AgreementTerms;
  totalValueCents: number;
  paidAmountCents: number;
  remainingAmountCents: number;
  currency: string;
  completedMilestones: number;
  totalMilestones: number;
  progressPercent: number;
  aiGenerated: boolean;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  completedAt?: Date;
}

export interface CreateAgreementData {
  title: string;
  type: AgreementType;
  counterpartyEmail?: string;
  counterpartyUsername?: string;
  terms: AgreementTerms;
  totalValueCents: number;
  currency?: string;
  milestones?: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>[];
}

// Create a new agreement
export async function createAgreement(data: CreateAgreementData): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();

  const agreementData = {
    title: data.title,
    type: data.type,
    status: 'draft' as AgreementStatus,
    creatorId: user.uid,
    parties: [{
      userId: user.uid,
      displayName: userData?.displayName || user.displayName || '',
      username: userData?.username || '',
      avatarUrl: userData?.avatarUrl || user.photoURL || '',
      role: 'creator',
      hasSigned: false
    }],
    participantIds: [user.uid],
    terms: data.terms,
    totalValueCents: data.totalValueCents,
    paidAmountCents: 0,
    remainingAmountCents: data.totalValueCents,
    currency: data.currency || 'USD',
    completedMilestones: 0,
    totalMilestones: data.milestones?.length || 0,
    progressPercent: 0,
    aiGenerated: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const agreementRef = await addDoc(collection(db, 'agreements'), agreementData);

  // Create milestones if provided
  if (data.milestones && data.milestones.length > 0) {
    const batch = writeBatch(db);
    
    data.milestones.forEach((milestone, index) => {
      const milestoneRef = doc(collection(db, 'agreements', agreementRef.id, 'milestones'));
      batch.set(milestoneRef, {
        ...milestone,
        id: milestoneRef.id,
        order: index + 1,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
  }

  return agreementRef.id;
}

// Get agreement by ID
export async function getAgreement(agreementId: string): Promise<Agreement | null> {
  const agreementDoc = await getDoc(doc(db, 'agreements', agreementId));
  
  if (!agreementDoc.exists()) {
    return null;
  }

  const data = agreementDoc.data();
  return {
    id: agreementDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    signedAt: data.signedAt?.toDate(),
    completedAt: data.completedAt?.toDate()
  } as Agreement;
}

// Get all agreements for current user
export async function getUserAgreements(): Promise<Agreement[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'agreements'),
    where('participantIds', 'array-contains', user.uid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      signedAt: data.signedAt?.toDate(),
      completedAt: data.completedAt?.toDate()
    } as Agreement;
  });
}

// Subscribe to user agreements (real-time)
export function subscribeToAgreements(callback: (agreements: Agreement[]) => void): () => void {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'agreements'),
    where('participantIds', 'array-contains', user.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const agreements = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        signedAt: data.signedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Agreement;
    });
    callback(agreements);
  });
}

// Update agreement
export async function updateAgreement(agreementId: string, data: Partial<Agreement>): Promise<void> {
  const agreementRef = doc(db, 'agreements', agreementId);
  await updateDoc(agreementRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

// Sign agreement
export async function signAgreement(agreementId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const agreementRef = doc(db, 'agreements', agreementId);
  const agreementDoc = await getDoc(agreementRef);
  
  if (!agreementDoc.exists()) {
    throw new Error('Agreement not found');
  }

  const agreement = agreementDoc.data();
  const updatedParties = agreement.parties.map((party: AgreementParty) => {
    if (party.userId === user.uid) {
      return {
        ...party,
        hasSigned: true,
        signedAt: Timestamp.now()
      };
    }
    return party;
  });

  // Check if all parties have signed
  const allSigned = updatedParties.every((party: AgreementParty) => party.hasSigned);

  await updateDoc(agreementRef, {
    parties: updatedParties,
    status: allSigned ? 'active' : 'pending_signatures',
    signedAt: allSigned ? serverTimestamp() : null,
    updatedAt: serverTimestamp()
  });
}

// Add counterparty to agreement
export async function addCounterparty(agreementId: string, counterpartyId: string): Promise<void> {
  const counterpartyDoc = await getDoc(doc(db, 'users', counterpartyId));
  if (!counterpartyDoc.exists()) {
    throw new Error('User not found');
  }

  const counterpartyData = counterpartyDoc.data();
  const agreementRef = doc(db, 'agreements', agreementId);
  const agreementDoc = await getDoc(agreementRef);
  
  if (!agreementDoc.exists()) {
    throw new Error('Agreement not found');
  }

  const agreement = agreementDoc.data();

  await updateDoc(agreementRef, {
    parties: [...agreement.parties, {
      userId: counterpartyId,
      displayName: counterpartyData.displayName,
      username: counterpartyData.username,
      avatarUrl: counterpartyData.avatarUrl,
      role: 'counterparty',
      hasSigned: false
    }],
    participantIds: [...agreement.participantIds, counterpartyId],
    status: 'pending_signatures',
    updatedAt: serverTimestamp()
  });
}

// Delete agreement (only drafts)
export async function deleteAgreement(agreementId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const agreementRef = doc(db, 'agreements', agreementId);
  const agreementDoc = await getDoc(agreementRef);
  
  if (!agreementDoc.exists()) {
    throw new Error('Agreement not found');
  }

  const agreement = agreementDoc.data();
  
  if (agreement.creatorId !== user.uid) {
    throw new Error('Only the creator can delete this agreement');
  }

  if (agreement.status !== 'draft') {
    throw new Error('Only draft agreements can be deleted');
  }

  // Delete milestones first
  const milestonesQuery = collection(db, 'agreements', agreementId, 'milestones');
  const milestonesSnapshot = await getDocs(milestonesQuery);
  
  const batch = writeBatch(db);
  milestonesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  batch.delete(agreementRef);
  
  await batch.commit();
}

// Get milestones for an agreement
export async function getMilestones(agreementId: string): Promise<Milestone[]> {
  const q = query(
    collection(db, 'agreements', agreementId, 'milestones'),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dueDate: data.dueDate?.toDate(),
      submittedAt: data.submittedAt?.toDate(),
      approvedAt: data.approvedAt?.toDate(),
      paidAt: data.paidAt?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as Milestone;
  });
}

// Subscribe to milestones (real-time)
export function subscribeToMilestones(agreementId: string, callback: (milestones: Milestone[]) => void): () => void {
  const q = query(
    collection(db, 'agreements', agreementId, 'milestones'),
    orderBy('order', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const milestones = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate(),
        submittedAt: data.submittedAt?.toDate(),
        approvedAt: data.approvedAt?.toDate(),
        paidAt: data.paidAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Milestone;
    });
    callback(milestones);
  });
}

// Update milestone status
export async function updateMilestoneStatus(
  agreementId: string, 
  milestoneId: string, 
  status: MilestoneStatus
): Promise<void> {
  const milestoneRef = doc(db, 'agreements', agreementId, 'milestones', milestoneId);
  
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp()
  };

  // Add timestamps based on status
  switch (status) {
    case 'submitted':
      updateData.submittedAt = serverTimestamp();
      break;
    case 'approved':
      updateData.approvedAt = serverTimestamp();
      break;
    case 'paid':
    case 'completed':
      updateData.paidAt = serverTimestamp();
      break;
  }

  await updateDoc(milestoneRef, updateData);

  // Update agreement progress
  await updateAgreementProgress(agreementId);
}

// Update agreement progress based on milestones
async function updateAgreementProgress(agreementId: string): Promise<void> {
  const milestones = await getMilestones(agreementId);
  const completedMilestones = milestones.filter(m => 
    m.status === 'completed' || m.status === 'paid'
  ).length;
  const totalMilestones = milestones.length;
  const progressPercent = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  const paidAmountCents = milestones
    .filter(m => m.status === 'paid' || m.status === 'completed')
    .reduce((sum, m) => sum + m.amountCents, 0);

  const agreementRef = doc(db, 'agreements', agreementId);
  const agreementDoc = await getDoc(agreementRef);
  const agreement = agreementDoc.data();

  await updateDoc(agreementRef, {
    completedMilestones,
    totalMilestones,
    progressPercent,
    paidAmountCents,
    remainingAmountCents: (agreement?.totalValueCents || 0) - paidAmountCents,
    status: progressPercent === 100 ? 'completed' : 'in_progress',
    completedAt: progressPercent === 100 ? serverTimestamp() : null,
    updatedAt: serverTimestamp()
  });
}
