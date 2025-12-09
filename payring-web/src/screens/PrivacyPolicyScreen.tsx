import { ArrowLeft, Shield, Eye, Database, Lock, Globe, Cookie, Users, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function PrivacyPolicyScreen() {
  const navigate = useNavigate();
  const lastUpdated = 'January 15, 2025';
  const effectiveDate = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {/* Meta Info */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Effective Date: {effectiveDate}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At PayRing, we are committed to protecting your privacy and ensuring the security of your personal 
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              By using PayRing, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Section 1: Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                1. Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">1.1 Information You Provide:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                  <li><strong>Profile Information:</strong> Profile photo, bio, business information</li>
                  <li><strong>Identity Verification:</strong> Government ID, proof of address, Social Security Number (for tax purposes)</li>
                  <li><strong>Financial Information:</strong> Bank account details, payment card information, transaction history</li>
                  <li><strong>Agreement Content:</strong> Details of agreements you create or participate in</li>
                  <li><strong>Communications:</strong> Messages sent through our platform, support inquiries</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">1.2 Information Collected Automatically:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers</li>
                  <li><strong>Log Data:</strong> IP address, access times, pages viewed, links clicked</li>
                  <li><strong>Location Data:</strong> General location based on IP address (with consent, precise location)</li>
                  <li><strong>Usage Data:</strong> Features used, actions taken, time spent on pages</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">1.3 Information from Third Parties:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Payment Processors:</strong> Transaction confirmations, fraud prevention data</li>
                  <li><strong>Identity Verification Services:</strong> Verification results, risk scores</li>
                  <li><strong>Social Login Providers:</strong> Profile information (if you sign in with Google, Apple, etc.)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                2. How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Provide Services:</strong> Process transactions, manage agreements, facilitate payments</li>
                <li><strong>Verify Identity:</strong> Comply with KYC/AML requirements, prevent fraud</li>
                <li><strong>Improve Services:</strong> Analyze usage patterns, develop new features, fix bugs</li>
                <li><strong>Communicate:</strong> Send transaction alerts, security notifications, service updates</li>
                <li><strong>Marketing:</strong> Send promotional content (with your consent), personalize recommendations</li>
                <li><strong>Security:</strong> Detect and prevent fraud, unauthorized access, and illegal activities</li>
                <li><strong>Legal Compliance:</strong> Comply with laws, respond to legal requests, protect our rights</li>
                <li><strong>Dispute Resolution:</strong> Investigate and resolve disputes between users</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                3. Information Sharing & Disclosure
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We may share your information with:</p>
              
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">3.1 Other Users:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Agreement counterparties see your name, profile photo, and agreement-related information</li>
                  <li>Search results may show limited profile information to other users</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">3.2 Service Providers:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processors (Stripe, Plaid)</li>
                  <li>Cloud hosting providers (Google Cloud, AWS)</li>
                  <li>Identity verification services</li>
                  <li>Analytics providers</li>
                  <li>Customer support tools</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">3.3 Legal Requirements:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Court orders, subpoenas, or legal process</li>
                  <li>Government requests (law enforcement, tax authorities)</li>
                  <li>Protection of our rights, property, or safety</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-2">3.4 Business Transfers:</p>
                <p>In the event of merger, acquisition, or sale, your information may be transferred to the new owner.</p>
              </div>

              <p className="font-medium text-purple-600">
                We never sell your personal information to third parties for their marketing purposes.
              </p>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                4. Data Security
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>We implement robust security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS 1.3. Sensitive data at rest is encrypted using AES-256.</li>
                <li><strong>Access Controls:</strong> Role-based access limits employee access to user data on a need-to-know basis.</li>
                <li><strong>Authentication:</strong> Multi-factor authentication available for all accounts. Biometric login supported.</li>
                <li><strong>Monitoring:</strong> Continuous security monitoring and anomaly detection.</li>
                <li><strong>Compliance:</strong> We comply with PCI-DSS for payment data handling.</li>
                <li><strong>Regular Audits:</strong> Third-party security audits and penetration testing.</li>
              </ul>
              <p>
                While we strive to protect your data, no system is 100% secure. We encourage you to use strong passwords and enable two-factor authentication.
              </p>
            </div>
          </section>

          {/* Section 5: Cookies */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                5. Cookies & Tracking Technologies
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic functionality</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Understand how users interact with our services</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
              </ul>
              <p>
                You can manage cookie preferences through your browser settings. Blocking certain cookies may affect functionality.
              </p>
            </div>
          </section>

          {/* Section 6: Your Rights */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                6. Your Privacy Rights
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>Depending on your location, you may have the following rights:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Access & Portability</p>
                  <p className="text-sm">Request a copy of your personal data in a portable format</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Correction</p>
                  <p className="text-sm">Request correction of inaccurate or incomplete data</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Deletion</p>
                  <p className="text-sm">Request deletion of your data (subject to legal retention requirements)</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Opt-Out</p>
                  <p className="text-sm">Opt out of marketing communications and certain data processing</p>
                </div>
              </div>

              <p className="mt-4">
                <strong>California Residents (CCPA):</strong> You have the right to know what personal information we collect, request deletion, and opt-out of sale of personal information (we do not sell your data).
              </p>
              <p>
                <strong>EU/UK Residents (GDPR):</strong> You have rights to access, rectification, erasure, restriction, data portability, and to object to processing. You may also lodge a complaint with your supervisory authority.
              </p>
              <p>
                To exercise your rights, contact us at privacy@payring.com or through your account settings.
              </p>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Data Retention
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>We retain your data for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations (tax records: 7 years, transaction records: 5 years)</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Prevent fraud and abuse</li>
              </ul>
              <p>
                After account deletion, we may retain certain data in anonymized form for analytics or as required by law.
              </p>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Children's Privacy
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                PayRing is not intended for users under 18 years of age. We do not knowingly collect personal 
                information from children. If we learn we have collected data from a child, we will delete it promptly.
              </p>
            </div>
          </section>

          {/* Section 9: International Transfers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. International Data Transfers
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place, including Standard Contractual Clauses for transfers from the EU/UK.
              </p>
            </div>
          </section>

          {/* Section 10: Updates */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Policy Updates
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                We may update this Privacy Policy periodically. We will notify you of material changes via email or 
                prominent notice in our services. Your continued use after changes constitutes acceptance.
              </p>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                11. Contact Us
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>For privacy-related questions or to exercise your rights:</p>
              <ul className="list-none space-y-2">
                <li><strong>Privacy Team:</strong> privacy@payring.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@payring.com</li>
                <li><strong>General Support:</strong> support@payring.com</li>
                <li><strong>Address:</strong> PayRing Inc., [Address]</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200 text-center font-medium">
              By using PayRing, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/terms')}>
            Terms of Service
          </Button>
          <Button variant="outline" onClick={() => navigate('/refund-policy')}>
            Refund Policy
          </Button>
          <Button variant="outline" onClick={() => navigate('/help')}>
            Help Center
          </Button>
        </div>
      </main>
    </div>
  );
}
