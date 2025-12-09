/**
 * Agreement Detail Screen
 * View and manage an existing agreement
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store';
import {
  getAgreementById,
  getAgreementMilestones,
  signAgreement,
  cancelAgreement,
  submitMilestone,
  approveMilestone,
  Agreement,
  Milestone,
} from '../services/agreements.service';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  DollarSign,
  Calendar,
  Pencil,
  X,
  Check,
  Flag,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  draft: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', icon: Pencil },
  pending_signatures: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', icon: Clock },
  active: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', icon: CheckCircle },
  in_progress: { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', icon: Clock },
  completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', icon: X },
  disputed: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', icon: AlertTriangle },
};

const MILESTONE_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' },
  in_progress: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
  submitted: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
  approved: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  paid: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  disputed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
};

export default function AgreementDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals
  const [showSignModal, setShowSignModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Load agreement data
  useEffect(() => {
    const loadAgreement = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const [agreementData, milestonesData] = await Promise.all([
          getAgreementById(id),
          getAgreementMilestones(id),
        ]);

        if (!agreementData) {
          setError('Agreement not found');
          return;
        }

        setAgreement(agreementData);
        setMilestones(milestonesData);
      } catch (err) {
        console.error('Load agreement error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load agreement');
      } finally {
        setLoading(false);
      }
    };

    loadAgreement();
  }, [id]);

  // Check if current user is the creator
  const userId = user?.id;
  const isCreator = agreement?.creatorId === userId;
  const isParticipant = agreement?.participantIds.includes(userId || '');
  const currentUserParty = agreement?.parties.find((p) => p.userId === userId);
  const hasSigned = currentUserParty?.hasSigned;
  const canSign = agreement?.status === 'pending_signatures' && !hasSigned && isParticipant;
  const canCancel = (agreement?.status === 'draft' || agreement?.status === 'pending_signatures') && isCreator;

  // Handle signing
  const handleSign = async () => {
    if (!id) return;

    setActionLoading('sign');
    try {
      await signAgreement(id);
      // Reload agreement
      const updatedAgreement = await getAgreementById(id);
      if (updatedAgreement) setAgreement(updatedAgreement);
      setShowSignModal(false);
    } catch (err) {
      console.error('Sign error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign agreement');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancellation
  const handleCancel = async () => {
    if (!id) return;

    setActionLoading('cancel');
    try {
      await cancelAgreement(id, cancelReason);
      const updatedAgreement = await getAgreementById(id);
      if (updatedAgreement) setAgreement(updatedAgreement);
      setShowCancelModal(false);
    } catch (err) {
      console.error('Cancel error:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel agreement');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle milestone submission
  const handleSubmitMilestone = async (milestoneId: string) => {
    if (!id) return;

    setActionLoading(milestoneId);
    try {
      await submitMilestone(id, milestoneId);
      const updatedMilestones = await getAgreementMilestones(id);
      setMilestones(updatedMilestones);
    } catch (err) {
      console.error('Submit milestone error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit milestone');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle milestone approval
  const handleApproveMilestone = async (milestoneId: string) => {
    if (!id) return;

    setActionLoading(milestoneId);
    try {
      await approveMilestone(id, milestoneId);
      const updatedMilestones = await getAgreementMilestones(id);
      setMilestones(updatedMilestones);
      // Also refresh agreement to update progress
      const updatedAgreement = await getAgreementById(id);
      if (updatedAgreement) setAgreement(updatedAgreement);
    } catch (err) {
      console.error('Approve milestone error:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve milestone');
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {error || 'Agreement not found'}
        </h2>
        <button
          onClick={() => navigate('/agreements')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Agreements
        </button>
      </div>
    );
  }

  const statusConfig = STATUS_COLORS[agreement.status] || STATUS_COLORS.draft;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{agreement.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {agreement.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  {agreement.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2">
              {canSign && (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Sign Agreement
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              )}
              {agreement.status !== 'cancelled' && agreement.status !== 'completed' && (
                <button
                  onClick={() => navigate(`/disputes/new?agreementId=${id}`)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Flag className="w-5 h-5" />
                  Raise Dispute
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {agreement.completedMilestones} of {agreement.totalMilestones} milestones
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {agreement.progressPercent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${agreement.progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Value</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(agreement.totalValueCents / 100).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Paid</p>
                  <p className="text-lg font-bold text-green-600">
                    ${(agreement.paidAmountCents / 100).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(agreement.remainingAmountCents / 100).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Terms</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900 dark:text-white">{agreement.terms.description}</p>
                </div>

                {agreement.terms.deliverables && agreement.terms.deliverables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Deliverables</h3>
                    <ul className="space-y-1">
                      {agreement.terms.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-900 dark:text-white">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(agreement.terms.startDate || agreement.terms.endDate) && (
                  <div className="grid grid-cols-2 gap-4">
                    {agreement.terms.startDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                        <p className="text-gray-900 dark:text-white">
                          {agreement.terms.startDate instanceof Date
                            ? agreement.terms.startDate.toLocaleDateString()
                            : new Date(agreement.terms.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {agreement.terms.endDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
                        <p className="text-gray-900 dark:text-white">
                          {agreement.terms.endDate instanceof Date
                            ? agreement.terms.endDate.toLocaleDateString()
                            : new Date(agreement.terms.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {agreement.terms.paymentTerms && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Terms</h3>
                    <p className="text-gray-900 dark:text-white">{agreement.terms.paymentTerms}</p>
                  </div>
                )}

                {agreement.terms.cancellationPolicy && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cancellation Policy</h3>
                    <p className="text-gray-900 dark:text-white">{agreement.terms.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Milestones Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Milestones</h2>
              </div>

              {milestones.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No milestones defined</p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => {
                    const milestoneColors = MILESTONE_STATUS_COLORS[milestone.status] || MILESTONE_STATUS_COLORS.pending;
                    const canSubmit = milestone.status === 'pending' || milestone.status === 'in_progress';
                    const canApprove = milestone.status === 'submitted' && !isCreator;

                    return (
                      <div
                        key={milestone.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  milestone.status === 'completed' || milestone.status === 'paid'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                {milestone.status === 'completed' || milestone.status === 'paid' ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {milestone.title}
                                </h3>
                                <span
                                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${milestoneColors.bg} ${milestoneColors.text}`}
                                >
                                  {milestone.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            {milestone.description && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-11">
                                {milestone.description}
                              </p>
                            )}
                            {milestone.deliverables && milestone.deliverables.length > 0 && (
                              <ul className="mt-2 ml-11 text-sm text-gray-600 dark:text-gray-400">
                                {milestone.deliverables.map((d, i) => (
                                  <li key={i} className="flex items-center gap-1">
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {milestone.dueDate && (
                              <p className="mt-2 ml-11 text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due: {milestone.dueDate instanceof Date
                                  ? milestone.dueDate.toLocaleDateString()
                                  : new Date(milestone.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${(milestone.amountCents / 100).toLocaleString()}
                            </p>
                            {/* Actions */}
                            {agreement.status === 'active' || agreement.status === 'in_progress' ? (
                              <div className="mt-2 space-y-2">
                                {canSubmit && isCreator && (
                                  <button
                                    onClick={() => handleSubmitMilestone(milestone.id)}
                                    disabled={actionLoading === milestone.id}
                                    className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    {actionLoading === milestone.id ? 'Submitting...' : 'Submit'}
                                  </button>
                                )}
                                {canApprove && (
                                  <button
                                    onClick={() => handleApproveMilestone(milestone.id)}
                                    disabled={actionLoading === milestone.id}
                                    className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {actionLoading === milestone.id ? 'Approving...' : 'Approve'}
                                  </button>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parties Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Parties</h2>
              </div>

              <div className="space-y-4">
                {agreement.parties.map((party) => (
                  <div key={party.userId} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        party.role === 'creator' ? 'bg-indigo-600' : 'bg-purple-600'
                      }`}
                    >
                      {party.displayName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {party.displayName}
                        {party.userId === userId && (
                          <span className="text-xs text-gray-500 ml-1">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{party.username} • {party.role}
                      </p>
                    </div>
                    <div>
                      {party.hasSigned ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {agreement.status === 'pending_signatures' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Waiting for all parties to sign
                  </p>
                </div>
              )}
            </div>

            {/* Timeline Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900 dark:text-white">
                    {agreement.createdAt instanceof Date
                      ? agreement.createdAt.toLocaleDateString()
                      : new Date(agreement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {agreement.signedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Signed</span>
                    <span className="text-gray-900 dark:text-white">
                      {agreement.signedAt instanceof Date
                        ? agreement.signedAt.toLocaleDateString()
                        : new Date(agreement.signedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {agreement.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed</span>
                    <span className="text-gray-900 dark:text-white">
                      {agreement.completedAt instanceof Date
                        ? agreement.completedAt.toLocaleDateString()
                        : new Date(agreement.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message Counterparty
                </button>
                <button className="w-full py-2 px-4 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sign Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sign Agreement</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              By signing this agreement, you agree to all terms and conditions outlined above.
              This is a legally binding commitment.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                disabled={actionLoading === 'sign'}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === 'sign' ? 'Signing...' : 'Sign Agreement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cancel Agreement</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to cancel this agreement? This action cannot be undone.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Keep Agreement
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading === 'cancel'}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Agreement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
