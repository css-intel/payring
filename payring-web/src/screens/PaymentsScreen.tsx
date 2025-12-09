import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, ArrowDownLeft, DollarSign, User, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { QUICK_AMOUNTS } from '@payring/shared';

export function PaymentsScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'request' ? 'request' : 'send';
  
  const [activeTab, setActiveTab] = useState<'send' | 'request'>(initialTab);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  // Mock recent contacts
  const recentContacts = [
    { id: '1', name: 'Sarah W.', username: '@sarah', avatar: '' },
    { id: '2', name: 'Mike J.', username: '@mikej', avatar: '' },
    { id: '3', name: 'Emily R.', username: '@emily', avatar: '' },
    { id: '4', name: 'David K.', username: '@davidk', avatar: '' },
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = () => {
    // Navigate to confirmation
    navigate('/payments/confirm', {
      state: {
        type: activeTab,
        amount,
        recipient,
        note,
      },
    });
  };

  const isValid = amount && parseFloat(amount) > 0 && recipient;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold mb-2">Instant Payments</h1>
        <p className="text-muted-foreground">Send or request money instantly</p>
      </div>

      {/* Tab Selector */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('send')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
              activeTab === 'send'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
              activeTab === 'request'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Request
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="px-4 mb-6">
        <Card className={cn(
          'border-2',
          activeTab === 'send' 
            ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/30 dark:border-green-800'
        )}>
          <CardContent className="p-6 text-center">
            <div className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
              activeTab === 'send' ? 'bg-primary/10' : 'bg-green-100 dark:bg-green-900/30'
            )}>
              {activeTab === 'send' ? (
                <Send className="w-8 h-8 text-primary" />
              ) : (
                <ArrowDownLeft className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">
              {activeTab === 'send' ? 'Send Money' : 'Request Money'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'send'
                ? 'Transfer money instantly to anyone with PayRing'
                : 'Request payment from clients or friends'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Amount Input */}
      <div className="px-4 mb-6">
        <label className="block text-sm font-semibold mb-2">Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-12 text-2xl font-bold h-16"
          />
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                amount === value.toString()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              ${value}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Input */}
      <div className="px-4 mb-6">
        <label className="block text-sm font-semibold mb-2">
          {activeTab === 'send' ? 'Send to' : 'Request from'}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Email, phone, or @username"
            className="pl-12"
          />
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="px-4 mb-6">
        <label className="block text-sm font-semibold mb-3">Recent Contacts</label>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setRecipient(contact.username)}
              className={cn(
                'flex flex-col items-center gap-2 p-2 rounded-xl transition-colors flex-shrink-0',
                recipient === contact.username ? 'bg-primary/10' : 'hover:bg-muted'
              )}
            >
              <UserAvatar name={contact.name} size="lg" />
              <span className="text-xs font-medium">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note Input */}
      <div className="px-4 mb-8">
        <label className="block text-sm font-semibold mb-2">Note (optional)</label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this for?"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-4">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="xl"
          className="w-full"
        >
          {activeTab === 'send' ? 'Send Payment' : 'Request Payment'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
