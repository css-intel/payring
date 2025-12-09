// PayRing Web - Firebase Hooks
import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { useStore } from '../store';
import type { Agreement, Milestone, Payment, Notification } from '@payring/shared';

// Auth Hook
export function useAuth() {
  const { user, setUser, clearUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || userData?.displayName || '',
          avatarUrl: firebaseUser.photoURL || userData?.avatarUrl,
        } as any);
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName });
      
      await addDoc(collection(db, 'users'), {
        uid: firebaseUser.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        walletBalance: 0,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    }
  }, [clearUser]);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
  };
}

// Agreements Hook
export function useAgreements() {
  const { user } = useStore();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setAgreements([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'agreements'),
      where('participants', 'array-contains', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Agreement[];
        setAgreements(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const createAgreement = useCallback(async (data: Partial<Agreement>) => {
    if (!user?.id) throw new Error('Not authenticated');

    const agreementData = {
      ...data,
      creatorId: user.id,
      participants: [user.id],
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'agreements'), agreementData);
    return docRef.id;
  }, [user?.id]);

  const updateAgreement = useCallback(async (id: string, data: Partial<Agreement>) => {
    await updateDoc(doc(db, 'agreements', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deleteAgreement = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'agreements', id));
  }, []);

  return {
    agreements,
    loading,
    error,
    createAgreement,
    updateAgreement,
    deleteAgreement,
  };
}

// Payments Hook
export function usePayments() {
  const { user } = useStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setPayments([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'payments'),
      where('participants', 'array-contains', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Payment[];
        setPayments(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const sendPayment = useCallback(async (recipientId: string, amount: number, note?: string) => {
    if (!user?.id) throw new Error('Not authenticated');

    const paymentData = {
      senderId: user.id,
      senderName: user.displayName,
      receiverId: recipientId,
      receiverName: '',
      amount: {
        amountMinor: amount * 100,
        currency: 'USD',
        formatted: `$${amount.toFixed(2)}`,
      },
      type: 'send',
      status: 'pending',
      note,
      participants: [user.id, recipientId],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return docRef.id;
  }, [user]);

  const requestPayment = useCallback(async (fromUserId: string, amount: number, note?: string) => {
    if (!user?.id) throw new Error('Not authenticated');

    const paymentData = {
      senderId: fromUserId,
      senderName: '',
      receiverId: user.id,
      receiverName: user.displayName,
      amount: {
        amountMinor: amount * 100,
        currency: 'USD',
        formatted: `$${amount.toFixed(2)}`,
      },
      type: 'request',
      status: 'pending',
      note,
      participants: [user.id, fromUserId],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return docRef.id;
  }, [user]);

  return {
    payments,
    loading,
    error,
    sendPayment,
    requestPayment,
  };
}

// Milestones Hook
export function useMilestones(agreementId: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agreementId) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'milestones'),
      where('agreementId', '==', agreementId),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate?.toDate?.()?.toISOString() || undefined,
        })) as Milestone[];
        setMilestones(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [agreementId]);

  const createMilestone = useCallback(async (data: Partial<Milestone>) => {
    const milestoneData = {
      ...data,
      agreementId,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'milestones'), milestoneData);
    return docRef.id;
  }, [agreementId]);

  const updateMilestone = useCallback(async (id: string, data: Partial<Milestone>) => {
    await updateDoc(doc(db, 'milestones', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const approveMilestone = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'milestones', id), {
      status: 'approved',
      approvedAt: serverTimestamp(),
    });
  }, []);

  const completeMilestone = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'milestones', id), {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
  }, []);

  return {
    milestones,
    loading,
    error,
    createMilestone,
    updateMilestone,
    approveMilestone,
    completeMilestone,
  };
}

// Notifications Hook
export function useNotifications() {
  const { user } = useStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Notification[];
      
      setNotifications(docs);
      setUnreadCount(docs.filter(n => !n.isRead).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), {
      isRead: true,
      readAt: serverTimestamp(),
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(
      unread.map(n => 
        updateDoc(doc(db, 'notifications', n.id), {
          isRead: true,
          readAt: serverTimestamp(),
        })
      )
    );
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}

// User Profile Hook
export function useUserProfile(userId?: string) {
  const { user } = useStore();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', targetUserId));
      if (userDoc.exists()) {
        setProfile({ id: userDoc.id, ...userDoc.data() });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [targetUserId]);

  const updateUserProfile = useCallback(async (data: Record<string, unknown>) => {
    if (!targetUserId) throw new Error('No user ID');

    await updateDoc(doc(db, 'users', targetUserId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, [targetUserId]);

  return {
    profile,
    loading,
    updateProfile: updateUserProfile,
  };
}
