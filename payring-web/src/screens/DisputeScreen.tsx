import { useState } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ChevronRight,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuthStore } from '../store';
import { DISPUTE_TYPES } from '../services/disputes.service';

// Mock dispute data
const mockDispute = {
  id: 'disp_123',
  agreementId: 'agr_456',
  title: 'Quality Issues with Website Development',
  type: 'quality',
  status: 'under_review',
  priority: 'high',
  description: 'The website delivered does not match the agreed specifications. Several features are missing and the design differs from the mockups.',
  desiredResolution: 'Complete the missing features or provide a 50% refund',
  initiatorId: 'user_1',
  respondentId: 'user_2',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  evidence: [
    {
      id: 'ev_1',
      userId: 'user_1',
      type: 'screenshot',
      title: 'Missing Dashboard',
      description: 'The dashboard section was supposed to have analytics',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'ev_2',
      userId: 'user_1',
      type: 'document',
      title: 'Original Agreement',
      description: 'The signed agreement showing agreed features',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
  messages: [
    {
      id: 'msg_1',
      userId: 'system',
      userRole: 'system',
      message: 'Dispute opened: Quality Issues with Website Development. Both parties are encouraged to communicate and reach a mutual resolution within 7 days.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 'msg_2',
      userId: 'user_1',
      userRole: 'initiator',
      message: 'I have uploaded evidence showing the missing features. The agreement clearly states these should have been included.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'msg_3',
      userId: 'user_2',
      userRole: 'respondent',
      message: 'The features mentioned were marked as optional in our discussions. I can add them for an additional fee.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      id: 'msg_4',
      userId: 'system',
      userRole: 'system',
      message: 'A mediator has been assigned to help resolve this dispute.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
  ],
};

const statusConfig = {
  open: { label: 'Open', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800', icon: Clock },
  mediation: { label: 'In Mediation', color: 'bg-purple-100 text-purple-800', icon: Users },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export function DisputeScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'evidence' | 'details'>('messages');

  const dispute = mockDispute; // In production, fetch by ID
  const status = statusConfig[dispute.status as keyof typeof statusConfig];
  const userId = user?.id || '';
  const isInitiator = userId === dispute.initiatorId;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In production: await addDisputeMessage(dispute.id, { ... })
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Dispute #{dispute.id.slice(-6)}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agreement #{dispute.agreementId.slice(-6)}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['messages', 'evidence', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-auto">
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {dispute.messages.map((message) => {
              const isSystem = message.userRole === 'system';
              const isOwn = message.userId === userId;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isSystem ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {isSystem ? (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isOwn
                            ? 'bg-purple-600 text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
                        {message.userRole === 'mediator' ? 'Mediator • ' : ''}
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>

            {dispute.evidence.map((ev) => (
              <div
                key={ev.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{ev.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ev.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted by {ev.userId === userId ? 'you' : 'other party'} • {formatDate(ev.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}

            {dispute.evidence.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No evidence submitted yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dispute Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                  <p className="text-gray-900 dark:text-white">{dispute.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {DISPUTE_TYPES.find(t => t.value === dispute.type)?.label || dispute.type}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{dispute.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desired Resolution</p>
                  <p className="text-gray-900 dark:text-white">{dispute.desiredResolution}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Filed On</p>
                  <p className="text-gray-900 dark:text-white">
                    {dispute.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your Role</p>
                  <p className="text-gray-900 dark:text-white">
                    {isInitiator ? 'Initiator (filed the dispute)' : 'Respondent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Request Mediation
                </Button>
                
                {isInitiator && dispute.status === 'open' && (
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <XCircle className="w-4 h-4 mr-2" />
                    Withdraw Dispute
                  </Button>
                )}
                
                <Button variant="outline" className="w-full justify-start text-green-600 hover:text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Propose Resolution
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Dispute Timeline</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Disputes are typically resolved within 5-7 business days. Complex cases may take longer. 
                    Keep communication professional and provide clear evidence to support your case.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Message input (only on messages tab) */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// New Dispute Screen
export function NewDisputeScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    agreementId: '',
    type: '',
    title: '',
    description: '',
    desiredResolution: '',
  });

  const handleSubmit = async () => {
    // In production: await createDispute({ ...formData })
    navigate('/disputes');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">File a Dispute</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s <= step ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select Dispute Type
              </h2>
              <div className="space-y-3">
                {DISPUTE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.type === type.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{type.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Describe the Issue
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dispute Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief summary of the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explain what happened in detail..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={5}
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Desired Resolution
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What outcome would resolve this dispute?
                  </label>
                  <textarea
                    value={formData.desiredResolution}
                    onChange={(e) => setFormData({ ...formData, desiredResolution: e.target.value })}
                    placeholder="e.g., Full refund, partial refund, completion of remaining work..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                  />
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Once submitted, the other party will be notified and have 7 days to respond. 
                    You can add evidence to support your case after filing.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.type}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.desiredResolution}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Submit Dispute
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
