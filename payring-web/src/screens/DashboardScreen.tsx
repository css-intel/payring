import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Send, 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bell,
  Zap,
  FolderOpen,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store';
import { APP_CONFIG } from '@payring/shared';

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user, wallet } = useAuthStore();

  // Mock data for demo
  const mockUser = user || {
    displayName: 'Alex Chen',
    username: '@alexc',
    avatarUrl: '',
  };

  const mockBalance = wallet?.balance.formatted || '$1,256.70';

  const quickActions = [
    { icon: Send, label: 'Send', color: 'bg-primary', route: '/payments?tab=send' },
    { icon: ArrowDownLeft, label: 'Request', color: 'bg-green-500', route: '/payments?tab=request' },
    { icon: Plus, label: 'Agreement', color: 'bg-purple-500', route: '/agreements/new' },
    { icon: FileText, label: 'Templates', color: 'bg-amber-500', route: '/templates' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Release money as work gets done',
      route: '/payments',
    },
    {
      icon: FileText,
      title: 'Smart Agreements',
      description: 'AI-powered contract generation',
      route: '/agreements/new',
    },
    {
      icon: Bell,
      title: 'Track & Notify',
      description: 'Real-time milestone updates',
      route: '/activity',
    },
    {
      icon: FolderOpen,
      title: 'Templates',
      description: 'Freelance, loans, sales & more',
      route: '/templates',
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'payment_received',
      title: 'Payment from Sarah',
      counterpartyName: 'Sarah Wilson',
      amount: { formatted: '$250.00', sign: '+' as const },
      status: 'completed',
      timestamp: { relative: '2h ago' },
    },
    {
      id: '2',
      type: 'milestone_completed',
      title: 'Milestone completed',
      counterpartyName: 'Web Design Project',
      amount: { formatted: '$500.00', sign: '+' as const },
      status: 'completed',
      timestamp: { relative: '5h ago' },
    },
    {
      id: '3',
      type: 'payment_sent',
      title: 'Payment to Mike',
      counterpartyName: 'Mike Johnson',
      amount: { formatted: '$75.00', sign: '-' as const },
      status: 'completed',
      timestamp: { relative: '1d ago' },
    },
  ];

  // Mock active agreements
  const activeAgreements = [
    {
      id: '1',
      title: 'Website Redesign',
      counterpartyName: 'Tech Startup Inc',
      progressPercent: 66,
      milestonesLabel: '2/3',
      totalValueFormatted: '$3,000',
    },
    {
      id: '2',
      title: 'Logo Design Package',
      counterpartyName: 'Coffee Shop Co',
      progressPercent: 33,
      milestonesLabel: '1/3',
      totalValueFormatted: '$450',
    },
  ];

  return (
    <div className="pb-24 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white px-4 pt-12 pb-8 -mx-4 -mt-4 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar 
              name={mockUser.displayName} 
              imageUrl={mockUser.avatarUrl} 
              size="lg"
            />
            <div>
              <p className="text-white/80 text-sm">Welcome back,</p>
              <h1 className="text-xl font-bold">{mockUser.displayName}</h1>
            </div>
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Balance Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-white/70 text-sm mb-1">Available Balance</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-white">{mockBalance}</h2>
              <div className="flex items-center gap-1 text-green-300 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-white`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">FEATURES</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="cursor-pointer hover:shadow-payring-lg transition-shadow"
              onClick={() => navigate(feature.route)}
            >
              <CardContent className="p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Agreements */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">ACTIVE AGREEMENTS</h3>
          <button 
            onClick={() => navigate('/agreements')}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {activeAgreements.map((agreement) => (
            <Card 
              key={agreement.id}
              className="cursor-pointer hover:shadow-payring-lg transition-shadow"
              onClick={() => navigate(`/agreements/${agreement.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{agreement.title}</h4>
                    <p className="text-sm text-muted-foreground">{agreement.counterpartyName}</p>
                  </div>
                  <Badge variant="info">{agreement.milestonesLabel}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={agreement.progressPercent} className="flex-1" />
                  <span className="text-sm font-medium">{agreement.progressPercent}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Total: {agreement.totalValueFormatted}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">RECENT ACTIVITY</h3>
          <button 
            onClick={() => navigate('/activity')}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.amount.sign === '+' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {item.amount.sign === '+' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.timestamp.relative}</p>
                </div>
                <span className={`font-semibold ${
                  item.amount.sign === '+' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.amount.sign}{item.amount.formatted}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tagline */}
      <div className="px-4 mt-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          {APP_CONFIG.tagline}
        </p>
      </div>
    </div>
  );
}
