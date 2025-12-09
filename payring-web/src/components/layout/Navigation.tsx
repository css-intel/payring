import { NavLink, useLocation } from 'react-router-dom';
import { Home, DollarSign, FileText, Activity, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '@/store';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/payments', icon: DollarSign, label: 'Pay' },
  { to: '/agreements', icon: FileText, label: 'Deals' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNavigation() {
  const location = useLocation();
  const { unreadCount } = useNotificationsStore();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to || 
          (item.to !== '/' && location.pathname.startsWith(item.to));
        
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn('bottom-nav-item relative', isActive && 'active')}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
            {item.to === '/activity' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

// Header with notifications bell
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  const { unreadCount } = useNotificationsStore();

  return (
    <header className="screen-header flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      
      <NavLink to="/notifications" className="relative p-2 hover:bg-muted rounded-lg">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </NavLink>
    </header>
  );
}
