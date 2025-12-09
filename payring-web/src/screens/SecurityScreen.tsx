// PayRing Web - Security & Privacy Screen
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Smartphone, Key, Bell, Mail, MessageSquare,
  ChevronRight, Download, Trash2, CheckCircle2, X, Copy, ArrowLeft,
  RefreshCw, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SecurityScreen() {
  const navigate = useNavigate();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // 2FA Modal States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'method' | 'setup' | 'verify' | 'backup' | 'complete'>('method');
  const [twoFAMethod, setTwoFAMethod] = useState<'app' | 'sms'>('app');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [backupCodes] = useState([
    'ABCD-1234-EFGH', 'IJKL-5678-MNOP', 'QRST-9012-UVWX',
    'YZAB-3456-CDEF', 'GHIJ-7890-KLMN', 'OPQR-1234-STUV'
  ]);
  const [copiedBackup, setCopiedBackup] = useState(false);
  
  // Mock QR code for authenticator app
  const mockQRCode = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="white"/%3E%3Cpath d="M10 10h20v20h-20zM70 10h20v20h-20zM10 70h20v20h-20z" fill="black"/%3E%3Crect x="35" y="35" width="30" height="30" fill="black"/%3E%3C/svg%3E';
  const secretKey = 'JBSWY3DPEHPK3PXP';

  const securityLevel = smsAlerts && emailAlerts && loginAlerts && twoFactorEnabled ? 'excellent' 
    : smsAlerts && emailAlerts && loginAlerts ? 'good' : 'moderate';

  const handle2FAToggle = (enabled: boolean) => {
    if (enabled) {
      setShow2FAModal(true);
      setTwoFAStep('method');
    } else {
      // Show confirmation to disable
      if (confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
        setTwoFactorEnabled(false);
      }
    }
  };

  const handleVerifyCode = async () => {
    setVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setVerifying(false);
    setTwoFAStep('backup');
  };

  const handleComplete2FA = () => {
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
    setTwoFAStep('method');
    setVerificationCode('');
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Privacy</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Protect your account</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Security Level Card */}
        <div className={`rounded-2xl p-6 ${
          securityLevel === 'excellent' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
            : securityLevel === 'good' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
        } text-white`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-lg">
                  {securityLevel === 'excellent' ? 'Excellent Security' : securityLevel === 'good' ? 'Good Security Level' : 'Moderate Security'}
                </span>
              </div>
              <p className="text-white/80 mt-1">
                {securityLevel === 'excellent' 
                  ? 'Your account has maximum protection'
                  : securityLevel === 'good' 
                  ? 'Your account is well protected' 
                  : 'Enable more security features'}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Authentication</h3>
          </div>

          {/* Change PIN */}
          <button className="w-full px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Change PIN</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your 6-digit PIN</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Biometric Auth */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Biometric Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Face ID / Touch ID</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={biometricEnabled}
                onChange={(e) => setBiometricEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Two-Factor Auth */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Key className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {twoFactorEnabled ? 'Enabled via authenticator app' : 'Add extra security'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={twoFactorEnabled}
                onChange={(e) => handle2FAToggle(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Security Alerts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Security Alerts</h3>
          </div>

          {/* SMS Alerts */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">SMS Alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Email Alerts */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Login Alerts */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">Login Alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={loginAlerts}
                onChange={(e) => setLoginAlerts(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy</h3>
          </div>

          {/* Download Data */}
          <button className="w-full px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Download My Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Export your account data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Delete Account */}
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {twoFAStep === 'method' && 'Set Up 2FA'}
                {twoFAStep === 'setup' && 'Scan QR Code'}
                {twoFAStep === 'verify' && 'Verify Code'}
                {twoFAStep === 'backup' && 'Backup Codes'}
                {twoFAStep === 'complete' && '2FA Enabled'}
              </h3>
              <button 
                onClick={() => setShow2FAModal(false)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Choose Method */}
            {twoFAStep === 'method' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose how you want to receive your verification codes:
                </p>
                
                <button
                  onClick={() => { setTwoFAMethod('app'); setTwoFAStep('setup'); }}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                    twoFAMethod === 'app' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-gray-500">Google Authenticator, Authy, etc.</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { setTwoFAMethod('sms'); setTwoFAStep('verify'); }}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                    twoFAMethod === 'sms' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Code</p>
                      <p className="text-sm text-gray-500">Receive codes via text message</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Setup - QR Code */}
            {twoFAStep === 'setup' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan this QR code with your authenticator app:
                </p>
                
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white p-4 rounded-xl border-2 border-gray-200">
                    <img src={mockQRCode} alt="QR Code" className="w-full h-full" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Or enter this key manually:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg font-mono text-sm">
                      {secretKey}
                    </code>
                    <button onClick={copySecretKey} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button onClick={() => setTwoFAStep('verify')} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {/* Step 3: Verify Code */}
            {twoFAStep === 'verify' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {twoFAMethod === 'app' 
                    ? 'Enter the 6-digit code from your authenticator app:'
                    : 'Enter the 6-digit code we sent to your phone:'}
                </p>
                
                <div className="flex justify-center">
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest font-mono w-48"
                    maxLength={6}
                  />
                </div>

                {twoFAMethod === 'sms' && (
                  <button className="flex items-center justify-center gap-2 text-sm text-purple-600 w-full">
                    <RefreshCw className="w-4 h-4" />
                    Resend code
                  </button>
                )}

                <Button 
                  onClick={handleVerifyCode} 
                  className="w-full"
                  disabled={verificationCode.length !== 6 || verifying}
                >
                  {verifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            )}

            {/* Step 4: Backup Codes */}
            {twoFAStep === 'backup' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important:</strong> Save these backup codes somewhere safe. You can use them to access your account if you lose your phone.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg font-mono text-sm text-center"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={copyBackupCodes}
                >
                  {copiedBackup ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Codes
                    </>
                  )}
                </Button>

                <Button onClick={handleComplete2FA} className="w-full">
                  I've Saved My Codes
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
