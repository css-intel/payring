import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AGREEMENT_TYPES, calculateProgress } from '@payring/shared';
import type { AgreementStatus } from '@payring/shared';

type FilterType = 'all' | 'active' | 'completed' | 'draft';

export function AgreementsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Mock agreements data
  const agreements = [
    {
      id: '1',
      title: 'Website Redesign',
      type: 'freelance' as const,
      counterparty: 'Tech Startup Inc',
      status: 'in_progress' as AgreementStatus,
      completedMilestones: 2,
      totalMilestones: 3,
      totalValue: '$3,000',
      updatedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'Logo Design Package',
      type: 'creative' as const,
      counterparty: 'Coffee Shop Co',
      status: 'in_progress' as AgreementStatus,
      completedMilestones: 1,
      totalMilestones: 3,
      totalValue: '$450',
      updatedAt: '1 week ago',
    },
    {
      id: '3',
      title: 'Personal Loan',
      type: 'loan' as const,
      counterparty: 'John Smith',
      status: 'active' as AgreementStatus,
      completedMilestones: 3,
      totalMilestones: 6,
      totalValue: '$1,200',
      updatedAt: '3 days ago',
    },
    {
      id: '4',
      title: 'Mobile App Development',
      type: 'freelance' as const,
      counterparty: 'FinanceApp LLC',
      status: 'completed' as AgreementStatus,
      completedMilestones: 5,
      totalMilestones: 5,
      totalValue: '$8,500',
      updatedAt: '2 weeks ago',
    },
    {
      id: '5',
      title: 'Marketing Consultation',
      type: 'freelance' as const,
      counterparty: 'GrowthCo',
      status: 'draft' as AgreementStatus,
      completedMilestones: 0,
      totalMilestones: 4,
      totalValue: '$2,000',
      updatedAt: 'Draft',
    },
  ];

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Drafts' },
  ];

  const filteredAgreements = agreements.filter((agreement) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !agreement.title.toLowerCase().includes(searchLower) &&
        !agreement.counterparty.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Status filter
    if (filter === 'all') return true;
    if (filter === 'active') return ['active', 'in_progress'].includes(agreement.status);
    if (filter === 'completed') return agreement.status === 'completed';
    if (filter === 'draft') return agreement.status === 'draft';
    return true;
  });

  // Stats
  const stats = {
    total: agreements.length,
    active: agreements.filter((a) => ['active', 'in_progress'].includes(a.status)).length,
    completed: agreements.filter((a) => a.status === 'completed').length,
    totalEarned: '$12,150',
  };

  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
      case 'active':
        return <Badge variant="info">Active</Badge>;
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      case 'pending_signatures':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Agreements</h1>
            <p className="text-muted-foreground">Manage your contracts</p>
          </div>
          <Button onClick={() => navigate('/agreements/new')} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{stats.totalEarned}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agreements..."
            className="pl-10"
          />
        </div>
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

      {/* Agreements List */}
      <div className="px-4 space-y-3">
        {filteredAgreements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No agreements found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? 'Try a different search term' : 'Create your first agreement'}
              </p>
              <Button onClick={() => navigate('/agreements/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Agreement
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAgreements.map((agreement) => {
            const typeConfig = AGREEMENT_TYPES[agreement.type as keyof typeof AGREEMENT_TYPES];
            const progress = calculateProgress(
              agreement.completedMilestones,
              agreement.totalMilestones
            );

            return (
              <Card
                key={agreement.id}
                className="cursor-pointer hover:shadow-payring-lg transition-shadow"
                onClick={() => navigate(`/agreements/${agreement.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${typeConfig?.color}20` }}
                    >
                      {typeConfig?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold truncate">{agreement.title}</h3>
                        {getStatusBadge(agreement.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {agreement.counterparty}
                      </p>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground">
                          {agreement.completedMilestones}/{agreement.totalMilestones}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium">{agreement.totalValue}</span>
                        <span className="text-xs text-muted-foreground">
                          {agreement.updatedAt}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
