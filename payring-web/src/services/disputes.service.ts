/**
 * Disputes Service
 * Handles dispute creation, management, and resolution
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { createNotification } from './notifications.service';

// Types
export interface Dispute {
  id: string;
  agreementId: string;
  milestoneId?: string;
  paymentId?: string;
  
  initiatorId: string;
  respondentId: string;
  
  type: 'quality' | 'delivery' | 'payment' | 'scope' | 'communication' | 'other';
  status: 'open' | 'under_review' | 'mediation' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  title: string;
  description: string;
  desiredResolution: string;
  
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  
  resolution?: DisputeResolution;
  
  assignedMediatorId?: string;
  
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface DisputeEvidence {
  id: string;
  userId: string;
  type: 'screenshot' | 'document' | 'message' | 'contract' | 'other';
  title: string;
  description: string;
  fileUrl?: string;
  content?: string;
  createdAt: Date;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  userId: string;
  userRole: 'initiator' | 'respondent' | 'mediator' | 'system';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface DisputeResolution {
  type: 'refund_full' | 'refund_partial' | 'release_full' | 'release_partial' | 'mutual_agreement' | 'favor_initiator' | 'favor_respondent';
  description: string;
  amount?: number;
  decidedBy: 'mutual' | 'mediator' | 'system';
  decidedAt: Date;
  notes?: string;
}

// Create a new dispute
export async function createDispute(data: {
  agreementId: string;
  milestoneId?: string;
  paymentId?: string;
  initiatorId: string;
  respondentId: string;
  type: Dispute['type'];
  title: string;
  description: string;
  desiredResolution: string;
  priority?: Dispute['priority'];
}): Promise<Dispute> {
  const disputesRef = collection(db, COLLECTIONS.DISPUTES);
  
  const dispute = {
    agreementId: data.agreementId,
    milestoneId: data.milestoneId || null,
    paymentId: data.paymentId || null,
    initiatorId: data.initiatorId,
    respondentId: data.respondentId,
    type: data.type,
    status: 'open' as const,
    priority: data.priority || 'medium',
    title: data.title,
    description: data.description,
    desiredResolution: data.desiredResolution,
    evidence: [],
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(disputesRef, dispute);

  // Notify the respondent
  await createNotification({
    userId: data.respondentId,
    type: 'dispute',
    title: 'New Dispute Filed',
    message: `A dispute has been filed: ${data.title}`,
    data: {
      disputeId: docRef.id,
      agreementId: data.agreementId,
    },
  });

  // Create system message
  await addDisputeMessage(docRef.id, {
    userId: 'system',
    userRole: 'system',
    message: `Dispute opened: ${data.title}. Both parties are encouraged to communicate and reach a mutual resolution within 7 days.`,
  });

  return {
    id: docRef.id,
    ...dispute,
    evidence: [],
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Dispute;
}

// Get dispute by ID
export async function getDispute(disputeId: string): Promise<Dispute | null> {
  const docRef = doc(db, COLLECTIONS.DISPUTES, disputeId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
    resolvedAt: docSnap.data().resolvedAt?.toDate(),
  } as Dispute;
}

// Get disputes for a user
export async function getUserDisputes(
  userId: string,
  role?: 'initiator' | 'respondent'
): Promise<Dispute[]> {
  const disputesRef = collection(db, COLLECTIONS.DISPUTES);
  
  let disputes: Dispute[] = [];
  
  if (!role || role === 'initiator') {
    const initiatorQuery = query(
      disputesRef,
      where('initiatorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const initiatorSnap = await getDocs(initiatorQuery);
    disputes = disputes.concat(
      initiatorSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Dispute[]
    );
  }
  
  if (!role || role === 'respondent') {
    const respondentQuery = query(
      disputesRef,
      where('respondentId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const respondentSnap = await getDocs(respondentQuery);
    disputes = disputes.concat(
      respondentSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Dispute[]
    );
  }

  // Remove duplicates and sort
  const uniqueDisputes = Array.from(
    new Map(disputes.map((d) => [d.id, d])).values()
  );
  
  return uniqueDisputes.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

// Get disputes for an agreement
export async function getAgreementDisputes(agreementId: string): Promise<Dispute[]> {
  const disputesRef = collection(db, COLLECTIONS.DISPUTES);
  const q = query(
    disputesRef,
    where('agreementId', '==', agreementId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Dispute[];
}

// Update dispute status
export async function updateDisputeStatus(
  disputeId: string,
  status: Dispute['status'],
  notes?: string
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DISPUTES, disputeId);
  
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (status === 'resolved' || status === 'closed') {
    updateData.resolvedAt = serverTimestamp();
  }

  await updateDoc(docRef, updateData);

  // Add system message
  const statusMessages: Record<Dispute['status'], string> = {
    open: 'Dispute has been reopened.',
    under_review: 'Dispute is now under review by PayRing support.',
    mediation: 'A mediator has been assigned to help resolve this dispute.',
    escalated: 'This dispute has been escalated for further review.',
    resolved: 'This dispute has been resolved.',
    closed: 'This dispute has been closed.',
  };

  await addDisputeMessage(disputeId, {
    userId: 'system',
    userRole: 'system',
    message: statusMessages[status] + (notes ? ` Note: ${notes}` : ''),
  });
}

// Add evidence to dispute
export async function addDisputeEvidence(
  disputeId: string,
  evidence: {
    userId: string;
    type: DisputeEvidence['type'];
    title: string;
    description: string;
    fileUrl?: string;
    content?: string;
  }
): Promise<DisputeEvidence> {
  const dispute = await getDispute(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  const newEvidence: DisputeEvidence = {
    id: `ev_${Date.now()}`,
    userId: evidence.userId,
    type: evidence.type,
    title: evidence.title,
    description: evidence.description,
    fileUrl: evidence.fileUrl,
    content: evidence.content,
    createdAt: new Date(),
  };

  const docRef = doc(db, COLLECTIONS.DISPUTES, disputeId);
  await updateDoc(docRef, {
    evidence: [...dispute.evidence, { ...newEvidence, createdAt: Timestamp.fromDate(newEvidence.createdAt) }],
    updatedAt: serverTimestamp(),
  });

  // Add system message
  await addDisputeMessage(disputeId, {
    userId: 'system',
    userRole: 'system',
    message: `New evidence submitted: "${evidence.title}"`,
  });

  return newEvidence;
}

// Add message to dispute
export async function addDisputeMessage(
  disputeId: string,
  message: {
    userId: string;
    userRole: DisputeMessage['userRole'];
    message: string;
    attachments?: string[];
  }
): Promise<DisputeMessage> {
  const dispute = await getDispute(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  const newMessage: DisputeMessage = {
    id: `msg_${Date.now()}`,
    disputeId,
    userId: message.userId,
    userRole: message.userRole,
    message: message.message,
    attachments: message.attachments,
    createdAt: new Date(),
  };

  const docRef = doc(db, COLLECTIONS.DISPUTES, disputeId);
  await updateDoc(docRef, {
    messages: [...dispute.messages, { ...newMessage, createdAt: Timestamp.fromDate(newMessage.createdAt) }],
    updatedAt: serverTimestamp(),
  });

  // Notify other party (if not system message)
  if (message.userId !== 'system') {
    const recipientId =
      message.userId === dispute.initiatorId
        ? dispute.respondentId
        : dispute.initiatorId;

    await createNotification({
      userId: recipientId,
      type: 'dispute',
      title: 'New Dispute Message',
      message: `New message in dispute: ${dispute.title}`,
      data: {
        disputeId,
        messageId: newMessage.id,
      },
    });
  }

  return newMessage;
}

// Resolve dispute
export async function resolveDispute(
  disputeId: string,
  resolution: {
    type: DisputeResolution['type'];
    description: string;
    amount?: number;
    decidedBy: DisputeResolution['decidedBy'];
    notes?: string;
  }
): Promise<Dispute> {
  const docRef = doc(db, COLLECTIONS.DISPUTES, disputeId);
  
  const resolutionData: DisputeResolution = {
    type: resolution.type,
    description: resolution.description,
    amount: resolution.amount,
    decidedBy: resolution.decidedBy,
    decidedAt: new Date(),
    notes: resolution.notes,
  };

  await updateDoc(docRef, {
    status: 'resolved',
    resolution: {
      ...resolutionData,
      decidedAt: serverTimestamp(),
    },
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Add system message
  await addDisputeMessage(disputeId, {
    userId: 'system',
    userRole: 'system',
    message: `Dispute resolved: ${resolution.description}`,
  });

  // Notify both parties
  const dispute = await getDispute(disputeId);
  if (dispute) {
    await Promise.all([
      createNotification({
        userId: dispute.initiatorId,
        type: 'dispute',
        title: 'Dispute Resolved',
        message: resolution.description,
        data: { disputeId },
      }),
      createNotification({
        userId: dispute.respondentId,
        type: 'dispute',
        title: 'Dispute Resolved',
        message: resolution.description,
        data: { disputeId },
      }),
    ]);
  }

  return (await getDispute(disputeId))!;
}

// Request mediation
export async function requestMediation(disputeId: string): Promise<void> {
  await updateDisputeStatus(
    disputeId,
    'mediation',
    'Mediation requested by one of the parties.'
  );
}

// Get dispute statistics for a user
export async function getDisputeStats(userId: string): Promise<{
  total: number;
  open: number;
  resolved: number;
  won: number;
  lost: number;
}> {
  const disputes = await getUserDisputes(userId);
  
  let won = 0;
  let lost = 0;
  
  disputes.forEach((dispute) => {
    if (dispute.status === 'resolved' && dispute.resolution) {
      const isInitiator = dispute.initiatorId === userId;
      const favoredInitiator =
        dispute.resolution.type === 'favor_initiator' ||
        dispute.resolution.type === 'refund_full';
      const favoredRespondent =
        dispute.resolution.type === 'favor_respondent' ||
        dispute.resolution.type === 'release_full';

      if ((isInitiator && favoredInitiator) || (!isInitiator && favoredRespondent)) {
        won++;
      } else if ((isInitiator && favoredRespondent) || (!isInitiator && favoredInitiator)) {
        lost++;
      }
    }
  });

  return {
    total: disputes.length,
    open: disputes.filter((d) => !['resolved', 'closed'].includes(d.status)).length,
    resolved: disputes.filter((d) => ['resolved', 'closed'].includes(d.status)).length,
    won,
    lost,
  };
}

// Dispute templates/reasons
export const DISPUTE_TYPES = [
  {
    value: 'quality',
    label: 'Quality Issues',
    description: 'Work delivered does not meet agreed quality standards',
  },
  {
    value: 'delivery',
    label: 'Delivery Problems',
    description: 'Work not delivered on time or not delivered at all',
  },
  {
    value: 'payment',
    label: 'Payment Issues',
    description: 'Problems with payment release or amounts',
  },
  {
    value: 'scope',
    label: 'Scope Disagreement',
    description: 'Disagreement about what was included in the agreement',
  },
  {
    value: 'communication',
    label: 'Communication Breakdown',
    description: 'Unresponsive party or lack of communication',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other issues not listed above',
  },
] as const;
