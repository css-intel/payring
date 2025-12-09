import { ArrowLeft, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function RefundPolicyScreen() {
  const navigate = useNavigate();
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Refund Policy</h1>
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
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Commitment to Fair Transactions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              PayRing is committed to ensuring fair and transparent transactions between users. This Refund Policy 
              explains how refunds are handled for different types of transactions on our platform.
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Important:</strong> PayRing acts as a payment facilitator, not the seller of goods or services. 
                Refund eligibility depends on the terms of individual agreements between users.
              </p>
            </div>
          </section>

          {/* Section 1: Escrow Transactions */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                1. Escrow-Protected Transactions
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                When funds are held in escrow, they remain protected until both parties confirm completion or a 
                dispute is resolved.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Before Milestone Completion</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Full refund available if both parties agree to cancel, or if seller fails to deliver.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">During Dispute</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Funds remain in escrow until dispute is resolved. Refund based on mediation decision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">After Milestone Approval</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Once you approve a milestone, funds are released to the seller. Refunds require seller consent or successful dispute.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Direct Payments */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Direct Payments (Non-Escrow)
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                For direct payments without escrow protection:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds depend entirely on agreement terms between parties</li>
                <li>The recipient must voluntarily initiate a refund</li>
                <li>PayRing cannot force refunds for direct payments</li>
                <li>We encourage using escrow for all transactions to ensure protection</li>
              </ul>
              <p className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                <strong>Tip:</strong> Always use escrow protection for transactions with new contacts or high-value agreements.
              </p>
            </div>
          </section>

          {/* Section 3: Platform Fees */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Platform Fee Refunds
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>PayRing platform fees are handled as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Full Agreement Cancellation:</strong> Platform fees are refunded if an agreement is cancelled before any work begins</li>
                <li><strong>Partial Refunds:</strong> Fees for completed milestones are non-refundable; only fees for cancelled portions are refunded</li>
                <li><strong>Dispute Resolution:</strong> If a dispute results in full buyer refund, platform fees are waived</li>
                <li><strong>Payment Processing Fees:</strong> Third-party payment processing fees (e.g., Stripe) are generally non-refundable</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Refund Process */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. How to Request a Refund
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Step 1: Contact the Other Party</p>
                  <p className="text-sm">Use the in-app messaging to discuss the issue and request a mutual resolution.</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Step 2: File a Dispute (if needed)</p>
                  <p className="text-sm">If you can't reach an agreement, file a dispute through the agreement details page.</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Step 3: Provide Evidence</p>
                  <p className="text-sm">Submit relevant documentation, screenshots, or communications to support your case.</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Step 4: Mediation</p>
                  <p className="text-sm">Our team will review and make a fair decision within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Refund Timeframes */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Refund Processing Times
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>Once a refund is approved:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">Payment Method</th>
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">PayRing Wallet</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Instant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Debit Card</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">3-5 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Credit Card</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">5-10 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Bank Transfer (ACH)</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">3-5 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm mt-2">
                Note: Processing times depend on your bank or card issuer and may vary.
              </p>
            </div>
          </section>

          {/* Section 6: Non-Refundable Items */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Non-Refundable Situations
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>Refunds are generally NOT available for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Completed milestones that were approved by the buyer</li>
                <li>Services fully rendered as described in the agreement</li>
                <li>Digital goods delivered as specified</li>
                <li>Transactions completed more than 180 days ago</li>
                <li>Cases where the buyer failed to respond within dispute timeframes</li>
                <li>Fraudulent refund requests</li>
                <li>Violations of our Terms of Service</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Chargebacks */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Chargebacks & Disputes with Banks
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                If you file a chargeback with your bank instead of using our dispute process:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your PayRing account may be suspended pending investigation</li>
                <li>We will provide transaction evidence to the card network</li>
                <li>Fraudulent chargebacks may result in account termination</li>
                <li>You may be responsible for chargeback fees ($15-25)</li>
              </ul>
              <p className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-800 dark:text-purple-200">
                <strong>Recommendation:</strong> Always try to resolve issues through PayRing's dispute system first. 
                It's faster and preserves your account standing.
              </p>
            </div>
          </section>

          {/* Section 8: Seller Protections */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Seller Protection
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>Sellers are protected from unfair refund claims when they:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deliver work as specified in the agreement</li>
                <li>Communicate through PayRing's messaging system</li>
                <li>Document deliverables and milestones</li>
                <li>Respond to disputes within required timeframes</li>
              </ul>
              <p>
                If a buyer approves a milestone and then requests a refund without valid cause, 
                PayRing will typically rule in the seller's favor.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                9. Contact Us
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>For refund-related questions or assistance:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> refunds@payring.com</li>
                <li><strong>Support:</strong> support@payring.com</li>
                <li><strong>In-App:</strong> Settings → Help → Contact Support</li>
              </ul>
              <p className="text-sm">Response time: Within 24-48 hours</p>
            </div>
          </section>

          {/* Summary */}
          <section className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Summary</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>✓ Escrow funds are protected until milestone completion</li>
              <li>✓ File disputes within the agreement for fastest resolution</li>
              <li>✓ Platform fees refunded for cancelled agreements</li>
              <li>✓ Most refunds processed within 3-10 business days</li>
              <li>✓ Keep communication on-platform for evidence</li>
            </ul>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/terms')}>
            Terms of Service
          </Button>
          <Button variant="outline" onClick={() => navigate('/privacy')}>
            Privacy Policy
          </Button>
          <Button variant="outline" onClick={() => navigate('/help')}>
            Help Center
          </Button>
        </div>
      </main>
    </div>
  );
}
