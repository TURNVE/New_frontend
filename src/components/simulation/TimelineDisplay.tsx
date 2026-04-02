import React, { useState } from 'react';
import { ChevronDown, Calendar, Flag } from 'lucide-react';

export interface TimelinePhase {
  id: string;
  name: string;
  weekStart: number;
  weekEnd: number;
  description?: string;
  milestones?: { week: number; title: string }[];
}

interface TimelineDisplayProps {
  phases: TimelinePhase[];
  currentWeek: number;
  totalWeeks: number;
}

export const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  phases,
  currentWeek,
  totalWeeks,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getPhaseStatus = (phase: TimelinePhase) => {
    if (currentWeek < phase.weekStart) return 'upcoming';
    if (currentWeek >= phase.weekStart && currentWeek <= phase.weekEnd) return 'current';
    return 'completed';
  };

  const getStatusColor = (status: ReturnType<typeof getPhaseStatus>) => {
    switch (status) {
      case 'current':
        return 'border-blue-500 bg-blue-500/10';
      case 'completed':
        return 'border-emerald-500/30 bg-transparent';
      case 'upcoming':
        return 'border-white/10 bg-transparent';
    }
  };

  return (
    <div className="border-t border-white/5 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] hover:text-white mb-2"
      >
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
          Timeline
        </div>
        <span>Week {currentWeek}/{totalWeeks}</span>
      </button>
      
      {isExpanded && (
        <div className="space-y-2 mt-3">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
            />
          </div>
          
          {phases.map((phase) => {
            const status = getPhaseStatus(phase);
            return (
              <div
                key={phase.id}
                className={`p-2 rounded-lg border-l-2 ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className={`w-3 h-3 ${
                      status === 'current' ? 'text-blue-400' :
                      status === 'completed' ? 'text-emerald-400' : 'text-[#a1a1aa]'
                    }`} />
                    <span className={`text-sm font-medium ${
                      status === 'current' ? 'text-white' :
                      status === 'completed' ? 'text-emerald-400/70' : 'text-[#a1a1aa]'
                    }`}>
                      {phase.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#a1a1aa]">
                    W{phase.weekStart}-{phase.weekEnd}
                  </span>
                </div>
                
                {phase.milestones && phase.milestones.length > 0 && (
                  <div className="mt-2 pl-5 space-y-1">
                    {phase.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs ${
                          milestone.week <= currentWeek ? 'text-emerald-400' : 'text-[#a1a1aa]'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Week {milestone.week}: {milestone.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimelineDisplay;