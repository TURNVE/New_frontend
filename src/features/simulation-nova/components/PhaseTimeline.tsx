/**
 * PhaseTimeline - Shows progress through 4 phases
 */

import { Check } from 'lucide-react';
import { Phase, PHASES } from '../data/novaPayConfig';

interface PhaseTimelineProps {
  currentPhase: Phase;
  currentWeek: number;
  completedDeliverables: string[];
}

export function PhaseTimeline({ currentPhase, currentWeek, completedDeliverables }: PhaseTimelineProps) {
  const currentPhaseIndex = PHASES.findIndex(p => p.id === currentPhase);

  const isPhaseComplete = (phaseIndex: number) => {
    const phase = PHASES[phaseIndex];
    const requiredDeliverables: Record<string, string[]> = {
      discovery: ['discovery_summary'],
      definition: ['prd', 'roadmap'],
      delivery: ['risk_log', 'stakeholder_update'],
      launch: ['launch_plan', 'retrospective']
    };
    const required = requiredDeliverables[phase.id] || [];
    return required.every(d => completedDeliverables.includes(d));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connection line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/40" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500" 
          style={{ 
            width: `${(currentPhaseIndex / 3) * 100}%`
          }} 
        />

        {PHASES.map((phase, index) => {
          const isActive = index === currentPhaseIndex;
          const isPast = index < currentPhaseIndex;
          const isComplete = isPhaseComplete(index);
          const isReachable = index <= currentPhaseIndex + 1;

          return (
            <div key={phase.id} className="relative flex flex-col items-center z-10">
              {/* Phase indicator */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isComplete 
                    ? 'bg-emerald-500' 
                    : isActive 
                      ? 'bg-primary shadow-lg shadow-primary/30' 
                      : isReachable
                        ? 'bg-card border border-border'
                        : 'bg-background border border-border/40'
                }`}
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-white" />
                ) : isActive ? (
                  <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                ) : (
                  <span className={`text-xs ${isReachable ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>{index + 1}</span>
                )}
              </div>

              {/* Phase name */}
              <div className="mt-3 text-center">
                <span 
                  className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-primary' : isPast ? 'text-foreground' : 'text-muted-foreground/40'
                  }`}
                >
                  {phase.name}
                </span>
                <p className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'}`}>
                  Wk {phase.weeks[0]}-{phase.weeks[1]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current phase description */}
      <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Current Phase
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">
              {PHASES[currentPhaseIndex].name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {PHASES[currentPhaseIndex].description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">Week {currentWeek}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">of 8</p>
          </div>
        </div>
      </div>
    </div>
  );
}