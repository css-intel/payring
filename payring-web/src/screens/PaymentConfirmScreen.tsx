/**
 * Payment Confirmation Screen
 * Confirm and process send/request payment
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, ArrowDownLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import { sendPayment, requestPayment } from '../services/payments.service';

interface PaymentState {
  type: 'send' | 'request';
  amount: string;
  recipient: string;
  recipientName?: string;
  recipientUsername?: string;
  note?: string;
}

export function PaymentConfirmScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const paymentData = location.state as PaymentState | null;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Payment</h2>
          <p className="text-muted-foreground mb-4">No payment details found</p>
          <Button onClick={() => navigate('/payments')}>Back to Payments</Button>
        </div>
      </div>
    );
  }

  const { type, amount, recipient, recipientName, recipientUsername, note } = paymentData;
  const amountCents = Math.round(parseFloat(amount) * 100);
  const isSend = type === 'send';

  const handleConfirm = async () => {
    if (!user) {
      setError('You must be logged in');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (isSend) {
        await sendPayment({
          receiverId: recipient,
          amountCents,
          currency: 'USD',
          note: note || undefined,
        });
      } else {
        await requestPayment({
          fromUserId: recipient,
          amountCents,
          currency: 'USD',
          note: note || undefined,
        });
      }
      
      setIsComplete(true);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-600 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce-in">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isSend ? 'Payment Sent!' : 'Request Sent!'}
        </h1>
        <p className="text-white/80 text-center mb-8">
          {isSend 
            ? `You sent $${amount} to ${recipientName || recipient}`
            : `Payment request of $${amount} sent to ${recipientName || recipient}`
          }
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-white text-green-600 hover:bg-white/90"
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/payments')} 
            variant="outline"
            className="w-full border-white text-white hover:bg-white/10"
          >
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Confirm {isSend ? 'Payment' : 'Request'}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Payment Summary Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Icon */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isSend ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {isSend ? (
                <Send className="w-8 h-8 text-indigo-600" />
              ) : (
                <ArrowDownLeft className="w-8 h-8 text-green-600" />
              )}
            </div>

            {/* Amount */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                {isSend ? 'You are sending' : 'You are requesting'}
              </p>
              <h2 className="text-4xl font-bold">${parseFloat(amount).toFixed(2)}</h2>
              <p className="text-sm text-muted-foreground mt-1">USD</p>
            </div>

            {/* Recipient */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={recipientName || recipient} size="md" />
                <div>
                  <p className="font-medium">{recipientName || 'PayRing User'}</p>
                  <p className="text-sm text-muted-foreground">
                    {recipientUsername || recipient}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${isSend ? 'text-red-500' : 'text-green-500'}`}>
                {isSend ? '- ' : '+ '}${amount}
              </span>
            </div>

            {/* Note */}
            {note && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Note</p>
                <p className="text-sm">{note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fee Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span>${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">PayRing Fee</span>
              <span className="text-green-600">$0.00</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>${parseFloat(amount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full h-14 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isSend ? 'Confirm & Send' : 'Send Request'}
            </>
          )}
        </Button>

        {/* Security Note */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          🔒 Secured by PayRing. Your transaction is protected.
        </p>
      </main>
    </div>
  );
}

export default PaymentConfirmScreen;
