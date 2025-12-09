// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCUx7M87dS8udwX3VAw5N3H2rMd1gWCNPo',
  authDomain: 'payring-10a44.firebaseapp.com',
  projectId: 'payring-10a44',
  storageBucket: 'payring-10a44.appspot.com',
  messagingSenderId: '842420461664',
  appId: '1:842420461664:web:ab94f3f4a1874a51e9c9d7',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
