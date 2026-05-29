import React, { useState } from 'react';
import { ChevronDown, Check, Circle, AlertCircle } from 'lucide-react';

export interface SuccessCriterion {
  id: string;
  description: string;
  completed: boolean;
  weekDue?: number;
  priority: 'high' | 'medium' | 'low';
}

interface SuccessCriteriaListProps {
  criteria: SuccessCriterion[];
  currentWeek: number;
}

const getPriorityColor = (priority: SuccessCriterion['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-blue-400';
  }
};

const getStatusIcon = (completed: boolean, weekDue?: number, currentWeek?: number) => {
  if (completed) {
    return <Check className="w-4 h-4 text-emerald-400" />;
  }
  if (weekDue && currentWeek && weekDue < currentWeek) {
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  }
  return <Circle className="w-4 h-4 text-[#a1a1aa]" />;
};

export const SuccessCriteriaList: React.FC<SuccessCriteriaListProps> = ({
  criteria,
  currentWeek,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = criteria.filter(c => c.completed).length;

  return (
    <div className="border-t border-white/5 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] hover:text-white mb-2"
      >
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
          Success Criteria
        </div>
        <span className={completedCount === criteria.length ? 'text-emerald-400' : ''}>
          {completedCount}/{criteria.length}
        </span>
      </button>
      
      {isExpanded && (
        <div className="space-y-2 mt-3">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                criterion.completed
                  ? 'bg-emerald-500/5'
                  : criterion.weekDue && criterion.weekDue < currentWeek
                  ? 'bg-red-500/5'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="mt-0.5">
                {getStatusIcon(criterion.completed, criterion.weekDue, currentWeek)}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${criterion.completed ? 'text-emerald-400/70 line-through' : 'text-[#ededed]'}`}>
                  {criterion.description}
                </span>
                {criterion.weekDue && (
                  <span className={`text-xs ml-2 ${criterion.weekDue < currentWeek && !criterion.completed ? 'text-red-400' : 'text-[#a1a1aa]'}`}>
                    Week {criterion.weekDue}
                  </span>
                )}
              </div>
              <span className={`text-[10px] uppercase ${getPriorityColor(criterion.priority)}`}>
                {criterion.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuccessCriteriaList;