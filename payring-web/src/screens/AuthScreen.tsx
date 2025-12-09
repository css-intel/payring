import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { getFirebaseAuth } from '@payring/shared';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { APP_CONFIG } from '@payring/shared';

export function AuthScreen() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const auth = getFirebaseAuth();

      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set user in store
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || 'New User',
          username: `@${email.split('@')[0]}`,
          kycStatus: 'incomplete',
          accountTier: 'basic',
          isActive: true,
          connectedBanks: [],
          paymentMethods: [],
          preferences: {
            theme: 'system',
            notifications: { email: true, push: true, sms: false },
            privacy: { profileVisibility: 'public', transactionHistory: 'visible' },
            security: { twoFactorEnabled: false, biometricEnabled: false },
          },
          limits: {
            dailyTransactionLimit: { amountMinor: 100000, currency: 'USD', formatted: '$1,000' },
            weeklyTransactionLimit: { amountMinor: 500000, currency: 'USD', formatted: '$5,000' },
            monthlyTransactionLimit: { amountMinor: 1000000, currency: 'USD', formatted: '$10,000' },
            maxAgreementValue: { amountMinor: 500000, currency: 'USD', formatted: '$5,000' },
          },
          metrics: {
            completedAgreements: 0,
            totalEarned: { amountMinor: 0, currency: 'USD', formatted: '$0' },
            totalSpent: { amountMinor: 0, currency: 'USD', formatted: '$0' },
            satisfactionRating: 0,
            averageResponseTime: 'N/A',
          },
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Set user in store (would normally fetch full profile from Firestore)
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || 'User',
          username: `@${email.split('@')[0]}`,
          kycStatus: 'approved',
          accountTier: 'verified',
          isActive: true,
          connectedBanks: [],
          paymentMethods: [],
          preferences: {
            theme: 'system',
            notifications: { email: true, push: true, sms: false },
            privacy: { profileVisibility: 'public', transactionHistory: 'visible' },
            security: { twoFactorEnabled: false, biometricEnabled: false },
          },
          limits: {
            dailyTransactionLimit: { amountMinor: 1000000, currency: 'USD', formatted: '$10,000' },
            weeklyTransactionLimit: { amountMinor: 5000000, currency: 'USD', formatted: '$50,000' },
            monthlyTransactionLimit: { amountMinor: 20000000, currency: 'USD', formatted: '$200,000' },
            maxAgreementValue: { amountMinor: 5000000, currency: 'USD', formatted: '$50,000' },
          },
          metrics: {
            completedAgreements: 5,
            totalEarned: { amountMinor: 1256700, currency: 'USD', formatted: '$12,567' },
            totalSpent: { amountMinor: 345000, currency: 'USD', formatted: '$3,450' },
            satisfactionRating: 98,
            averageResponseTime: '< 1 hour',
          },
          createdAt: '2024-01-15T10:30:00Z',
          lastActiveAt: new Date().toISOString(),
        });
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo mode - skip auth
  const handleDemoMode = () => {
    setUser({
      id: 'demo_user_001',
      email: 'demo@payring.com',
      displayName: 'Demo User',
      username: '@demo',
      kycStatus: 'approved',
      accountTier: 'verified',
      isActive: true,
      connectedBanks: [],
      paymentMethods: [],
      preferences: {
        theme: 'system',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', transactionHistory: 'visible' },
        security: { twoFactorEnabled: false, biometricEnabled: false },
      },
      limits: {
        dailyTransactionLimit: { amountMinor: 1000000, currency: 'USD', formatted: '$10,000' },
        weeklyTransactionLimit: { amountMinor: 5000000, currency: 'USD', formatted: '$50,000' },
        monthlyTransactionLimit: { amountMinor: 20000000, currency: 'USD', formatted: '$200,000' },
        maxAgreementValue: { amountMinor: 5000000, currency: 'USD', formatted: '$50,000' },
      },
      metrics: {
        completedAgreements: 12,
        totalEarned: { amountMinor: 1256700, currency: 'USD', formatted: '$12,567' },
        totalSpent: { amountMinor: 345000, currency: 'USD', formatted: '$3,450' },
        satisfactionRating: 98,
        averageResponseTime: '< 1 hour',
      },
      createdAt: '2024-01-15T10:30:00Z',
      lastActiveAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-background">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">P</span>
        </div>
        <h1 className="text-3xl font-bold">{APP_CONFIG.name}</h1>
        <p className="text-muted-foreground mt-2">{APP_CONFIG.tagline}</p>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {/* Tab Selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="pl-12"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Mode */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDemoMode}
          >
            Continue as Demo User
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-8 text-center">
        By continuing, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
}
