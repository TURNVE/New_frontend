import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, TrendingUp, DollarSign, Users, Shield, Target } from 'lucide-react';
import type { ScenarioAction, ActionChoice, StateEffects } from '../../simulation/core/SimulationEngine';

interface DecisionPanelProps {
  action: ScenarioAction | null;
  onDecision: (choiceId: string) => void;
  onDismiss: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'resource': return 'bg-emerald-500';
    case 'communication': return 'bg-blue-500';
    case 'technical': return 'bg-violet-500';
    case 'process': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

const getRiskColor = (risk: number) => {
  if (risk < 0.3) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (risk < 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

const getRiskLabel = (risk: number) => {
  if (risk < 0.3) return 'Low Risk';
  if (risk < 0.6) return 'Medium Risk';
  return 'High Risk';
};

const formatEffect = (key: string, value: number) => {
  const icons: Record<string, React.ReactNode> = {
    budget: <DollarSign className="w-3 h-3" />,
    teamMorale: <Users className="w-3 h-3" />,
    riskLevel: <Shield className="w-3 h-3" />,
    stakeholderTrust: <Target className="w-3 h-3" />,
    progress: <TrendingUp className="w-3 h-3" />
  };

  const labels: Record<string, string> = {
    budget: 'Budget',
    teamMorale: 'Team',
    riskLevel: 'Risk',
    stakeholderTrust: 'Trust',
    progress: 'Progress'
  };

  const effect = value > 0 ? '+' : '';
  return { icon: icons[key], label: labels[key] || key, effect: `${effect}${value}` };
};

function ChoiceCard({ choice, onSelect }: { choice: ActionChoice; onSelect: () => void }) {
  const effects = choice.effects;
  const effectEntries = Object.entries(effects).filter(([k]) => 
    ['budget', 'teamMorale', 'riskLevel', 'stakeholderTrust', 'progress'].includes(k)
  );

  return (
    <motion.button
      onClick={onSelect}
      className="w-full text-left p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {choice.label}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{choice.description}</p>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(choice.risk)}`}>
          {getRiskLabel(choice.risk)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {effectEntries.map(([key, value]) => {
          const { icon, label, effect } = formatEffect(key, value);
          const isPositive = key === 'riskLevel' ? value < 0 : value > 0;
          return (
            <div 
              key={key}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {icon}
              <span>{label}: {effect}</span>
            </div>
          );
        })}
        {choice.timeCost > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3" />
            <span>{choice.timeCost} week{choice.timeCost > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="flex items-center text-sm text-blue-600 font-medium">
        Select <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}

export function DecisionPanel({ action, onDecision, onDismiss }: DecisionPanelProps) {
  if (!action) return null;

  const categoryColor = getCategoryColor(action.category);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 ${categoryColor} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium opacity-80 uppercase tracking-wider">
                  {action.category}
                </span>
                <h2 className="text-xl font-bold">{action.name}</h2>
              </div>
              <button 
                onClick={onDismiss}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm opacity-90 mt-1">{action.description}</p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {action.choices.map((choice) => (
                <ChoiceCard 
                  key={choice.id} 
                  choice={choice} 
                  onSelect={() => onDecision(choice.id)} 
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DecisionPanel;