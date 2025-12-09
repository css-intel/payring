import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  FileText, 
  CreditCard, 
  Users, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuthStore } from '../store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: '',
    businessType: '',
    primaryUse: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // In production, save onboarding data to user profile
    // await updateUserProfile(user?.uid, { ...formData, onboardingCompleted: true });
    navigate('/');
  };

  const handleSkip = () => {
    navigate('/');
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to PayRing! 🎉',
      description: 'The safest way to send and receive payments',
      icon: <Sparkles className="w-12 h-12 text-purple-500" />,
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to PayRing!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            You're about to discover the safest way to transact online. Let's set up your account in just a few steps.
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="p-4">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Secure</p>
              <p className="text-xs text-gray-500">Bank-level encryption</p>
            </div>
            <div className="p-4">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Protected</p>
              <p className="text-xs text-gray-500">Escrow payments</p>
            </div>
            <div className="p-4">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Trusted</p>
              <p className="text-xs text-gray-500">Verified users</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Tell us about yourself',
      description: 'Help us personalize your experience',
      icon: <Users className="w-12 h-12 text-purple-500" />,
      content: (
        <div>
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Tell us about yourself
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            This helps us personalize your experience
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="How should we call you?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Bio (optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell others a bit about yourself..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'How will you use PayRing?',
      description: 'Select your primary use case',
      icon: <CreditCard className="w-12 h-12 text-purple-500" />,
      content: (
        <div>
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            How will you use PayRing?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            Select your primary use case
          </p>
          
          <div className="space-y-3 max-w-sm mx-auto">
            {[
              { value: 'freelancer', label: 'Freelancer / Contractor', desc: 'Receive payments for work' },
              { value: 'client', label: 'Client / Buyer', desc: 'Pay for services safely' },
              { value: 'business', label: 'Business Owner', desc: 'Manage team payments' },
              { value: 'personal', label: 'Personal Use', desc: 'Pay friends & family' },
              { value: 'both', label: 'Both Send & Receive', desc: 'All of the above' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, primaryUse: option.value })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.primaryUse === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</p>
                  </div>
                  {formData.primaryUse === option.value && (
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Escrow Protection',
      description: 'Learn how we keep your payments safe',
      icon: <Shield className="w-12 h-12 text-purple-500" />,
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Escrow Protection
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your payments are always protected
          </p>
          
          <div className="max-w-md mx-auto space-y-4 text-left">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Buyer deposits funds</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Money is held securely by PayRing</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Seller completes work</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deliverables submitted for review</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Buyer approves</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Funds released to seller instantly</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Both parties protected</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Disputes resolved fairly by PayRing</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "You're all set!",
      description: 'Start using PayRing today',
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're all set! 🎉
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Welcome to PayRing, {formData.displayName || 'friend'}! You're ready to start making secure transactions.
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-left">
              <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                🚀 Quick Start
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Create your first agreement or add funds to your wallet
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-left">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                🔒 Verify Your Identity
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Complete verification to unlock all features
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-left">
              <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                💳 Add Payment Method
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Link a card or bank account to get started
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Skip button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Skip for now
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {currentStepData.content}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {currentStep === steps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-purple-600'
                  : index < currentStep
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
