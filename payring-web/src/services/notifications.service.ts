// PayRing - Notifications Service
// Real-time notifications with push support

import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Types
export type NotificationType = 
  | 'payment_received'
  | 'payment_sent'
  | 'payment_request'
  | 'payment_request_accepted'
  | 'payment_request_declined'
  | 'agreement_created'
  | 'agreement_signed'
  | 'agreement_updated'
  | 'agreement_completed'
  | 'agreement_cancelled'
  | 'milestone_due_soon'
  | 'milestone_submitted'
  | 'milestone_approved'
  | 'milestone_completed'
  | 'milestone_payment_received'
  | 'dispute'
  | 'dispute_created'
  | 'dispute_resolved'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  agreementId?: string;
  milestoneId?: string;
  paymentId?: string;
  actionUrl?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  agreementId?: string;
  milestoneId?: string;
  paymentId?: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
}

// Create notification
export async function createNotification(data: CreateNotificationData): Promise<string> {
  const notificationData = {
    ...data,
    isRead: false,
    isArchived: false,
    createdAt: serverTimestamp()
  };

  const notificationRef = await addDoc(collection(db, 'notifications'), notificationData);
  return notificationRef.id;
}

// Get user notifications
export async function getUserNotifications(maxResults = 50): Promise<Notification[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    where('isArchived', '==', false),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      readAt: data.readAt?.toDate()
    } as Notification;
  });
}

// Subscribe to notifications (real-time)
export function subscribeToNotifications(
  callback: (notifications: Notification[]) => void
): () => void {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    where('isArchived', '==', false),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        readAt: data.readAt?.toDate()
      } as Notification;
    });
    callback(notifications);
  });
}

// Get unread count
export async function getUnreadCount(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    where('isRead', '==', false),
    where('isArchived', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Subscribe to unread count (real-time)
export function subscribeToUnreadCount(callback: (count: number) => void): () => void {
  const user = auth.currentUser;
  if (!user) {
    callback(0);
    return () => {};
  }

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    where('isRead', '==', false),
    where('isArchived', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    isRead: true,
    readAt: serverTimestamp()
  });
}

// Mark all as read
export async function markAllAsRead(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      isRead: true,
      readAt: serverTimestamp()
    });
  });

  await batch.commit();
}

// Archive notification
export async function archiveNotification(notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    isArchived: true
  });
}

// Delete notification
export async function deleteNotification(notificationId: string): Promise<void> {
  await deleteDoc(doc(db, 'notifications', notificationId));
}

// Clear all notifications
export async function clearAllNotifications(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid)
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

// Get notification icon based on type
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    payment_received: '💰',
    payment_sent: '📤',
    payment_request: '📩',
    payment_request_accepted: '✅',
    payment_request_declined: '❌',
    agreement_created: '📄',
    agreement_signed: '✍️',
    agreement_updated: '🔄',
    agreement_completed: '🎉',
    agreement_cancelled: '🚫',
    milestone_due_soon: '⏰',
    milestone_submitted: '📤',
    milestone_approved: '✅',
    milestone_completed: '🏆',
    milestone_payment_received: '💵',
    dispute: '⚠️',
    dispute_created: '⚠️',
    dispute_resolved: '🤝',
    kyc_approved: '✅',
    kyc_rejected: '❌',
    system: 'ℹ️'
  };

  return icons[type] || 'ℹ️';
}

// Get notification action URL based on type and linked entities
export function getNotificationActionUrl(notification: Notification): string {
  if (notification.actionUrl) {
    return notification.actionUrl;
  }

  switch (notification.type) {
    case 'payment_received':
    case 'payment_sent':
    case 'payment_request':
    case 'payment_request_accepted':
    case 'payment_request_declined':
      return notification.paymentId ? `/payments/${notification.paymentId}` : '/payments';
    
    case 'agreement_created':
    case 'agreement_signed':
    case 'agreement_updated':
    case 'agreement_completed':
    case 'agreement_cancelled':
      return notification.agreementId ? `/agreements/${notification.agreementId}` : '/agreements';
    
    case 'milestone_due_soon':
    case 'milestone_submitted':
    case 'milestone_approved':
    case 'milestone_completed':
    case 'milestone_payment_received':
      return notification.agreementId ? `/agreements/${notification.agreementId}` : '/agreements';
    
    case 'dispute_created':
    case 'dispute_resolved':
      return notification.agreementId ? `/agreements/${notification.agreementId}/dispute` : '/disputes';
    
    case 'kyc_approved':
    case 'kyc_rejected':
      return '/settings/verification';
    
    default:
      return '/activity';
  }
}
