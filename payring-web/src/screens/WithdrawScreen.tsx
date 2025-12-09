/**
 * Withdraw Money Screen
 * Withdraw funds from wallet to bank or other destinations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Clock,
  Zap,
  Check,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  last4: string;
  isDefault: boolean;
}

interface TransferSpeed {
  id: 'instant' | 'standard';
  name: string;
  description: string;
  fee: number;
  time: string;
}

export function WithdrawScreen() {
  const navigate = useNavigate();
  useAuthStore(); // For authentication check
  
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<'instant' | 'standard'>('standard');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'amount' | 'bank' | 'confirm'>('amount');

  // Mock wallet balance
  const walletBalance = 1250.00;

  // Mock bank accounts
  const [bankAccounts] = useState<BankAccount[]>([
    { id: '1', bankName: 'Chase Bank', accountType: 'checking', last4: '4567', isDefault: true },
    { id: '2', bankName: 'Bank of America', accountType: 'savings', last4: '8901', isDefault: false },
  ]);

  const transferSpeeds: TransferSpeed[] = [
    {
      id: 'instant',
      name: 'Instant',
      description: 'Transfer in minutes',
      fee: 1.75, // 1.75% fee
      time: '1-30 minutes'
    },
    {
      id: 'standard',
      name: 'Standard',
      description: '1-3 business days',
      fee: 0,
      time: '1-3 business days'
    }
  ];

  const numericAmount = parseFloat(amount) || 0;
  const speedFee = selectedSpeed === 'instant' ? numericAmount * 0.0175 : 0;
  const totalWithdrawal = numericAmount + speedFee;

  const handleMaxAmount = () => {
    setAmount(walletBalance.toFixed(2));
  };

  const handleContinue = () => {
    if (step === 'amount' && numericAmount > 0 && numericAmount <= walletBalance) {
      setStep('bank');
    } else if (step === 'bank' && selectedBank) {
      setStep('confirm');
    }
  };

  const handleWithdraw = async () => {
    if (!selectedBank || numericAmount <= 0) return;

    setProcessing(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, would call wallet service
      // await withdrawFunds({ amount: numericAmount, bankId: selectedBank, speed: selectedSpeed });
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Withdrawal Initiated!</h1>
          <p className="text-muted-foreground mb-2">
            ${numericAmount.toFixed(2)} is on its way to your bank
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {selectedSpeed === 'instant' 
              ? 'Expected arrival: 1-30 minutes' 
              : 'Expected arrival: 1-3 business days'}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/wallet')} className="w-full">
              View Wallet
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (step === 'bank') setStep('amount');
              else if (step === 'confirm') setStep('bank');
              else navigate(-1);
            }}
            className="p-2 -ml-2 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Withdraw</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {['amount', 'bank', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                ['amount', 'bank', 'confirm'].indexOf(step) >= i
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Amount */}
      {step === 'amount' && (
        <div className="px-4 space-y-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <p className="text-sm opacity-80">Available Balance</p>
              <p className="text-2xl font-bold">${walletBalance.toFixed(2)}</p>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Enter the amount you want to withdraw
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold">$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-4xl font-bold text-center border-0 w-48 focus-visible:ring-0"
              />
            </div>
            <button
              onClick={handleMaxAmount}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Withdraw max
            </button>
          </div>

          {/* Validation messages */}
          {numericAmount > walletBalance && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Amount exceeds available balance</span>
            </div>
          )}

          {/* Transfer Speed Selection */}
          {numericAmount > 0 && numericAmount <= walletBalance && (
            <div className="space-y-3">
              <h3 className="font-medium">Transfer Speed</h3>
              {transferSpeeds.map((speed) => (
                <Card
                  key={speed.id}
                  className={`cursor-pointer transition-all ${
                    selectedSpeed === speed.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedSpeed(speed.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          speed.id === 'instant' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          {speed.id === 'instant' ? (
                            <Zap className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{speed.name}</p>
                          <p className="text-sm text-muted-foreground">{speed.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${speed.fee === 0 ? 'text-green-600' : ''}`}>
                          {speed.fee === 0 ? 'Free' : `$${(numericAmount * speed.fee).toFixed(2)}`}
                        </p>
                        {speed.fee > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {speed.fee * 100}% fee
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button 
            onClick={handleContinue}
            disabled={numericAmount <= 0 || numericAmount > walletBalance}
            className="w-full py-6"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Bank Selection */}
      {step === 'bank' && (
        <div className="px-4 space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Withdrawing to bank account
            </p>
            <p className="text-2xl font-bold mt-2">${numericAmount.toFixed(2)}</p>
            {speedFee > 0 && (
              <p className="text-sm text-muted-foreground">
                + ${speedFee.toFixed(2)} instant transfer fee
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Select Bank Account</h3>
            {bankAccounts.map((bank) => (
              <Card
                key={bank.id}
                className={`cursor-pointer transition-all ${
                  selectedBank === bank.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedBank(bank.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{bank.bankName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {bank.accountType} •••• {bank.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {bank.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      {selectedBank === bank.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add bank */}
            <Card className="cursor-pointer hover:border-primary/50" onClick={() => navigate('/settings/bank-accounts')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium">Link a new bank account</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleContinue}
            disabled={!selectedBank}
            className="w-full py-6"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <div className="px-4 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Withdrawing</p>
              <p className="text-4xl font-bold mb-1">${numericAmount.toFixed(2)}</p>
              {speedFee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Fee: ${speedFee.toFixed(2)} • Total: ${totalWithdrawal.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Destination</h3>
                {selectedBank && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {bankAccounts.find(b => b.id === selectedBank)?.bankName}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {bankAccounts.find(b => b.id === selectedBank)?.accountType} •••• {bankAccounts.find(b => b.id === selectedBank)?.last4}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm text-muted-foreground mb-2">Transfer Speed</h3>
                <div className="flex items-center gap-2">
                  {selectedSpeed === 'instant' ? (
                    <Zap className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="font-medium">
                    {selectedSpeed === 'instant' ? 'Instant (1-30 minutes)' : 'Standard (1-3 business days)'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Transfer timing</p>
              <p className="text-blue-700">
                {selectedSpeed === 'instant' 
                  ? 'Instant transfers typically arrive within 30 minutes but may take up to 1 hour.' 
                  : 'Standard transfers are processed within 1-3 business days depending on your bank.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button 
            onClick={handleWithdraw}
            disabled={processing}
            className="w-full py-6"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Withdraw $${numericAmount.toFixed(2)}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default WithdrawScreen;
