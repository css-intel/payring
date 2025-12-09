// PayRing - Payments Service
// Complete payment processing with escrow

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
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Types
export type PaymentType = 'send' | 'request' | 'milestone' | 'refund' | 'escrow_release';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Payment {
  id: string;
  type: PaymentType;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  amountCents: number;
  feeCents: number;
  netAmountCents: number;
  currency: string;
  status: PaymentStatus;
  statusMessage?: string;
  note?: string;
  reference?: string;
  agreementId?: string;
  milestoneId?: string;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

export interface SendPaymentData {
  receiverId: string;
  amountCents: number;
  currency?: string;
  note?: string;
  agreementId?: string;
  milestoneId?: string;
}

export interface RequestPaymentData {
  fromUserId: string;
  amountCents: number;
  currency?: string;
  note?: string;
}

// Calculate platform fee (2.9% + $0.30)
export function calculateFee(amountCents: number): number {
  const percentFee = Math.round(amountCents * 0.029);
  const flatFee = 30; // 30 cents
  return percentFee + flatFee;
}

// Send payment
export async function sendPayment(data: SendPaymentData): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Get sender and receiver info
  const [senderDoc, receiverDoc] = await Promise.all([
    getDoc(doc(db, 'users', user.uid)),
    getDoc(doc(db, 'users', data.receiverId))
  ]);

  if (!receiverDoc.exists()) {
    throw new Error('Recipient not found');
  }

  const senderData = senderDoc.data();
  const receiverData = receiverDoc.data();
  const feeCents = calculateFee(data.amountCents);
  const netAmountCents = data.amountCents - feeCents;

  const paymentData = {
    type: 'send' as PaymentType,
    senderId: user.uid,
    senderName: senderData?.displayName || user.displayName || '',
    senderAvatar: senderData?.avatarUrl || user.photoURL || '',
    receiverId: data.receiverId,
    receiverName: receiverData.displayName || '',
    receiverAvatar: receiverData.avatarUrl || '',
    amountCents: data.amountCents,
    feeCents,
    netAmountCents,
    currency: data.currency || 'USD',
    status: 'pending' as PaymentStatus,
    note: data.note,
    agreementId: data.agreementId,
    milestoneId: data.milestoneId,
    createdAt: serverTimestamp()
  };

  const paymentRef = await addDoc(collection(db, 'payments'), paymentData);

  // In production, this would integrate with Stripe
  // For now, simulate processing
  await simulatePaymentProcessing(paymentRef.id);

  return paymentRef.id;
}

// Request payment
export async function requestPayment(data: RequestPaymentData): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const [requesterDoc, fromUserDoc] = await Promise.all([
    getDoc(doc(db, 'users', user.uid)),
    getDoc(doc(db, 'users', data.fromUserId))
  ]);

  if (!fromUserDoc.exists()) {
    throw new Error('User not found');
  }

  const requesterData = requesterDoc.data();
  const fromUserData = fromUserDoc.data();

  const paymentData = {
    type: 'request' as PaymentType,
    senderId: data.fromUserId,
    senderName: fromUserData.displayName || '',
    senderAvatar: fromUserData.avatarUrl || '',
    receiverId: user.uid,
    receiverName: requesterData?.displayName || user.displayName || '',
    receiverAvatar: requesterData?.avatarUrl || user.photoURL || '',
    amountCents: data.amountCents,
    feeCents: 0,
    netAmountCents: data.amountCents,
    currency: data.currency || 'USD',
    status: 'pending' as PaymentStatus,
    note: data.note,
    createdAt: serverTimestamp()
  };

  const paymentRef = await addDoc(collection(db, 'payments'), paymentData);

  // Create notification for the person being requested
  await addDoc(collection(db, 'notifications'), {
    userId: data.fromUserId,
    type: 'payment_request',
    title: 'Payment Request',
    message: `${requesterData?.displayName} requested $${(data.amountCents / 100).toFixed(2)}`,
    paymentId: paymentRef.id,
    isRead: false,
    isArchived: false,
    createdAt: serverTimestamp()
  });

  return paymentRef.id;
}

