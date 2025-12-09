/**
 * QR Code Screen
 * Generate and scan QR codes for payments
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  QrCode, 
  Camera, 
  Copy, 
  Check,
  Share2,
  Download,
  Flashlight,
  SwitchCamera,
  User,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store';

export function QRCodeScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'mycode' | 'scan'>(() => 
    searchParams.get('tab') === 'scan' ? 'scan' : 'mycode'
  );
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{username: string; amount?: number} | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code data
  const qrData = JSON.stringify({
    type: 'payring',
    username: user?.email?.split('@')[0] || 'user',
    displayName: user?.displayName || 'User',
    amount: amount ? parseFloat(amount) : undefined,
    note: note || undefined,
  });

  // Generate QR code URL using a free QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  const copyPaymentLink = () => {
    const link = `https://payring.netlify.app/pay/@${user?.email?.split('@')[0]}${amount ? `?amount=${amount}` : ''}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pay me on PayRing',
          text: `Send me money on PayRing @${user?.email?.split('@')[0]}`,
          url: `https://payring.netlify.app/pay/@${user?.email?.split('@')[0]}`,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'payring-qrcode.png';
    link.click();
  };

  // Camera scanning simulation
  useEffect(() => {
    if (activeTab === 'scan' && scanning) {
      // In a real app, this would use a QR scanning library
      // For demo purposes, we'll simulate finding a QR code
      const timeout = setTimeout(() => {
        setScannedData({
          username: 'johnsmith',
          amount: 25.00
        });
        setScanning(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [activeTab, scanning]);

  const startScanning = async () => {
    setScanning(true);
    setScannedData(null);
    
    // Request camera access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handlePayScanned = () => {
    if (scannedData) {
      navigate('/payments/confirm', { 
        state: { 
          recipientUsername: scannedData.username,
          amount: scannedData.amount,
          type: 'send'
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">QR Code</h1>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
          <button
            onClick={() => { setActiveTab('mycode'); stopScanning(); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'mycode'
                ? 'bg-white text-indigo-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            My Code
          </button>
          <button
            onClick={() => { setActiveTab('scan'); startScanning(); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'scan'
                ? 'bg-white text-indigo-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Scan
          </button>
        </div>
      </div>

      {/* My Code Tab */}
      {activeTab === 'mycode' && (
        <div className="px-4 -mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <img 
                    src={qrCodeUrl} 
                    alt="Your QR Code" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <p className="text-lg font-semibold">{user?.displayName || 'Your Name'}</p>
                <p className="text-muted-foreground">@{user?.email?.split('@')[0] || 'username'}</p>
              </div>

              {/* Amount Input (Optional) */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Request specific amount (optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Note (optional)
                  </label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={copyPaymentLink}
                >
                  {copied ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Link</>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={shareQRCode}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadQRCode}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to receive money</h3>
            <ol className="text-sm text-blue-700 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Show this QR code to the sender</li>
              <li>They scan it with their PayRing app</li>
              <li>Money is instantly transferred to your wallet</li>
            </ol>
          </div>
        </div>
      )}

      {/* Scan Tab */}
      {activeTab === 'scan' && (
        <div className="px-4 -mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Camera View */}
              <div className="relative aspect-square bg-black">
                {scanning ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                        {/* Scanning animation */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" 
                               style={{ animation: 'scan 2s linear infinite' }} />
                        </div>
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-500 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-500 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-500 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-500 rounded-br-lg" />
                      </div>
                    </div>

                    {/* Camera controls */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <button 
                        onClick={() => setFlashEnabled(!flashEnabled)}
                        className={`p-3 rounded-full ${flashEnabled ? 'bg-yellow-500' : 'bg-white/20'}`}
                      >
                        <Flashlight className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-3 rounded-full bg-white/20">
                        <SwitchCamera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </>
                ) : scannedData ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-lg font-semibold mb-1">QR Code Scanned!</p>
                      <p className="text-muted-foreground">Found payment request</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center p-6">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Camera access required</p>
                      <Button onClick={startScanning}>
                        Start Scanning
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanned Result */}
              {scannedData && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">@{scannedData.username}</p>
                      {scannedData.amount && (
                        <p className="text-lg font-bold text-green-600">
                          ${scannedData.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => { setScannedData(null); startScanning(); }}
                    >
                      Scan Again
                    </Button>
                    <Button className="flex-1" onClick={handlePayScanned}>
                      Pay Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!scannedData && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to scan</h3>
              <ol className="text-sm text-blue-700 dark:text-blue-200 space-y-1 list-decimal list-inside">
                <li>Point your camera at a PayRing QR code</li>
                <li>Hold steady until the code is recognized</li>
                <li>Confirm the payment details and send</li>
              </ol>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(250px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default QRCodeScreen;
