import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNavigation } from '@/components/layout/Navigation';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { PaymentsScreen } from '@/screens/PaymentsScreen';
import { AgreementsScreen } from '@/screens/AgreementsScreen';
import { NewAgreementScreen } from '@/screens/NewAgreementScreen';
import { ActivityScreen } from '@/screens/ActivityScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SecurityScreen } from '@/screens/SecurityScreen';
import { AppearanceScreen } from '@/screens/AppearanceScreen';
import { useAuthStore, useUIStore } from '@/store';

// Layout wrapper for authenticated pages
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-container">
      <main className="p-4 pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  const { theme, setTheme } = useUIStore();
  const { setLoading } = useAuthStore();

  // Apply theme on mount
  useEffect(() => {
    setTheme(theme);
    setLoading(false);
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthScreen />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/confirm"
        element={
          <ProtectedRoute>
            <div className="p-4">Payment Confirmation Screen (TODO)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements"
        element={
          <ProtectedRoute>
            <AgreementsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/new"
        element={
          <ProtectedRoute>
            <NewAgreementScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/:id"
        element={
          <ProtectedRoute>
            <div className="p-4">Agreement Detail Screen (TODO)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/preview"
        element={
          <ProtectedRoute>
            <div className="p-4">AI Preview Screen (TODO)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/template"
        element={
          <ProtectedRoute>
            <div className="p-4">Template Screen (TODO)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <NewAgreementScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <ActivityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/security"
        element={
          <ProtectedRoute>
            <SecurityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/appearance"
        element={
          <ProtectedRoute>
            <AppearanceScreen />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
