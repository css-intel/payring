// ============================================================
//                   PAYRING FIREBASE CONFIG
// ============================================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCUx7M87dS8udwX3VAw5N3H2rMd1gWCNPo',
  authDomain: 'payring-10a44.firebaseapp.com',
  projectId: 'payring-10a44',
  storageBucket: 'payring-10a44.appspot.com',
  messagingSenderId: '842420461664',
  appId: '1:842420461664:web:ab94f3f4a1874a51e9c9d7',
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

export function initializeFirebase(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(initializeFirebase());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(initializeFirebase());
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(initializeFirebase());
  }
  return storage;
}

export function getFirebaseFunctions(): Functions {
  if (!functions) {
    functions = getFunctions(initializeFirebase());
  }
  return functions;
}

// Collection names (single source of truth)
export const COLLECTIONS = {
  USERS: 'users',
  WALLETS: 'wallets',
  AGREEMENTS: 'agreements',
  MILESTONES: 'milestones', // subcollection under agreements
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
  CONTACTS: 'contacts',
  TEMPLATES: 'templates',
  ACTIVITY: 'activity',
} as const;

// Export everything
export {
  firebaseConfig,
  app,
  auth,
  db,
  storage,
  functions,
};
