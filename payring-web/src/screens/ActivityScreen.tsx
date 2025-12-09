import { ArrowUpRight, ArrowDownLeft, FileText, CheckCircle, Clock, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/avatar';
import { useActivityStore } from '@/store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ActivityFilter = 'all' | 'payments' | 'agreements' | 'milestones';

export function ActivityScreen() {
  const [filter, setFilter] = useState<ActivityFilter>('all');

  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'payment_received',
      title: 'Payment received',
      description: 'From Sarah Wilson',
      amount: '+$250.00',
      amountColor: 'text-green-600',
      icon: ArrowDownLeft,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      timestamp: '2 hours ago',
      isNew: true,
    },
    {
      id: '2',
      type: 'milestone_completed',
      title: 'Milestone completed',
      description: 'Design mockups approved',
      amount: '+$500.00',
      amountColor: 'text-green-600',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      timestamp: '5 hours ago',
      isNew: true,
    },
    {
      id: '3',
      type: 'payment_sent',
      title: 'Payment sent',
      description: 'To Mike Johnson',
      amount: '-$75.00',
      amountColor: 'text-red-600',
      icon: ArrowUpRight,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      timestamp: '1 day ago',
      isNew: false,
    },
    {
      id: '4',
      type: 'agreement_created',
      title: 'Agreement created',
      description: 'Website Redesign with Tech Startup',
      amount: '$3,000.00',
      amountColor: 'text-foreground',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      timestamp: '2 days ago',
      isNew: false,
    },
    {
      id: '5',
      type: 'milestone_due',
      title: 'Milestone due soon',
      description: 'Development phase - 3 days left',
      amount: '$1,000.00',
      amountColor: 'text-amber-600',
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      timestamp: '3 days ago',
      isNew: false,
    },
    {
      id: '6',
      type: 'payment_received',
      title: 'Payment received',
      description: 'From Coffee Shop Co',
      amount: '+$150.00',
      amountColor: 'text-green-600',
      icon: ArrowDownLeft,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      timestamp: '1 week ago',
      isNew: false,
    },
  ];

  const filters: { value: ActivityFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'payments', label: 'Payments' },
    { value: 'agreements', label: 'Agreements' },
    { value: 'milestones', label: 'Milestones' },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true;
    if (filter === 'payments') return activity.type.includes('payment');
    if (filter === 'agreements') return activity.type.includes('agreement');
    if (filter === 'milestones') return activity.type.includes('milestone');
    return true;
  });

  const newCount = activities.filter((a) => a.isNew).length;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Activity</h1>
          {newCount > 0 && (
            <Badge variant="info">{newCount} new</Badge>
          )}
        </div>
        <p className="text-muted-foreground">Your recent transactions and updates</p>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                  activity.isNew && 'bg-primary/5'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    activity.iconBg
                  )}
                >
                  <activity.icon className={cn('w-5 h-5', activity.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {activity.isNew && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={cn('font-semibold text-sm', activity.amountColor)}>
                    {activity.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Load More */}
      <div className="px-4 mt-4 text-center">
        <button className="text-sm text-primary font-medium">
          Load more activity
        </button>
      </div>
    </div>
  );
}
