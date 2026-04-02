import React, { useState } from 'react';
import { PanelLeftClose, PanelLeft, BookOpen, Target, Clock, X } from 'lucide-react';
import { KPICard, type KPI } from './KPICard';
import { SuccessCriteriaList, type SuccessCriterion } from './SuccessCriteriaList';
import { TimelineDisplay, type TimelinePhase } from './TimelineDisplay';

export interface ProjectBriefingData {
  id: string;
  title: string;
  description: string;
  totalWeeks: number;
  clientName?: string;
  companyName?: string;
  industry?: string;
  projectType?: string;
  budget?: number;
  teamSize?: number;
  kpis: KPI[];
  successCriteria: SuccessCriterion[];
  timeline?: TimelinePhase[];
  timelinePhases?: { id: string; name: string; status: string; description: string }[];
  stakeholders?: any[];
  keyDecisions?: any[];
  currentRisks?: any[];
  marketContext?: string;
  technicalStack?: string;
}

interface ProjectReferencePanelProps {
  briefing: ProjectBriefingData;
  currentWeek: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ProjectReferencePanel: React.FC<ProjectReferencePanelProps> = ({
  briefing,
  currentWeek,
  isOpen = true,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(isOpen);

  if (!briefing) {
    return null;
  }

  if (!isPanelOpen) {
    return (
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed top-20 right-4 z-50 bg-[#141414] border border-white/10 rounded-lg p-2 hover:bg-white/5 transition-colors"
        title="Open Project Reference"
      >
        <BookOpen className="w-5 h-5 text-blue-400" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-[#141414] border-l border-white/10 z-40 flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white text-sm">Project Reference</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/5 rounded transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <PanelLeftClose className="w-4 h-4 text-[#a1a1aa]" />
            ) : (
              <PanelLeft className="w-4 h-4 text-[#a1a1aa]" />
            )}
          </button>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="p-1 hover:bg-white/5 rounded transition-colors"
            title="Close panel"
          >
            <X className="w-4 h-4 text-[#a1a1aa]" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs text-[#a1a1aa] mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Week {currentWeek}/{briefing.totalWeeks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>{briefing.successCriteria.filter(c => c.completed).length}/{briefing.successCriteria.length} goals</span>
            </div>
          </div>

          {/* KPIs Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-3">
              Key Performance Indicators
            </h3>
            <div className="space-y-2">
              {briefing.kpis.slice(0, 3).map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} compact />
              ))}
            </div>
          </div>

          {/* Success Criteria */}
          <SuccessCriteriaList
            criteria={briefing.successCriteria}
            currentWeek={currentWeek}
          />

          {/* Timeline */}
          {(() => {
            if (!briefing.timeline && !briefing.timelinePhases) return null;
            
            const phases: TimelinePhase[] = briefing.timeline || 
              (briefing.timelinePhases?.map((phase, idx, arr) => {
                const weeksPerPhase = Math.ceil(briefing.totalWeeks / arr.length);
                return {
                  id: phase.id,
                  name: phase.name,
                  weekStart: idx * weeksPerPhase + 1,
                  weekEnd: (idx + 1) * weeksPerPhase,
                  description: phase.description,
                };
              }) || []);
            
            return (
              <TimelineDisplay
                phases={phases}
                currentWeek={currentWeek}
                totalWeeks={briefing.totalWeeks}
              />
            );
          })()}

          {/* Expand button for more details */}
          {briefing.kpis.length > 3 && (
            <button className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-2">
              View all {briefing.kpis.length} KPIs
            </button>
          )}
        </div>
      )}

      {/* Collapsed state - show mini indicators */}
      {!isExpanded && (
        <div className="flex-1 p-2 space-y-1">
          {briefing.kpis.slice(0, 4).map((kpi) => (
            <div
              key={kpi.id}
              className="flex items-center justify-between p-2 rounded bg-white/5"
            >
              <span className="text-xs text-[#a1a1aa]">{kpi.label}</span>
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    kpi.status === 'critical' ? 'bg-red-500' :
                    kpi.status === 'warning' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${(kpi.value / kpi.maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectReferencePanel;