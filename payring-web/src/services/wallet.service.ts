/**
 * Wallet Service
 * Manages user wallet, transactions, and balance operations
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';

// Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  availableBalance: number;
  pendingBalance: number;
  escrowBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'escrow_hold' | 'escrow_release' | 'refund' | 'fee';
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  metadata: {
    paymentId?: string;
    agreementId?: string;
    milestoneId?: string;
    bankAccountId?: string;
    cardId?: string;
    stripeTransferId?: string;
    [key: string]: unknown;
  };
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  last4: string;
  routingNumber: string;
  isDefault: boolean;
  isVerified: boolean;
  stripeSourceId?: string;
  createdAt: Date;
}

export interface PaymentCard {
  id: string;
  userId: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  stripePaymentMethodId: string;
  createdAt: Date;
}

// Wallet operations
export async function getOrCreateWallet(userId: string): Promise<Wallet> {
  // Check if wallet exists
  const walletsRef = collection(db, COLLECTIONS.WALLETS);
  const q = query(walletsRef, where('userId', '==', userId), limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const walletDoc = snapshot.docs[0];
    return {
      id: walletDoc.id,
      ...walletDoc.data(),
      createdAt: walletDoc.data().createdAt?.toDate(),
      updatedAt: walletDoc.data().updatedAt?.toDate(),
    } as Wallet;
  }

  // Create new wallet
  const newWallet = {
    userId,
    balance: 0,
    currency: 'USD',
    availableBalance: 0,
    pendingBalance: 0,
    escrowBalance: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(walletsRef, newWallet);
  return {
    id: docRef.id,
    ...newWallet,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Wallet;
}

export async function getWalletBalance(userId: string): Promise<{
  balance: number;
  available: number;
  pending: number;
  escrow: number;
}> {
  const wallet = await getOrCreateWallet(userId);
  return {
    balance: wallet.balance,
    available: wallet.availableBalance,
    pending: wallet.pendingBalance,
    escrow: wallet.escrowBalance,
  };
}

export async function depositFunds(
  userId: string,
  amount: number,
  source: 'bank' | 'card',
  sourceId: string,
  description?: string
): Promise<WalletTransaction> {
  const wallet = await getOrCreateWallet(userId);
  const fee = source === 'card' ? amount * 0.029 + 0.30 : 0; // 2.9% + $0.30 for cards
  const netAmount = amount - fee;

  // Create transaction record
  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  const transaction = {
    walletId: wallet.id,
    userId,
    type: 'deposit',
    amount,
    fee,
    netAmount,
    currency: 'USD',
    status: 'pending',
    description: description || `Deposit from ${source}`,
    metadata: {
      sourceType: source,
      sourceId,
    },
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance + netAmount,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(transactionsRef, transaction);

  // In production, this would trigger Stripe charge
  // For now, we'll auto-complete the deposit
  await runTransaction(db, async (t) => {
    const walletRef = doc(db, COLLECTIONS.WALLETS, wallet.id);
    const walletSnap = await t.get(walletRef);
    const currentBalance = walletSnap.data()?.balance || 0;
    const currentAvailable = walletSnap.data()?.availableBalance || 0;

    t.update(walletRef, {
      balance: currentBalance + netAmount,
      availableBalance: currentAvailable + netAmount,
      updatedAt: serverTimestamp(),
    });

    const txRef = doc(db, COLLECTIONS.TRANSACTIONS, docRef.id);
    t.update(txRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
  });

  return {
    id: docRef.id,
    ...transaction,
    status: 'completed',
    createdAt: new Date(),
    completedAt: new Date(),
  } as WalletTransaction;
}

export async function withdrawFunds(
  userId: string,
  amount: number,
  bankAccountId: string,
  description?: string
): Promise<WalletTransaction> {
  const wallet = await getOrCreateWallet(userId);
  
  if (wallet.availableBalance < amount) {
    throw new Error('Insufficient available balance');
  }

  const fee = Math.min(amount * 0.01, 5); // 1% fee, max $5
  const netAmount = amount - fee;

  // Create transaction record
  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  const transaction = {
    walletId: wallet.id,
    userId,
    type: 'withdrawal',
    amount,
    fee,
    netAmount,
    currency: 'USD',
    status: 'pending',
    description: description || 'Withdrawal to bank account',
    metadata: {
      bankAccountId,
    },
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance - amount,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(transactionsRef, transaction);

  // Update wallet balance immediately (pending withdrawal)
  await runTransaction(db, async (t) => {
    const walletRef = doc(db, COLLECTIONS.WALLETS, wallet.id);
    const walletSnap = await t.get(walletRef);
    const currentBalance = walletSnap.data()?.balance || 0;
    const currentAvailable = walletSnap.data()?.availableBalance || 0;
    const currentPending = walletSnap.data()?.pendingBalance || 0;

    t.update(walletRef, {
      balance: currentBalance - amount,
      availableBalance: currentAvailable - amount,
      pendingBalance: currentPending + amount,
      updatedAt: serverTimestamp(),
    });
  });

  return {
    id: docRef.id,
    ...transaction,
    createdAt: new Date(),
  } as WalletTransaction;
}

export async function holdEscrow(
  userId: string,
  amount: number,
  agreementId: string,
  milestoneId?: string
): Promise<WalletTransaction> {
  const wallet = await getOrCreateWallet(userId);
  
  if (wallet.availableBalance < amount) {
    throw new Error('Insufficient available balance for escrow');
  }

  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  const transaction = {
    walletId: wallet.id,
    userId,
    type: 'escrow_hold',
    amount,
    fee: 0,
    netAmount: amount,
    currency: 'USD',
    status: 'completed',
    description: 'Escrow hold for agreement',
    metadata: {
      agreementId,
      milestoneId,
    },
    balanceBefore: wallet.availableBalance,
    balanceAfter: wallet.availableBalance - amount,
    createdAt: serverTimestamp(),
    completedAt: serverTimestamp(),
  };

  const docRef = await addDoc(transactionsRef, transaction);

  // Move funds to escrow
  await runTransaction(db, async (t) => {
    const walletRef = doc(db, COLLECTIONS.WALLETS, wallet.id);
    const walletSnap = await t.get(walletRef);
    const currentAvailable = walletSnap.data()?.availableBalance || 0;
    const currentEscrow = walletSnap.data()?.escrowBalance || 0;

    t.update(walletRef, {
      availableBalance: currentAvailable - amount,
      escrowBalance: currentEscrow + amount,
      updatedAt: serverTimestamp(),
    });
  });

  return {
    id: docRef.id,
    ...transaction,
    createdAt: new Date(),
    completedAt: new Date(),
  } as WalletTransaction;
}

export async function releaseEscrow(
  fromUserId: string,
  toUserId: string,
  amount: number,
  agreementId: string,
  milestoneId?: string
): Promise<{ fromTx: WalletTransaction; toTx: WalletTransaction }> {
  const fromWallet = await getOrCreateWallet(fromUserId);
  const toWallet = await getOrCreateWallet(toUserId);

  if (fromWallet.escrowBalance < amount) {
    throw new Error('Insufficient escrow balance');
  }

  const platformFee = amount * 0.025; // 2.5% platform fee
  const netAmount = amount - platformFee;

  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  
  // Create release transaction for payer
  const fromTransaction = {
    walletId: fromWallet.id,
    userId: fromUserId,
    type: 'escrow_release',
    amount,
    fee: platformFee,
    netAmount,
    currency: 'USD',
    status: 'completed',
    description: 'Escrow released for completed milestone',
    metadata: {
      agreementId,
      milestoneId,
      recipientId: toUserId,
    },
    balanceBefore: fromWallet.escrowBalance,
    balanceAfter: fromWallet.escrowBalance - amount,
    createdAt: serverTimestamp(),
    completedAt: serverTimestamp(),
  };

  // Create deposit transaction for payee
  const toTransaction = {
    walletId: toWallet.id,
    userId: toUserId,
    type: 'transfer',
    amount: netAmount,
    fee: 0,
    netAmount,
    currency: 'USD',
    status: 'completed',
    description: 'Payment received for completed work',
    metadata: {
      agreementId,
      milestoneId,
      senderId: fromUserId,
    },
    balanceBefore: toWallet.balance,
    balanceAfter: toWallet.balance + netAmount,
    createdAt: serverTimestamp(),
    completedAt: serverTimestamp(),
  };

  const [fromDocRef, toDocRef] = await Promise.all([
    addDoc(transactionsRef, fromTransaction),
    addDoc(transactionsRef, toTransaction),
  ]);

  // Update both wallets
  await runTransaction(db, async (t) => {
    const fromWalletRef = doc(db, COLLECTIONS.WALLETS, fromWallet.id);
    const toWalletRef = doc(db, COLLECTIONS.WALLETS, toWallet.id);

    const fromSnap = await t.get(fromWalletRef);
    const toSnap = await t.get(toWalletRef);

    t.update(fromWalletRef, {
      balance: (fromSnap.data()?.balance || 0) - amount,
      escrowBalance: (fromSnap.data()?.escrowBalance || 0) - amount,
      updatedAt: serverTimestamp(),
    });

    t.update(toWalletRef, {
      balance: (toSnap.data()?.balance || 0) + netAmount,
      availableBalance: (toSnap.data()?.availableBalance || 0) + netAmount,
      updatedAt: serverTimestamp(),
    });
  });

  return {
    fromTx: {
      id: fromDocRef.id,
      ...fromTransaction,
      createdAt: new Date(),
      completedAt: new Date(),
    } as WalletTransaction,
    toTx: {
      id: toDocRef.id,
      ...toTransaction,
      createdAt: new Date(),
      completedAt: new Date(),
    } as WalletTransaction,
  };
}

export async function getTransactionHistory(
  userId: string,
  options?: {
    limit?: number;
    type?: WalletTransaction['type'];
    startDate?: Date;
    endDate?: Date;
  }
): Promise<WalletTransaction[]> {
  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  let q = query(
    transactionsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  if (options?.type) {
    q = query(q, where('type', '==', options.type));
  }

  if (options?.startDate) {
    q = query(q, where('createdAt', '>=', Timestamp.fromDate(options.startDate)));
  }

  if (options?.endDate) {
    q = query(q, where('createdAt', '<=', Timestamp.fromDate(options.endDate)));
  }

  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  })) as WalletTransaction[];
}

// Bank account management
export async function addBankAccount(
  userId: string,
  bankDetails: {
    bankName: string;
    accountType: 'checking' | 'savings';
    accountNumber: string;
    routingNumber: string;
  }
): Promise<BankAccount> {
  const bankAccountsRef = collection(db, 'bankAccounts');
  
  // In production, this would use Stripe/Plaid for verification
  const bankAccount = {
    userId,
    bankName: bankDetails.bankName,
    accountType: bankDetails.accountType,
    last4: bankDetails.accountNumber.slice(-4),
    routingNumber: bankDetails.routingNumber,
    isDefault: false,
    isVerified: false, // Would be verified via micro-deposits
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(bankAccountsRef, bankAccount);

  // Set as default if first bank account
  const existingAccounts = await getDocs(
    query(bankAccountsRef, where('userId', '==', userId))
  );
  
  if (existingAccounts.size === 1) {
    await updateDoc(docRef, { isDefault: true });
    bankAccount.isDefault = true;
  }

  return {
    id: docRef.id,
    ...bankAccount,
    createdAt: new Date(),
  } as BankAccount;
}

export async function getBankAccounts(userId: string): Promise<BankAccount[]> {
  const bankAccountsRef = collection(db, 'bankAccounts');
  const q = query(
    bankAccountsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as BankAccount[];
}

export async function setDefaultBankAccount(
  userId: string,
  bankAccountId: string
): Promise<void> {
  const bankAccountsRef = collection(db, 'bankAccounts');
  
  // Remove default from all accounts
  const accounts = await getDocs(
    query(bankAccountsRef, where('userId', '==', userId))
  );
  
  const batch: Promise<void>[] = accounts.docs.map((docSnap) =>
    updateDoc(doc(db, 'bankAccounts', docSnap.id), { isDefault: false })
  );
  
  await Promise.all(batch);
  
  // Set new default
  await updateDoc(doc(db, 'bankAccounts', bankAccountId), { isDefault: true });
}

// Payment card management
export async function addPaymentCard(
  userId: string,
  stripePaymentMethodId: string,
  cardDetails: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  }
): Promise<PaymentCard> {
  const cardsRef = collection(db, 'paymentCards');
  
  const card = {
    userId,
    brand: cardDetails.brand,
    last4: cardDetails.last4,
    expiryMonth: cardDetails.expiryMonth,
    expiryYear: cardDetails.expiryYear,
    isDefault: false,
    stripePaymentMethodId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(cardsRef, card);

  // Set as default if first card
  const existingCards = await getDocs(
    query(cardsRef, where('userId', '==', userId))
  );
  
  if (existingCards.size === 1) {
    await updateDoc(docRef, { isDefault: true });
    card.isDefault = true;
  }

  return {
    id: docRef.id,
    ...card,
    createdAt: new Date(),
  } as PaymentCard;
}

export async function getPaymentCards(userId: string): Promise<PaymentCard[]> {
  const cardsRef = collection(db, 'paymentCards');
  const q = query(
    cardsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as PaymentCard[];
}

export async function removePaymentMethod(
  type: 'bank' | 'card',
  id: string
): Promise<void> {
  const collectionName = type === 'bank' ? 'bankAccounts' : 'paymentCards';
  const docRef = doc(db, collectionName, id);
  
  // In production, also remove from Stripe
  await updateDoc(docRef, { 
    isActive: false,
    deletedAt: serverTimestamp() 
  });
}
