import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface ActionChoice {
  id: string;
  label: string;
  description: string;
  risk: number;
  timeCost: number;
}

interface SimulationAction {
  id: string;
  title: string;
  description: string;
  choices: ActionChoice[];
  priority?: 'high' | 'medium' | 'low';
}

interface ActionModalProps {
  action: SimulationAction | null;
  onClose: () => void;
  onSelect: (actionId: string, choiceId: string) => void;
}

export function ActionModal({ action, onClose, onSelect }: ActionModalProps) {
  const { displayedText: titleText, isTyping: titleTyping } = useTypingEffect(
    action?.title ?? '',
    { speed: 30, delay: 100, enabled: !!action }
  );
  const { displayedText: descText } = useTypingEffect(
    action?.description ?? '',
    { speed: 20, delay: 400, enabled: !!action }
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!action) return null;

  const priorityConfig = {
    high: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    medium: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    low: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  };
  const priority = action.priority ?? 'medium';
  const { icon: PriorityIcon, color, bg } = priorityConfig[priority];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-700">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <PriorityIcon className={`w-4 h-4 ${color}`} />
              <span className={`text-xs px-2 py-0.5 rounded-full ${bg} ${color}`}>
                {priority} priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-white min-h-[1.75rem]">{titleText}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-slate-300 mb-6 min-h-[3rem]">{descText}</p>

          <h3 className="text-sm font-medium text-slate-400 mb-3">Available Choices</h3>
          <div className="space-y-3">
            {action.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => onSelect(action.id, choice.id)}
                className="w-full p-4 text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-lg transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-white group-hover:text-blue-400">{choice.label}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${
                      choice.risk <= 3 ? 'bg-green-500/20 text-green-400' :
                      choice.risk <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Risk: {choice.risk}/10
                    </span>
                    <span className="text-slate-500">{choice.timeCost}w</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{choice.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;
