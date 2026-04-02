import { motion } from 'framer-motion';
import { Users, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { Stakeholder } from '../../simulation/core/SimulationEngine';

interface StakeholderBarProps {
  stakeholders: Stakeholder[];
  onStakeholderClick?: (stakeholder: Stakeholder) => void;
}

function SatisfactionMeter({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 70) return 'bg-emerald-500';
    if (val >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${getColor(value)} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

function StakeholderAvatar({ stakeholder }: { stakeholder: Stakeholder }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getBgColor = (satisfaction: number) => {
    if (satisfaction >= 70) return 'bg-emerald-500';
    if (satisfaction >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative group">
      <motion.button
        onClick={() => {}}
        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`w-12 h-12 rounded-full ${getBgColor(stakeholder.satisfaction)} flex items-center justify-center text-white font-bold text-sm`}>
          {getInitials(stakeholder.name)}
        </div>
        <div className="w-16 text-center">
          <p className="text-xs font-medium text-gray-900 truncate w-full">{stakeholder.name.split(' ')[0]}</p>
          <p className="text-xs text-gray-500 truncate w-full">{stakeholder.role}</p>
        </div>
      </motion.button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <p className="font-bold">{stakeholder.name}</p>
        <p className="text-gray-300">{stakeholder.role} - {stakeholder.department}</p>
        <p className="text-gray-300">Satisfaction: {stakeholder.satisfaction}%</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

export function StakeholderBar({ stakeholders, onStakeholderClick }: StakeholderBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Stakeholders</h3>
        </div>
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stakeholders.map((stakeholder, index) => (
            <motion.div
              key={stakeholder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StakeholderAvatar stakeholder={stakeholder} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Satisfaction Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Average Satisfaction</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.round(stakeholders.reduce((sum, s) => sum + s.satisfaction, 0) / stakeholders.length)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">High Priority</p>
            <p className="text-lg font-bold text-emerald-600">
              {stakeholders.filter(s => s.satisfaction >= 70).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Needs Attention</p>
            <p className="text-lg font-bold text-red-600">
              {stakeholders.filter(s => s.satisfaction < 40).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakeholderBar;