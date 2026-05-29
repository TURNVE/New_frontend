import { useState } from 'react';
import {
  Plus, Calendar, ChevronLeft, ChevronRight,
  Flag, Target, Zap, Shield, CheckCircle, Clock
} from 'lucide-react';
import type { RoadmapPhase, RoadmapItem } from '../../pmtools/types';

interface RoadmapPanelProps {
  totalWeeks?: number;
  currentWeek?: number;
  phases: RoadmapPhase[];
}

export const RoadmapPanel: React.FC<RoadmapPanelProps> = ({ totalWeeks = 12, currentWeek = 1, phases }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'in-progress': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'delayed': return <Clock className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />;
    }
  };

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case 'phase-1': return 'bg-blue-500';
      case 'phase-2': return 'bg-purple-500';
      case 'phase-3': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product Roadmap</h2>
            <p className="text-xs text-[#a1a1aa]">12-week delivery plan</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'timeline' ? 'bg-blue-500 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-white/5 text-[#a1a1aa]'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'list' ? 'bg-blue-500 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-white/5 text-[#a1a1aa]'}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedWeek(w => Math.max(1, w - 1))}
            className="p-2 hover:bg-gray-100 dark:bg-white/5 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 text-[#a1a1aa]" />
          </button>
          <div className="text-sm text-gray-900 dark:text-white">
            Week {selectedWeek} of {totalWeeks}
          </div>
          <button
            onClick={() => setSelectedWeek(w => Math.min(totalWeeks, w + 1))}
            className="p-2 hover:bg-gray-100 dark:bg-white/5 rounded-lg"
          >
            <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

            {/* Week Markers */}
            <div className="flex justify-between mb-6 px-1">
              {[1, 4, 8, 12].map(w => (
                <div key={w} className="text-xs text-[#a1a1aa]">Week {w}</div>
              ))}
            </div>

            {/* Phases */}
            <div className="space-y-6">
              {phases.map(phase => (
                <div key={phase.id} className="relative pl-10">
                  {/* Phase Marker */}
                  <div
                    className={`absolute left-2 top-1 w-4 h-4 rounded-full ${getPhaseColor(phase.id)}`}
                  />

                  <div className="bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{phase.name}</h3>
                      <span className="text-xs text-[#a1a1aa]">
                        Week {phase.startWeek} - {phase.endWeek}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {phase.items.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-2 rounded-lg ${selectedWeek >= item.startWeek && selectedWeek <= item.endWeek
                              ? 'bg-blue-500/10 border border-blue-500/20'
                              : 'bg-gray-100 dark:bg-white/5'
                            }`}
                        >
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-900 dark:text-white">{item.title}</span>
                              <span className="text-xs text-[#a1a1aa]">
                                W{item.startWeek}-{item.endWeek}
                              </span>
                            </div>
                            <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.status === 'completed' ? 'bg-emerald-500' :
                                    item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                                  }`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {phases.flatMap(phase =>
              phase.items.map(item => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-[#a1a1aa] mt-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#a1a1aa]">
                        Week {item.startWeek} - {item.endWeek}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white mt-1">{item.progress}%</div>
                    </div>
                  </div>
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.status === 'completed' ? 'bg-emerald-500' :
                          item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6 text-xs text-[#a1a1aa]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-gray-500" />
            <span>Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPanel;