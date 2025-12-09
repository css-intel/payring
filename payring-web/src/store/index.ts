// ============================================================
//                   PAYRING GLOBAL STORE
// ============================================================
// Zustand store for global state management
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Wallet, Notification, ActivityItem, Agreement, Contact } from '@payring/shared';

// ==================== AUTH STORE ====================

interface AuthState {
  user: User | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setWallet: (wallet: Wallet | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setWallet: (wallet) => set({ wallet }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, wallet: null, isAuthenticated: false }),
    }),
    {
      name: 'payring-auth',
      partialize: (state) => ({ user: state.user, wallet: state.wallet }),
    }
  )
);

// ==================== UI STORE ====================

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  isSidebarOpen: boolean;
  activeTab: string;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isSidebarOpen: false,
      activeTab: 'dashboard',
      
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setActiveTab: (activeTab) => set({ activeTab }),
    }),
    {
      name: 'payring-ui',
    }
  )
);

// ==================== NOTIFICATIONS STORE ====================

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => set({ 
    notifications, 
    unreadCount: notifications.filter(n => !n.isRead).length 
  }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ 
      ...n, 
      isRead: true, 
      readAt: new Date().toISOString() 
    })),
    unreadCount: 0,
  })),
  
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// ==================== ACTIVITY STORE ====================

interface ActivityState {
  activities: ActivityItem[];
  isLoading: boolean;
  hasMore: boolean;
  
  // Actions
  setActivities: (activities: ActivityItem[]) => void;
  addActivity: (activity: ActivityItem) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: false,
  hasMore: true,
  
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities],
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
}));

// ==================== AGREEMENTS STORE ====================

interface AgreementsState {
  agreements: Agreement[];
  selectedAgreement: Agreement | null;
  isLoading: boolean;
  filter: 'all' | 'active' | 'completed' | 'draft';
  
  // Actions
  setAgreements: (agreements: Agreement[]) => void;
  setSelectedAgreement: (agreement: Agreement | null) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: 'all' | 'active' | 'completed' | 'draft') => void;
  updateAgreement: (id: string, updates: Partial<Agreement>) => void;
}

export const useAgreementsStore = create<AgreementsState>((set) => ({
  agreements: [],
  selectedAgreement: null,
  isLoading: false,
  filter: 'all',
  
  setAgreements: (agreements) => set({ agreements }),
  setSelectedAgreement: (selectedAgreement) => set({ selectedAgreement }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set({ filter }),
  updateAgreement: (id, updates) => set((state) => ({
    agreements: state.agreements.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ),
  })),
}));

// ==================== CONTACTS STORE ====================

interface ContactsState {
  contacts: Contact[];
  recentContacts: Contact[];
  isLoading: boolean;
  
  // Actions
  setContacts: (contacts: Contact[]) => void;
  setRecentContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  setLoading: (loading: boolean) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  recentContacts: [],
  isLoading: false,
  
  setContacts: (contacts) => set({ contacts }),
  setRecentContacts: (recentContacts) => set({ recentContacts }),
  addContact: (contact) => set((state) => ({
    contacts: [contact, ...state.contacts],
  })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ==================== COMBINED STORE HOOK ====================
// Convenience hook that combines auth state for use with Firebase hooks

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    useAuthStore.getState().setUser(user);
  },
  clearUser: () => {
    set({ user: null });
    useAuthStore.getState().logout();
  },
}));
