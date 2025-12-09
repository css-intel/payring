// PayRing - Authentication Service
// Complete auth flow with email, Google, and phone

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

// Types
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  kycStatus: 'pending' | 'incomplete' | 'approved' | 'rejected';
  accountTier: 'basic' | 'verified' | 'premium' | 'business';
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

// Create user document in Firestore
async function createUserDocument(firebaseUser: FirebaseUser, additionalData?: Partial<AuthUser>) {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || additionalData?.displayName || '',
      username: additionalData?.username || `@user${firebaseUser.uid.slice(0, 8)}`,
      avatarUrl: firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
      phoneNumber: firebaseUser.phoneNumber || '',
      kycStatus: 'pending',
      accountTier: 'basic',
      isActive: true,
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'contacts',
          transactionHistory: 'visible'
        }
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp()
    };

    await setDoc(userRef, userData);
    
    // Create default wallet
    const walletRef = doc(db, 'users', firebaseUser.uid, 'wallets', 'default');
    await setDoc(walletRef, {
      id: 'default',
      currency: 'USD',
      balance: 0,
      pendingBalance: 0,
      availableBalance: 0,
      isDefault: true,
      lastUpdated: serverTimestamp()
    });

    return userData;
  }

  return userSnap.data();
}

// Get user document from Firestore
export async function getUserDocument(userId: string): Promise<AuthUser | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as AuthUser;
  }

  return null;
}

// Sign up with email and password
export async function signUpWithEmail(data: SignUpData): Promise<AuthUser> {
  const { email, password, displayName, username } = data;

  // Create Firebase Auth account
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name in Firebase Auth
  await updateProfile(firebaseUser, { displayName });

  // Send email verification
  await sendEmailVerification(firebaseUser);

  // Create Firestore document
  const userData = await createUserDocument(firebaseUser, { displayName, username });

  return userData as AuthUser;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

  // Update last active
  const userRef = doc(db, 'users', firebaseUser.uid);
  await updateDoc(userRef, {
    lastActiveAt: serverTimestamp()
  });

  const userData = await getUserDocument(firebaseUser.uid);
  if (!userData) {
    throw new Error('User document not found');
  }

  return userData;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Create or update user document
    const userData = await createUserDocument(firebaseUser);

    // Update last active
    const userRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userRef, {
      lastActiveAt: serverTimestamp()
    });

    return userData as AuthUser;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      // Fall back to redirect
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirecting to Google sign-in...');
    }
    throw error;
  }
}

// Handle redirect result (call on app init)
export async function handleRedirectResult(): Promise<AuthUser | null> {
  const result = await getRedirectResult(auth);
  if (result) {
    const userData = await createUserDocument(result.user);
    return userData as AuthUser;
  }
  return null;
}

// Sign out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Update user password
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user signed in');
  }

  // Re-authenticate first
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Update password
  await updatePassword(user, newPassword);
}

// Update user profile
export async function updateUserProfile(data: Partial<AuthUser>): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }

  // Update Firebase Auth profile
  if (data.displayName || data.avatarUrl) {
    await updateProfile(user, {
      displayName: data.displayName,
      photoURL: data.avatarUrl
    });
  }

  // Update Firestore document
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

// Resend verification email
export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  await sendEmailVerification(user);
}

// Subscribe to auth state changes
export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userData = await getUserDocument(firebaseUser.uid);
      callback(userData);
    } else {
      callback(null);
    }
  });
}
