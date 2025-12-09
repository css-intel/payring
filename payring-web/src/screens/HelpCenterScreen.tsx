import { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Shield, 
  Users,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is PayRing?',
    answer: 'PayRing is a secure payment platform that enables users to create agreements, manage milestone-based payments, and conduct transactions with escrow protection. We help freelancers, businesses, and individuals transact safely online.',
  },
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" on the homepage, enter your email and create a password (or sign up with Google). Verify your email, complete your profile, and you\'re ready to start using PayRing!',
  },
  {
    category: 'Getting Started',
    question: 'Is PayRing free to use?',
    answer: 'Creating an account and browsing is free. We charge a 2.5% platform fee on successful transactions. Payment processing fees (typically 2.9% + $0.30 for cards) are separate.',
  },
  // Agreements
  {
    category: 'Agreements',
    question: 'What is an agreement?',
    answer: 'An agreement is a contract between two parties that outlines the scope of work, payment terms, milestones, and conditions. Both parties must accept the terms before work begins.',
  },
  {
    category: 'Agreements',
    question: 'How do I create an agreement?',
    answer: 'Go to Agreements → New Agreement. Select a template or start from scratch. Add details like title, description, amount, milestones, and counterparty. Send it for their approval.',
  },
  {
    category: 'Agreements',
    question: 'Can I edit an agreement after it\'s created?',
    answer: 'You can edit draft agreements freely. Once an agreement is active (both parties signed), changes require mutual agreement. Major changes may require creating a new agreement.',
  },
  // Payments
  {
    category: 'Payments',
    question: 'How does escrow work?',
    answer: 'When you fund an agreement, money is held securely by PayRing (in escrow). Funds are only released to the seller when you approve the completed milestone. This protects both parties.',
  },
  {
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit cards, debit cards, and bank transfers (ACH). You can also pay from your PayRing wallet balance.',
  },
  {
    category: 'Payments',
    question: 'How long do withdrawals take?',
    answer: 'Wallet-to-bank withdrawals typically take 1-3 business days for standard transfers. Instant transfers may be available for a small fee.',
  },
  {
    category: 'Payments',
    question: 'What are the fees?',
    answer: 'Platform fee: 2.5% on successful transactions. Card payments: 2.9% + $0.30. Bank transfers: Free to deposit, 1% (max $5) to withdraw. Escrow holds: No additional fee.',
  },
  // Security
  {
    category: 'Security',
    question: 'Is PayRing secure?',
    answer: 'Yes! We use bank-level encryption (TLS 1.3, AES-256), are PCI-DSS compliant, and offer two-factor authentication. Your financial data is never stored on our servers.',
  },
  {
    category: 'Security',
    question: 'What is two-factor authentication (2FA)?',
    answer: '2FA adds an extra layer of security by requiring a code from your phone in addition to your password. Enable it in Settings → Security.',
  },
  {
    category: 'Security',
    question: 'What if I forget my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. If you have 2FA enabled, you\'ll need to verify your identity.',
  },
  // Disputes
  {
    category: 'Disputes',
    question: 'What if there\'s a problem with my transaction?',
    answer: 'First, try to resolve it directly with the other party through messaging. If that fails, open a dispute from the agreement page. Our team will review and mediate.',
  },
  {
    category: 'Disputes',
    question: 'How long does dispute resolution take?',
    answer: 'Most disputes are resolved within 5-7 business days. Complex cases may take longer. Both parties can submit evidence and the mediator makes a fair decision.',
  },
  {
    category: 'Disputes',
    question: 'What happens to funds during a dispute?',
    answer: 'Escrowed funds remain protected during the dispute. They\'re released based on the resolution - either to the seller, refunded to the buyer, or split as determined.',
  },
  // Account
  {
    category: 'Account',
    question: 'How do I verify my identity?',
    answer: 'Go to Settings → Profile → Verify Identity. You\'ll need to upload a government ID and possibly a selfie. Verification typically completes within 24 hours.',
  },
  {
    category: 'Account',
    question: 'Can I have multiple accounts?',
    answer: 'No, each person may only have one PayRing account. Multiple accounts may result in suspension. If you need separate business and personal accounts, contact support.',
  },
  {
    category: 'Account',
    question: 'How do I close my account?',
    answer: 'Go to Settings → Profile → Delete Account. You must complete or cancel all active agreements and withdraw your balance first. Account data is retained per our Privacy Policy.',
  },
];

const categories = [
  { id: 'all', name: 'All Topics', icon: HelpCircle },
  { id: 'Getting Started', name: 'Getting Started', icon: FileText },
  { id: 'Agreements', name: 'Agreements', icon: FileText },
  { id: 'Payments', name: 'Payments', icon: CreditCard },
  { id: 'Security', name: 'Security', icon: Shield },
  { id: 'Disputes', name: 'Disputes', icon: Users },
  { id: 'Account', name: 'Account', icon: Users },
];

export function HelpCenterScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-purple-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Help Center</h1>
          </div>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/agreements/new')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-left"
          >
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Create Agreement</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start a new agreement</p>
          </button>
          
          <button
            onClick={() => navigate('/wallet')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-left"
          >
            <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Manage Wallet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Deposits & withdrawals</p>
          </button>
          
          <button
            onClick={() => navigate('/settings/security')}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-left"
          >
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Security Settings</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable 2FA & more</p>
          </button>
          
          <a
            href="mailto:support@payring.com"
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-left"
          >
            <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Contact Support</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get help from our team</p>
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ List */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredFAQs.length} articles found
                </p>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFAQs.length === 0 ? (
                  <div className="p-8 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No articles found matching your search.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <div key={index} className="p-4">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                        className="w-full flex items-start justify-between gap-4 text-left"
                      >
                        <div>
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {faq.category}
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {faq.question}
                          </p>
                        </div>
                        {expandedFAQ === faq.question ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === faq.question && (
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm pl-0">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our support team is here to assist you. Reach out and we'll get back to you within 24 hours.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:support@payring.com"
                className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Mail className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">support@payring.com</p>
                </div>
              </a>
              
              <a
                href="tel:+18001234567"
                className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Phone className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Phone Support</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1-800-123-4567</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <button onClick={() => navigate('/terms')} className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
            Terms of Service <ExternalLink className="w-3 h-3" />
          </button>
          <button onClick={() => navigate('/privacy')} className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
            Privacy Policy <ExternalLink className="w-3 h-3" />
          </button>
          <button onClick={() => navigate('/refund-policy')} className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
            Refund Policy <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </main>
    </div>
  );
}
