// PayRing Web - Firebase Hooks
import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { useStore } from '../store';
import type { Agreement, User, Milestone, Payment, Notification } from '@payring/shared';

// Auth Hook
export function useAuth() {
  const { user, setUser, clearUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || userData?.displayName || '',
          photoURL: firebaseUser.photoURL || userData?.photoURL,
          walletBalance: userData?.walletBalance || 0,
        });
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
    } catch (err: any) {
      setError(err.message);
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
      
      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        uid: firebaseUser.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        walletBalance: 0,
      });
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    clearUser();
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
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
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
      participants: [user.id, data.counterpartyId],
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

// Single Agreement Hook
export function useAgreement(id: string) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Subscribe to agreement
    const unsubAgreement = onSnapshot(
      doc(db, 'agreements', id),
      (doc) => {
        if (doc.exists()) {
          setAgreement({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
          } as Agreement);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Subscribe to milestones
    const milestonesQuery = query(
      collection(db, 'agreements', id, 'milestones'),
      orderBy('order', 'asc')
    );

    const unsubMilestones = onSnapshot(
      milestonesQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate?.toDate?.() || undefined,
          completedAt: doc.data().completedAt?.toDate?.() || undefined,
        })) as Milestone[];
        setMilestones(docs);
      }
    );

    return () => {
      unsubAgreement();
      unsubMilestones();
    };
  }, [id]);

  const completeMilestone = useCallback(async (milestoneId: string) => {
    await updateDoc(doc(db, 'agreements', id, 'milestones', milestoneId), {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
  }, [id]);

  const addMilestone = useCallback(async (data: Partial<Milestone>) => {
    await addDoc(collection(db, 'agreements', id, 'milestones'), {
      ...data,
      status: 'pending',
      order: milestones.length,
      createdAt: serverTimestamp(),
    });
  }, [id, milestones.length]);

  return {
    agreement,
    milestones,
    loading,
    error,
    completeMilestone,
    addMilestone,
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

    // Get payments where user is sender or receiver
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
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
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
      receiverId: recipientId,
      participants: [user.id, recipientId],
      amount,
      note,
      status: 'completed',
      type: 'transfer',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return docRef.id;
  }, [user?.id]);

  const requestPayment = useCallback(async (fromId: string, amount: number, note?: string) => {
    if (!user?.id) throw new Error('Not authenticated');

    const paymentData = {
      senderId: fromId,
      receiverId: user.id,
      participants: [user.id, fromId],
      amount,
      note,
      status: 'pending',
      type: 'request',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return docRef.id;
  }, [user?.id]);

  return {
    payments,
    loading,
    error,
    sendPayment,
    requestPayment,
  };
}

// Notifications Hook
export function useNotifications() {
  const { user } = useStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
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
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Notification[];
      setNotifications(docs);
      setUnreadCount(docs.filter(n => !n.read).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(
      unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }))
    );
  }, [notifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