// Accept payment request
export async function acceptPaymentRequest(paymentId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const paymentRef = doc(db, 'payments', paymentId);
  const paymentDoc = await getDoc(paymentRef);

  if (!paymentDoc.exists()) {
    throw new Error('Payment not found');
  }

  const payment = paymentDoc.data();

  if (payment.senderId !== user.uid) {
    throw new Error('You are not authorized to accept this request');
  }

  if (payment.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  // Calculate fee now that it's being paid
  const feeCents = calculateFee(payment.amountCents);

  await updateDoc(paymentRef, {
    status: 'processing',
    feeCents,
    netAmountCents: payment.amountCents - feeCents,
    processedAt: serverTimestamp()
  });

  // Simulate processing
  await simulatePaymentProcessing(paymentId);
}

// Decline payment request
export async function declinePaymentRequest(paymentId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const paymentRef = doc(db, 'payments', paymentId);
  const paymentDoc = await getDoc(paymentRef);

  if (!paymentDoc.exists()) {
    throw new Error('Payment not found');
  }

  const payment = paymentDoc.data();

  if (payment.senderId !== user.uid) {
    throw new Error('You are not authorized to decline this request');
  }

  await updateDoc(paymentRef, {
    status: 'cancelled',
    statusMessage: 'Request declined',
    completedAt: serverTimestamp()
  });
}

// Release milestone payment (from escrow)
export async function releaseMilestonePayment(
  agreementId: string, 
  milestoneId: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Get agreement and milestone
  const [agreementDoc, milestoneDoc] = await Promise.all([
    getDoc(doc(db, 'agreements', agreementId)),
    getDoc(doc(db, 'agreements', agreementId, 'milestones', milestoneId))
  ]);

  if (!agreementDoc.exists() || !milestoneDoc.exists()) {
    throw new Error('Agreement or milestone not found');
  }

  const agreement = agreementDoc.data();
  const milestone = milestoneDoc.data();

  // Verify user is the payer (creator in most cases)
  if (agreement.creatorId !== user.uid) {
    throw new Error('Only the agreement creator can release payments');
  }

  // Find the counterparty (recipient)
  const counterparty = agreement.parties.find(
    (p: { role: string }) => p.role === 'counterparty'
  );

  if (!counterparty) {
    throw new Error('No counterparty found');
  }

  // Create the payment
  const feeCents = calculateFee(milestone.amountCents);
  const netAmountCents = milestone.amountCents - feeCents;

  const paymentRef = await addDoc(collection(db, 'payments'), {
    type: 'milestone',
    senderId: user.uid,
    senderName: agreement.parties[0].displayName,
    senderAvatar: agreement.parties[0].avatarUrl || '',
    receiverId: counterparty.userId,
    receiverName: counterparty.displayName,
    receiverAvatar: counterparty.avatarUrl || '',
    amountCents: milestone.amountCents,
    feeCents,
    netAmountCents,
    currency: agreement.currency,
    status: 'processing',
    note: `Milestone: ${milestone.title}`,
    agreementId,
    milestoneId,
    createdAt: serverTimestamp(),
    processedAt: serverTimestamp()
  });

  // Update milestone
  await updateDoc(doc(db, 'agreements', agreementId, 'milestones', milestoneId), {
    status: 'paid',
    paymentId: paymentRef.id,
    paidAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Simulate payment processing
  await simulatePaymentProcessing(paymentRef.id);

  // Create notification for recipient
  await addDoc(collection(db, 'notifications'), {
    userId: counterparty.userId,
    type: 'milestone_payment_received',
    title: 'Payment Received',
    message: `You received $${(netAmountCents / 100).toFixed(2)} for "${milestone.title}"`,
    paymentId: paymentRef.id,
    agreementId,
    milestoneId,
    isRead: false,
    isArchived: false,
    createdAt: serverTimestamp()
  });

  return paymentRef.id;
}

// Get payment by ID
export async function getPayment(paymentId: string): Promise<Payment | null> {
  const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
  
  if (!paymentDoc.exists()) {
    return null;
  }

  const data = paymentDoc.data();
  return {
    id: paymentDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    processedAt: data.processedAt?.toDate(),
    completedAt: data.completedAt?.toDate()
  } as Payment;
}

// Get user's payment history
export async function getUserPayments(limit = 50): Promise<Payment[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Get payments where user is sender
  const sentQuery = query(
    collection(db, 'payments'),
    where('senderId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  // Get payments where user is receiver
  const receivedQuery = query(
    collection(db, 'payments'),
    where('receiverId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const [sentSnapshot, receivedSnapshot] = await Promise.all([
    getDocs(sentQuery),
    getDocs(receivedQuery)
  ]);

  const payments: Payment[] = [];

  [...sentSnapshot.docs, ...receivedSnapshot.docs].forEach(doc => {
    const data = doc.data();
    // Avoid duplicates
    if (!payments.find(p => p.id === doc.id)) {
      payments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        processedAt: data.processedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Payment);
    }
  });

  // Sort by createdAt descending
  payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return payments.slice(0, limit);
}

// Subscribe to user payments (real-time)
export function subscribeToPayments(callback: (payments: Payment[]) => void): () => void {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  // We'll subscribe to received payments as a simple example
  // In production, you'd want to combine sent and received
  const q = query(
    collection(db, 'payments'),
    where('receiverId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        processedAt: data.processedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Payment;
    });
    callback(payments);
  });
}

// Get pending payment requests
export async function getPendingRequests(): Promise<Payment[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'payments'),
    where('senderId', '==', user.uid),
    where('type', '==', 'request'),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Payment;
  });
}

// Simulate payment processing (replace with Stripe in production)
async function simulatePaymentProcessing(paymentId: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const paymentRef = doc(db, 'payments', paymentId);
  
  await updateDoc(paymentRef, {
    status: 'completed',
    completedAt: serverTimestamp()
  });

  // Get payment details for notification
  const paymentDoc = await getDoc(paymentRef);
  const payment = paymentDoc.data();

  if (payment) {
    // Create notification for receiver
    await addDoc(collection(db, 'notifications'), {
      userId: payment.receiverId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `You received $${(payment.netAmountCents / 100).toFixed(2)} from ${payment.senderName}`,
      paymentId,
      isRead: false,
      isArchived: false,
      createdAt: serverTimestamp()
    });

    // Create notification for sender
    await addDoc(collection(db, 'notifications'), {
      userId: payment.senderId,
      type: 'payment_sent',
      title: 'Payment Sent',
      message: `You sent $${(payment.amountCents / 100).toFixed(2)} to ${payment.receiverName}`,
      paymentId,
      isRead: false,
      isArchived: false,
      createdAt: serverTimestamp()
    });
  }
}

// Get wallet balance
export async function getWalletBalance(): Promise<{ balance: number; pending: number; available: number }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const walletDoc = await getDoc(doc(db, 'users', user.uid, 'wallets', 'default'));
  
  if (!walletDoc.exists()) {
    return { balance: 0, pending: 0, available: 0 };
  }

  const data = walletDoc.data();
  return {
    balance: data.balance || 0,
    pending: data.pendingBalance || 0,
    available: data.availableBalance || 0
  };
}
