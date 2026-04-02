import { motion } from 'framer-motion';
import { DollarSign, MessageSquare, Settings, ClipboardList, ChevronDown } from 'lucide-react';
import type { ScenarioAction } from '../../simulation/core/SimulationEngine';

interface ActionMenuProps {
  actions: ScenarioAction[];
  onActionSelect: (actionId: string) => void;
}

const categoryConfig = {
  resource: {
    icon: DollarSign,
    label: 'Resource',
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-50 hover:border-emerald-200',
  },
  communication: {
    icon: MessageSquare,
    label: 'Communication',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-50 hover:border-blue-200',
  },
  technical: {
    icon: Settings,
    label: 'Technical',
    color: 'bg-violet-500',
    hoverColor: 'hover:bg-violet-50 hover:border-violet-200',
  },
  process: {
    icon: ClipboardList,
    label: 'Process',
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-50 hover:border-amber-200',
  },
};

function ActionButton({ action, onClick }: { action: ScenarioAction; onClick: () => void }) {
  const config = categoryConfig[action.category] || categoryConfig.process;
  const Icon = config.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent ${config.hoverColor} transition-all w-full`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900 text-sm">{action.name}</p>
        <p className="text-xs text-gray-500">{action.choices.length} options</p>
      </div>
    </motion.button>
  );
}

export function ActionMenu({ actions, onActionSelect }: ActionMenuProps) {
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ScenarioAction[]>);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Actions</h3>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <span>View All</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ActionButton 
              action={action} 
              onClick={() => onActionSelect(action.id)} 
            />
          </motion.div>
        ))}
      </div>

      {actions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No actions available in this phase</p>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;