// PayRing Mobile - Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCUx7M87dS8udwX3VAw5N3H2rMd1gWCNPo',
  authDomain: 'payring-10a44.firebaseapp.com',
  projectId: 'payring-10a44',
  storageBucket: 'payring-10a44.appspot.com',
  messagingSenderId: '842420461664',
  appId: '1:842420461664:web:ab94f3f4a1874a51e9c9d7',
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Use React Native persistence for auth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage };
