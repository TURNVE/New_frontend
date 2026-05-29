import { useState, useEffect } from 'react';
import {
  X, MessageSquare, Mail, Slack, Clock,
  AlertTriangle, Send, User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface StakeholderChallenge {
  id: string;
  stakeholderId: string;
  channel: 'slack' | 'email' | 'meeting' | 'modal';
  subject: string;
  message: string;
  context: string;
  requiresResponse: boolean;
  responseRequired: boolean;
  timeoutMinutes?: number;
}

interface StakeholderChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: StakeholderChallenge[];
  onRespond: (challengeId: string, response: string) => void;
  stakeholderNames?: Record<string, string>;
}

export const StakeholderChallengeModal: React.FC<StakeholderChallengeModalProps> = ({
  isOpen,
  onClose,
  challenges,
  onRespond,
  stakeholderNames = {},
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<StakeholderChallenge | null>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (challenges.length > 0 && !selectedChallenge) {
      setSelectedChallenge(challenges[0]);
    }
  }, [challenges, selectedChallenge]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'slack': return <Slack className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <User className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStakeholderName = (id: string) => {
    const names: Record<string, string> = {
      cto: 'Sarah Chen (CTO)',
      cfo: 'Diana Rodriguez (CFO)',
      product: 'Mike Johnson (VP Product)',
      devops: 'Alex Kim (DevOps Lead)',
      ...stakeholderNames,
    };
    return names[id] || id;
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'slack': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'email': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meeting': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSubmitResponse = () => {
    if (!selectedChallenge || !response.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onRespond(selectedChallenge.id, response);
      setResponse('');
      setSelectedChallenge(null);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stakeholder Challenge</h2>
              <p className="text-amber-100 text-sm">Response required</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {challenges.length > 1 && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-2 overflow-x-auto">
              {challenges.map((challenge, idx) => (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedChallenge?.id === challenge.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/60'
                  }`}
                >
                  {idx + 1}. {getStakeholderName(challenge.stakeholderId)}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedChallenge ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getStakeholderName(selectedChallenge.stakeholderId)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedChallenge.context}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className={getChannelColor(selectedChallenge.channel)}>
                  <span className="flex items-center gap-1">
                    {getChannelIcon(selectedChallenge.channel)}
                    {selectedChallenge.channel}
                  </span>
                </Badge>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {selectedChallenge.subject}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {selectedChallenge.message}
                </p>
              </div>

              {selectedChallenge.timeoutMinutes && (
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>Response needed within {selectedChallenge.timeoutMinutes} minutes</span>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Your Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Write your response here..."
                  rows={6}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Be specific, honest, and take ownership. Avoid vague language like "hopefully" or "maybe".
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
              <Button variant="outline" onClick={onClose} className="border-gray-300">
                Dismiss
              </Button>
              <Button
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !response.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSubmitting ? (
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Response
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending challenges</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default StakeholderChallengeModal;