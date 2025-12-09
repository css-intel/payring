// PayRing - Contacts Service
// User search and contact management

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Types
export interface Contact {
  id: string;
  ownerId: string;
  contactUserId?: string;
  displayName: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isFavorite: boolean;
  totalTransactions: number;
  lastInteraction?: Date;
  createdAt: Date;
}

export interface UserSearchResult {
  id: string;
  displayName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isContact: boolean;
}

// Search users by username or email
export async function searchUsers(searchTerm: string): Promise<UserSearchResult[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  if (normalizedSearch.length < 2) {
    return [];
  }

  // Search by username (starts with @)
  let results: UserSearchResult[] = [];

  if (normalizedSearch.startsWith('@')) {
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '>=', normalizedSearch),
      where('username', '<=', normalizedSearch + '\uf8ff'),
      limit(10)
    );
    const snapshot = await getDocs(usernameQuery);
    results = snapshot.docs
      .filter(doc => doc.id !== user.uid)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName,
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          isContact: false
        };
      });
  } else if (normalizedSearch.includes('@')) {
    // Search by email
    const emailQuery = query(
      collection(db, 'users'),
      where('email', '==', normalizedSearch),
      limit(5)
    );
    const snapshot = await getDocs(emailQuery);
    results = snapshot.docs
      .filter(doc => doc.id !== user.uid)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName,
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          isContact: false
        };
      });
  } else {
    // Search by display name
    const nameQuery = query(
      collection(db, 'users'),
      where('displayNameLower', '>=', normalizedSearch),
      where('displayNameLower', '<=', normalizedSearch + '\uf8ff'),
      limit(10)
    );
    const snapshot = await getDocs(nameQuery);
    results = snapshot.docs
      .filter(doc => doc.id !== user.uid)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName,
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          isContact: false
        };
      });
  }

  // Check if users are already contacts
  const contacts = await getUserContacts();
  const contactUserIds = new Set(contacts.map(c => c.contactUserId));

  return results.map(r => ({
    ...r,
    isContact: contactUserIds.has(r.id)
  }));
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserSearchResult | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    displayName: data.displayName,
    username: data.username,
    email: data.email,
    avatarUrl: data.avatarUrl,
    isContact: false
  };
}

// Get user by username
export async function getUserByUsername(username: string): Promise<UserSearchResult | null> {
  const normalizedUsername = username.toLowerCase().trim();
  const usernameToSearch = normalizedUsername.startsWith('@') 
    ? normalizedUsername 
    : `@${normalizedUsername}`;

  const q = query(
    collection(db, 'users'),
    where('username', '==', usernameToSearch),
    limit(1)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    displayName: data.displayName,
    username: data.username,
    email: data.email,
    avatarUrl: data.avatarUrl,
    isContact: false
  };
}

// Get user's contacts
export async function getUserContacts(): Promise<Contact[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    orderBy('displayName', 'asc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastInteraction: data.lastInteraction?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date()
    } as Contact;
  });
}

// Subscribe to contacts (real-time)
export function subscribeToContacts(callback: (contacts: Contact[]) => void): () => void {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    orderBy('displayName', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const contacts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastInteraction: data.lastInteraction?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date()
      } as Contact;
    });
    callback(contacts);
  });
}

// Get favorite contacts
export async function getFavoriteContacts(): Promise<Contact[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    where('isFavorite', '==', true),
    orderBy('displayName', 'asc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastInteraction: data.lastInteraction?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date()
    } as Contact;
  });
}

// Get recent contacts (by last interaction)
export async function getRecentContacts(maxResults = 10): Promise<Contact[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const q = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    orderBy('lastInteraction', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastInteraction: data.lastInteraction?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date()
    } as Contact;
  });
}

// Add contact
export async function addContact(contactUserId: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Get the contact's user data
  const contactUserDoc = await getDoc(doc(db, 'users', contactUserId));
  
  if (!contactUserDoc.exists()) {
    throw new Error('User not found');
  }

  const contactUserData = contactUserDoc.data();

  // Check if already a contact
  const existingQuery = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    where('contactUserId', '==', contactUserId)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error('User is already a contact');
  }

  const contactData = {
    ownerId: user.uid,
    contactUserId,
    displayName: contactUserData.displayName,
    username: contactUserData.username,
    email: contactUserData.email,
    avatarUrl: contactUserData.avatarUrl,
    isFavorite: false,
    totalTransactions: 0,
    createdAt: serverTimestamp()
  };

  const contactRef = await addDoc(collection(db, 'contacts'), contactData);
  return contactRef.id;
}

// Add manual contact (not a PayRing user)
export async function addManualContact(data: {
  displayName: string;
  email?: string;
  phoneNumber?: string;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const contactData = {
    ownerId: user.uid,
    displayName: data.displayName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    isFavorite: false,
    totalTransactions: 0,
    createdAt: serverTimestamp()
  };

  const contactRef = await addDoc(collection(db, 'contacts'), contactData);
  return contactRef.id;
}

// Update contact
export async function updateContact(contactId: string, data: Partial<Contact>): Promise<void> {
  const contactRef = doc(db, 'contacts', contactId);
  await updateDoc(contactRef, data);
}

// Toggle favorite
export async function toggleFavorite(contactId: string): Promise<void> {
  const contactRef = doc(db, 'contacts', contactId);
  const contactDoc = await getDoc(contactRef);
  
  if (!contactDoc.exists()) {
    throw new Error('Contact not found');
  }

  const currentFavorite = contactDoc.data().isFavorite;
  await updateDoc(contactRef, {
    isFavorite: !currentFavorite
  });
}

// Delete contact
export async function deleteContact(contactId: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', contactId));
}

// Update last interaction (called after transactions)
export async function updateLastInteraction(contactUserId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, 'contacts'),
    where('ownerId', '==', user.uid),
    where('contactUserId', '==', contactUserId)
  );

  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const contactRef = snapshot.docs[0].ref;
    const currentData = snapshot.docs[0].data();
    
    await updateDoc(contactRef, {
      lastInteraction: serverTimestamp(),
      totalTransactions: (currentData.totalTransactions || 0) + 1
    });
  }
}
