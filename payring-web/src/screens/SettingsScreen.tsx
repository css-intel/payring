import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  CreditCard,
  Palette,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Bell,
  FileText,
  Wallet,
  Scale,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import { APP_CONFIG } from '@payring/shared';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Mock user for demo
  const mockUser = user || {
    displayName: 'Alex Chen',
    username: '@alexc',
    email: 'alex@example.com',
    avatarUrl: '',
    accountTier: 'verified',
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Edit your personal information',
          route: '/settings/profile',
        },
        {
          icon: Shield,
          label: 'Security',
          description: 'Password, 2FA, and privacy',
          route: '/settings/security',
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Email, push, and SMS preferences',
          route: '/settings/notifications',
        },
      ],
    },
    {
      title: 'Payments',
      items: [
        {
          icon: Wallet,
          label: 'Wallet',
          description: 'Balance, deposits, and withdrawals',
          route: '/wallet',
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage linked banks and cards',
          route: '/wallet',
        },
        {
          icon: FileText,
          label: 'Transaction History',
          description: 'View all your transactions',
          route: '/wallet',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Palette,
          label: 'Appearance',
          description: 'Theme and display settings',
          route: '/settings/appearance',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'FAQs and support articles',
          route: '/help',
        },
        {
          icon: Scale,
          label: 'Legal',
          description: 'Terms, Privacy, and Refund Policy',
          route: '/terms',
        },
        {
          icon: Info,
          label: 'About PayRing',
          description: `Version ${APP_CONFIG.version}`,
          route: '/help',
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-6">
        <Card
          className="cursor-pointer hover:shadow-payring-lg transition-shadow"
          onClick={() => navigate('/settings/profile')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <UserAvatar name={mockUser.displayName} imageUrl={mockUser.avatarUrl} size="xl" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{mockUser.displayName}</h3>
                <p className="text-sm text-muted-foreground">{mockUser.username}</p>
                <p className="text-xs text-muted-foreground">{mockUser.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="px-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {section.title.toUpperCase()}
            </h3>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.route);
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card>
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-destructive/10 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Log Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-4 mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          {APP_CONFIG.tagline}
        </p>
      </div>
    </div>
  );
}
