import { useState } from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2,
  Clock,
  ChevronRight,
  Shield,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store';

// Mock data - in production, these would come from the wallet service
const mockWalletData = {
  balance: 2450.00,
  available: 2200.00,
  pending: 150.00,
  escrow: 100.00,
  currency: 'USD',
};

const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 500.00,
    description: 'Deposit from Visa •••• 4242',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'completed',
  },
  {
    id: '2',
    type: 'escrow_hold',
    amount: -100.00,
    description: 'Escrow for Project with @johndoe',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed',
  },
  {
    id: '3',
    type: 'transfer',
    amount: 750.00,
    description: 'Payment received from @sarahk',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'completed',
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: -200.00,
    description: 'Withdrawal to Bank •••• 1234',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'pending',
  },
  {
    id: '5',
    type: 'fee',
    amount: -12.50,
    description: 'Platform fee - Agreement #1234',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96),
    status: 'completed',
  },
];

const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  },
  {
    id: '2',
    type: 'bank',
    bankName: 'Chase',
    last4: '1234',
    accountType: 'checking',
    isDefault: false,
  },
];

export function WalletScreen() {
  const navigate = useNavigate();
  useAuthStore();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return diffHours === 0 ? 'Just now' : `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'transfer':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'escrow_hold':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'escrow_release':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'fee':
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              <h1 className="text-xl font-bold">Wallet</h1>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <p className="text-white/80 text-sm mb-1">Total Balance</p>
            <p className="text-4xl font-bold mb-4">{formatCurrency(mockWalletData.balance)}</p>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/60">Available</p>
                <p className="font-semibold">{formatCurrency(mockWalletData.available)}</p>
              </div>
              <div>
                <p className="text-white/60">Pending</p>
                <p className="font-semibold">{formatCurrency(mockWalletData.pending)}</p>
              </div>
              <div>
                <p className="text-white/60">In Escrow</p>
                <p className="font-semibold">{formatCurrency(mockWalletData.escrow)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <Button 
              onClick={() => setShowAddFunds(true)}
              className="flex-1 bg-white text-purple-700 hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button 
              onClick={() => setShowWithdraw(true)}
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white/10"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Payment Methods */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
            <Button variant="ghost" size="sm" className="text-purple-600">
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockPaymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method.type === 'card' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {method.type === 'card' ? (
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Building2 className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method.type === 'card' 
                      ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                      : `${method.accountType} account`
                    }
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="text-purple-600">
              View All
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.status === 'pending' && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Escrow Protection</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Funds in escrow are protected until work is approved. Safe for both parties.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Pending Balance</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Pending funds will be available after transactions are confirmed (1-3 days).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Funds</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 text-2xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                {mockPaymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <input type="radio" name="payment" defaultChecked={method.isDefault} className="text-purple-600" />
                    <div className="flex items-center gap-2">
                      {method.type === 'card' ? (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Building2 className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-900 dark:text-white">
                        {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddFunds(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Add {amount ? formatCurrency(parseFloat(amount)) : 'Funds'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Withdraw Funds</h2>
            
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Available to withdraw</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockWalletData.available)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={mockWalletData.available}
                  className="w-full pl-10 pr-4 py-3 text-2xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setAmount(mockWalletData.available.toString())}
                className="text-sm text-purple-600 mt-2 hover:underline"
              >
                Withdraw max
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdraw to
              </label>
              <div className="space-y-2">
                {mockPaymentMethods
                  .filter((m) => m.type === 'bank')
                  .map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <input type="radio" name="withdraw" defaultChecked className="text-purple-600" />
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {method.bankName} •••• {method.last4}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              <p>• Withdrawal fee: 1% (max $5)</p>
              <p>• Processing time: 1-3 business days</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowWithdraw(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Withdraw {amount ? formatCurrency(parseFloat(amount)) : 'Funds'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
