/**
 * useSimulationState - Phase state machine for NovaPay simulation
 */

import { useState, useCallback, useMemo } from 'react';
import { Phase, PhaseConfig, PHASES, KPIState, INITIAL_KPIS } from '../data/novaPayConfig';

export interface SimulationState {
  currentWeek: number;
  totalWeeks: number;
  phase: Phase;
  phaseConfig: PhaseConfig;
  kpis: KPIState;
  completedDeliverables: string[];
  isCompleted: boolean;
}

export interface UseSimulationStateReturn {
  state: SimulationState;
  advanceWeek: () => void;
  completeDeliverable: (deliverableId: string) => void;
  updateKPI: (key: keyof KPIState, value: number) => void;
  canAdvancePhase: () => boolean;
  advancePhase: () => void;
  getPhaseProgress: () => number;
  advanceToNextPhase: () => void;
}

export function useSimulationState(initialWeek: number = 1): UseSimulationStateReturn {
  const [currentWeek, setCurrentWeek] = useState(initialWeek);
  const [completedDeliverables, setCompletedDeliverables] = useState<string[]>([]);
  const [kpis, setKpis] = useState<KPIState>(INITIAL_KPIS);

  const currentPhase = useMemo(() => {
    for (const phase of PHASES) {
      if (currentWeek >= phase.weeks[0] && currentWeek <= phase.weeks[1]) {
        return phase.id;
      }
    }
    return 'launch' as Phase;
  }, [currentWeek]);

  const phaseConfig = useMemo(() => {
    return PHASES.find(p => p.id === currentPhase) || PHASES[0];
  }, [currentPhase]);

  const isCompleted = currentWeek > 8;

  const state: SimulationState = {
    currentWeek,
    totalWeeks: 8,
    phase: currentPhase,
    phaseConfig,
    kpis,
    completedDeliverables,
    isCompleted
  };

  const advanceWeek = useCallback(() => {
    setCurrentWeek(prev => Math.min(prev + 1, 8));
  }, []);

  const completeDeliverable = useCallback((deliverableId: string) => {
    setCompletedDeliverables(prev => 
      prev.includes(deliverableId) ? prev : [...prev, deliverableId]
    );
  }, []);

  const updateKPI = useCallback((key: keyof KPIState, value: number) => {
    setKpis(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, value)) }));
  }, []);

  const canAdvancePhase = useCallback(() => {
    const requiredDeliverables: Record<Phase, string[]> = {
      discovery: ['discovery_summary'],
      definition: ['prd', 'roadmap'],
      delivery: ['risk_log', 'stakeholder_update'],
      launch: ['launch_plan', 'retrospective']
    };
    const required = requiredDeliverables[currentPhase] || [];
    return required.every(d => completedDeliverables.includes(d));
  }, [currentPhase, completedDeliverables]);

  const advancePhase = useCallback(() => {
    const currentPhaseIndex = PHASES.findIndex(p => p.id === currentPhase);
    if (currentPhaseIndex < PHASES.length - 1) {
      const nextPhase = PHASES[currentPhaseIndex + 1];
      setCurrentWeek(nextPhase.weeks[0]);
    }
  }, [currentPhase]);

  const getPhaseProgress = useCallback(() => {
    const [start, end] = phaseConfig.weeks;
    const phaseDuration = end - start + 1;
    const weekInPhase = currentWeek - start + 1;
    return Math.min(100, Math.round((weekInPhase / phaseDuration) * 100));
  }, [currentWeek, phaseConfig]);

  const advanceToNextPhase = useCallback(() => {
    if (canAdvancePhase()) {
      advancePhase();
    }
  }, [canAdvancePhase, advancePhase]);

  return {
    state,
    advanceWeek,
    completeDeliverable,
    updateKPI,
    canAdvancePhase,
    advancePhase,
    getPhaseProgress,
    advanceToNextPhase
  };
}
