// PayRing Web - Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCUx7M87dS8udwX3VAw5N3H2rMd1gWCNPo",
  authDomain: "payring-10a44.firebaseapp.com",
  projectId: "payring-10a44",
  storageBucket: "payring-10a44.firebasestorage.app",
  messagingSenderId: "640766498981",
  appId: "1:640766498981:web:payringweb",
  measurementId: "G-PAYRINGWEB"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  AGREEMENTS: 'agreements',
  PAYMENTS: 'payments',
  MILESTONES: 'milestones',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  WALLETS: 'wallets',
  CONTACTS: 'contacts',
  DISPUTES: 'disputes',
  TEMPLATES: 'templates',
} as const;

export default app;
