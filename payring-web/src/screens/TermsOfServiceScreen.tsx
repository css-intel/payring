import { ArrowLeft, FileText, Shield, CreditCard, AlertTriangle, Users, Scale, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function TermsOfServiceScreen() {
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
            <FileText className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
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
              Welcome to PayRing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Service ("Terms") govern your use of PayRing's services, website, and mobile applications 
              (collectively, the "Service"). By accessing or using PayRing, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              PayRing is a payment platform that enables users to create secure agreements, manage milestone-based 
              payments, and conduct financial transactions with escrow protection.
            </p>
          </section>

          {/* Section 1: Eligibility */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                1. Eligibility
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>To use PayRing, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age (or the age of majority in your jurisdiction)</li>
                <li>Be able to form legally binding contracts</li>
                <li>Not be prohibited from using financial services under applicable law</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
              <p>
                By using PayRing, you represent and warrant that you meet all eligibility requirements.
              </p>
            </div>
          </section>

          {/* Section 2: Account Registration */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                2. Account Registration & Security
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>2.1 Account Creation:</strong> You must create an account to use PayRing's services. You agree to provide accurate, current, and complete information during registration.</p>
              <p><strong>2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>
              <p><strong>2.3 Identity Verification:</strong> We may require identity verification (KYC) to comply with regulatory requirements. Failure to complete verification may limit your access to certain features.</p>
              <p><strong>2.4 One Account Per Person:</strong> You may only maintain one PayRing account. Creating multiple accounts may result in termination of all accounts.</p>
            </div>
          </section>

          {/* Section 3: Services */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                3. Services & Payments
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>3.1 Agreement Services:</strong> PayRing enables users to create binding agreements with milestone-based payment structures. Both parties must agree to terms before an agreement becomes active.</p>
              <p><strong>3.2 Escrow Services:</strong> Funds may be held in escrow until milestone completion is verified by both parties. PayRing acts as a neutral third party in escrow transactions.</p>
              <p><strong>3.3 Payment Processing:</strong> We use third-party payment processors (including Stripe) to handle transactions. You agree to their terms of service when making payments.</p>
              <p><strong>3.4 Fees:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform fee: 2.5% of transaction amount</li>
                <li>Payment processing fees: Varies by payment method (typically 2.9% + $0.30 for cards)</li>
                <li>Withdrawal fees: 1% (max $5) for bank transfers</li>
                <li>All fees are displayed before transaction confirmation</li>
              </ul>
              <p><strong>3.5 Refunds:</strong> Refunds are subject to our Refund Policy and the terms of individual agreements. Escrow releases and disputes are handled according to our dispute resolution process.</p>
            </div>
          </section>

          {/* Section 4: User Conduct */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                4. Prohibited Activities
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>You agree NOT to use PayRing for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Illegal activities, fraud, or money laundering</li>
                <li>Transactions involving illegal goods or services</li>
                <li>Circumventing fees or platform restrictions</li>
                <li>Harassment, abuse, or threatening behavior toward other users</li>
                <li>Impersonating another person or entity</li>
                <li>Interfering with or disrupting the Service</li>
                <li>Attempting to gain unauthorized access to systems or data</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Creating fake agreements or fraudulent disputes</li>
                <li>Using the platform for gambling or adult content transactions</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Disputes */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                5. Dispute Resolution
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>5.1 User-to-User Disputes:</strong> Disputes between users regarding agreements should first be resolved directly between the parties. PayRing provides tools to facilitate communication.</p>
              <p><strong>5.2 Mediation:</strong> If parties cannot resolve a dispute, PayRing offers mediation services. Our mediators will review evidence and make recommendations.</p>
              <p><strong>5.3 Decision Authority:</strong> In escrow disputes, PayRing may make final decisions regarding fund releases based on evidence provided. Our decisions are binding for escrowed amounts.</p>
              <p><strong>5.4 Disputes with PayRing:</strong> Any disputes with PayRing shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
              <p><strong>5.5 Class Action Waiver:</strong> You agree to resolve disputes individually and waive any right to participate in class actions.</p>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Intellectual Property
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>6.1 PayRing IP:</strong> All content, features, and functionality of PayRing are owned by us and protected by intellectual property laws.</p>
              <p><strong>6.2 User Content:</strong> You retain ownership of content you upload. By uploading, you grant PayRing a license to use, store, and display such content as necessary to provide the Service.</p>
              <p><strong>6.3 Feedback:</strong> Any feedback or suggestions you provide may be used by PayRing without obligation to compensate you.</p>
            </div>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Limitation of Liability
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>7.1</strong> PayRing provides the Service "AS IS" without warranties of any kind.</p>
              <p><strong>7.2</strong> We are not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User-to-user disputes or the quality of goods/services in agreements</li>
                <li>Losses due to unauthorized account access (unless caused by our negligence)</li>
                <li>Third-party service interruptions</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
              <p><strong>7.3</strong> Our total liability shall not exceed the fees you paid to PayRing in the 12 months preceding the claim.</p>
            </div>
          </section>

          {/* Section 8: Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Termination
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>8.1 By You:</strong> You may close your account at any time through account settings. Active agreements must be completed or cancelled first.</p>
              <p><strong>8.2 By PayRing:</strong> We may suspend or terminate your account for violations of these Terms, suspected fraud, or as required by law.</p>
              <p><strong>8.3 Effect of Termination:</strong> Upon termination, you must withdraw any available balance within 30 days. Escrowed funds will be handled according to agreement terms or dispute resolution.</p>
            </div>
          </section>

          {/* Section 9: Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to Terms
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>We may update these Terms periodically. We will notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance.</p>
            </div>
          </section>

          {/* Section 10: Contact */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                10. Contact Us
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>If you have questions about these Terms, please contact us:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> legal@payring.com</li>
                <li><strong>Support:</strong> support@payring.com</li>
                <li><strong>Address:</strong> PayRing Inc., [Address]</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200 text-center font-medium">
              By using PayRing, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/privacy')}>
            Privacy Policy
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
