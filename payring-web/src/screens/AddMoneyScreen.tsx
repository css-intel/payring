/**
 * Add Money Screen
 * Add funds to wallet via bank, card, or other methods
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Smartphone,
  Plus,
  Check,
  Shield,
  Lock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'card' | 'mobile';
  name: string;
  last4: string;
  icon: 'bank' | 'card' | 'phone';
  isDefault: boolean;
}

export function AddMoneyScreen() {
  const navigate = useNavigate();
  useAuthStore(); // For authentication check
  
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'amount' | 'method' | 'confirm'>('amount');

  // Mock payment methods - would come from user's saved methods
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', name: 'Visa', last4: '4242', icon: 'card', isDefault: true },
    { id: '2', type: 'bank', name: 'Chase Bank', last4: '6789', icon: 'bank', isDefault: false },
    { id: '3', type: 'card', name: 'Mastercard', last4: '5555', icon: 'card', isDefault: false },
  ]);

  const quickAmounts = [25, 50, 100, 250, 500, 1000];
  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount > 0 ? Math.max(0.25, numericAmount * 0.015) : 0; // 1.5% min $0.25
  const total = numericAmount + fee;

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const getMethodIcon = (icon: string) => {
    switch (icon) {
      case 'bank':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'phone':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleContinue = () => {
    if (step === 'amount' && numericAmount > 0) {
      setStep('method');
    } else if (step === 'method' && selectedMethod) {
      setStep('confirm');
    }
  };

  const handleAddMoney = async () => {
    if (!selectedMethod || numericAmount <= 0) return;

    setProcessing(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, would call wallet service
      // await addFunds({ amount: numericAmount, methodId: selectedMethod });
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add money');
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
          <h1 className="text-2xl font-bold mb-2">Money Added!</h1>
          <p className="text-muted-foreground mb-6">
            ${numericAmount.toFixed(2)} has been added to your wallet
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
              if (step === 'method') setStep('amount');
              else if (step === 'confirm') setStep('method');
              else navigate(-1);
            }}
            className="p-2 -ml-2 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add Money</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {['amount', 'method', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                ['amount', 'method', 'confirm'].indexOf(step) >= i
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
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Enter the amount you want to add
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
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  amount === value.toString()
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                ${value}
              </button>
            ))}
          </div>

          {/* Fee breakdown */}
          {numericAmount > 0 && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span>${numericAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing fee (1.5%)</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total charge</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleContinue}
            disabled={numericAmount <= 0}
            className="w-full py-6"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 'method' && (
        <div className="px-4 space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Select a payment method
            </p>
            <p className="text-2xl font-bold mt-2">${numericAmount.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getMethodIcon(method.icon)}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          •••• {method.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      {selectedMethod === method.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add new method */}
            <Card className="cursor-pointer hover:border-primary/50" onClick={() => navigate('/settings/payment-methods')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium">Add new payment method</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleContinue}
            disabled={!selectedMethod}
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
              <p className="text-sm text-muted-foreground mb-2">Adding to wallet</p>
              <p className="text-4xl font-bold mb-1">${numericAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Total charge: ${total.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Payment Method</h3>
              {selectedMethod && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getMethodIcon(paymentMethods.find(m => m.id === selectedMethod)?.icon || 'card')}
                  </div>
                  <div>
                    <p className="font-medium">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      •••• {paymentMethods.find(m => m.id === selectedMethod)?.last4}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Encrypted</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button 
            onClick={handleAddMoney}
            disabled={processing}
            className="w-full py-6"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Add $${numericAmount.toFixed(2)}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddMoneyScreen;
