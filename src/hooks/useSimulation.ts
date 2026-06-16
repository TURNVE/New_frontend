import { useState, useCallback, useEffect, useRef } from 'react';
import {
  SimulationEngine,
} from '../simulation/core/SimulationEngine';
import type {
  Scenario,
  GameState,
  ScoreResult,
  ActionResult,
  Phase,
  TimelineEvent,
  ScenarioAction,
  GameSpeed,
} from '../simulation/core/SimulationEngine';
import { createDefaultScenario } from '../simulation/core/SimulationEngine';
import { simulations } from '../lib/simulations';

export interface PersistenceConfig {
  autoSaveInterval: number;
  saveOnDecision: boolean;
  saveOnPhaseChange: boolean;
  maxSnapshots: number;
}

export interface UseSimulationReturn {
  gameState: GameState | null;
  scenario: Scenario | null;
  currentPhase: Phase | null;
  isRunning: boolean;
  isPaused: boolean;
  speed: GameSpeed;
  score: ScoreResult | null;
  availableActions: ScenarioAction[];
  upcomingEvents: TimelineEvent[];
  lastActionResult: ActionResult | null;
  lastEvent: TimelineEvent | null;
  isCompleted: boolean;

  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  setSpeed: (speed: GameSpeed) => void;
  makeDecision: (actionId: string, choiceId: string) => ActionResult;
  advanceTime: () => void;
  restartSimulation: () => void;
  loadScenario: (scenario: Scenario) => void;

  saveState: (reason?: string) => Promise<void>;
  loadState: (sessionId: string) => Promise<boolean>;
  updateCustomState: (key: string, value: any) => void;
  isDirty: boolean;
  sessionId: string | null;
}

const DEFAULT_PERSISTENCE_CONFIG: PersistenceConfig = {
  autoSaveInterval: 120000,
  saveOnDecision: true,
  saveOnPhaseChange: true,
  maxSnapshots: 10,
};

export function useSimulation(
  initialScenario?: Scenario,
  persistenceConfig?: Partial<PersistenceConfig>
): UseSimulationReturn {
  const config = { ...DEFAULT_PERSISTENCE_CONFIG, ...persistenceConfig };
  const engineRef = useRef<SimulationEngine | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeedState] = useState<GameSpeed>(1);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [availableActions, setAvailableActions] = useState<ScenarioAction[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<TimelineEvent[]>([]);
  const [lastActionResult, setLastActionResult] = useState<ActionResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastEvent, setLastEvent] = useState<TimelineEvent | null>(null);

  const saveState = useCallback(async (reason: string = 'manual') => {
    if (!sessionIdRef.current || !gameStateRef.current || !engineRef.current) return;

    const state = gameStateRef.current;

    try {
      const { session, error } = await simulations.updateSession(sessionIdRef.current, {
        state,
        current_week: state.week,
        current_phase: state.currentPhaseId || 'phase-1',
        status: gameStateRef.current?.week >= gameStateRef.current?.totalWeeks ? 'completed' : 'active'
      });

      if (!error) {
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, []);

  const loadState = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const { session, error } = await simulations.getSession(sessionId);

      if (error || !session) return false;

      if (session.state && engineRef.current) {
        setGameState(session.state as GameState);
        sessionIdRef.current = sessionId;
        setIsDirty(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to load state:', error);
      return false;
    }
  }, []);

  const updateCustomState = useCallback((key: string, value: any) => {
    if (!engineRef.current || !sessionIdRef.current || !gameStateRef.current) return;

    const updatedState = { ...gameStateRef.current, [key]: value };
    gameStateRef.current = updatedState as GameState;
    setGameState(updatedState as GameState);

    simulations.updateSession(sessionIdRef.current, {
      state: { ...updatedState, currentPhase: updatedState.currentPhaseId || 'phase-1' }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const scenarioToLoad = initialScenario || createDefaultScenario();
    engineRef.current = new SimulationEngine(scenarioToLoad);
    setScenario(scenarioToLoad);
    setGameState(scenarioToLoad.initialState);
    setCurrentPhase(scenarioToLoad.phases[0] || null);

    const engine = engineRef.current;
    engine.setOnStateChange((state) => {
      gameStateRef.current = state;
      setGameState(state);
      setIsDirty(true);
      const phase = engine.getCurrentPhase() || null;
      setCurrentPhase(phase);
      setAvailableActions(
        phase?.availableActions
          .map(id => scenarioToLoad.actions[id as keyof typeof scenarioToLoad.actions])
          .filter((action): action is ScenarioAction => Boolean(action)) || []
      );
    });

    engine.setOnPhaseChange((phase) => {
      setCurrentPhase(phase);
    });

    engine.setOnEvent((event) => {
      setGameState(prev => {
        if (!prev) return prev;
        return { ...prev, lastEvent: event };
      });
    });

    engine.setOnScoreUpdate((score) => {
      setScore(score);
    });

    return () => {
      engine.stop();
    };
  }, [initialScenario]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Handle auto-save separately
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        saveState('unload');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const autoSaveTimer = setInterval(() => {
      if (isDirty) {
        saveState('autosave');
      }
    }, config.autoSaveInterval);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(autoSaveTimer);
    };
  }, [isDirty, saveState, config.autoSaveInterval]);

  const startSimulation = useCallback(async () => {
    if (engineRef.current) {
      if (!sessionIdRef.current && scenario) {
        const { session } = await simulations.createSession(scenario.key || 'default-scenario');
        if (session) {
          sessionIdRef.current = session.id;
        }
      }

      engineRef.current.start();
      setIsRunning(true);
      setIsPaused(false);

      if (sessionIdRef.current && config.autoSaveInterval > 0) {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setInterval(() => {
          saveState('auto');
        }, config.autoSaveInterval);
      }
    }
  }, [saveState, config.autoSaveInterval, scenario]);

  const pauseSimulation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
      setIsPaused(true);
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    }
  }, []);

  const resumeSimulation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const setSpeed = useCallback((newSpeed: GameSpeed) => {
    if (engineRef.current) {
      engineRef.current.setSpeed(newSpeed);
      setSpeedState(newSpeed);
    }
  }, []);

  const makeDecision = useCallback((actionId: string, choiceId: string): ActionResult => {
    if (!engineRef.current) {
      return {
        success: false,
        newState: gameStateRef.current!,
        feedback: 'Engine not initialized',
        effects: {},
        phaseChanged: false
      };
    }

    const result = engineRef.current.processAction(actionId, choiceId);
    setLastActionResult(result);

    if (sessionIdRef.current) {
      // Save decision to db asynchronously
      simulations.createDecision({
        session_id: sessionIdRef.current,
        action_id: actionId,
        choice_id: choiceId,
        decision_text: 'Choice applied',
        state_after: result.newState as unknown as Record<string, unknown>
      });
    }

    if (result.newState.week >= result.newState.totalWeeks) {
      setIsRunning(false);
      setIsCompleted(true);
      if (sessionIdRef.current) {
        const finalScore = engineRef.current.calculateScore();
        simulations.createScore({
          session_id: sessionIdRef.current,
          execution_score: finalScore.execution || 0,
          risk_management_score: finalScore.riskManagement || 0,
          stakeholder_score: finalScore.stakeholderManagement || 0,
          budget_score: finalScore.budgetManagement || 0,
          team_management_score: finalScore.teamLeadership || 0,
          overall_score: finalScore.overall,
          grade: finalScore.grade
        }).catch(err => console.error("Error creating score:", err));
        simulations.updateSession(sessionIdRef.current, { status: 'completed', completed_at: new Date().toISOString() });
      }
    }

    return result;
  }, []);

  const advanceTime = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.tick();
    }
  }, []);

  const restartSimulation = useCallback(() => {
    if (engineRef.current && scenario) {
      engineRef.current.loadScenario(scenario);
      engineRef.current.restart();
      setGameState(scenario.initialState);
      setCurrentPhase(scenario.phases[0] || null);
      setAvailableActions(
        scenario.phases[0]?.availableActions
          .map(id => scenario.actions[id])
          .filter(Boolean) || []
      );
      setUpcomingEvents(
        scenario.timelineEvents.filter(e => e.week > scenario.initialState.week)
      );
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);
      setLastActionResult(null);
      setScore(engineRef.current.calculateScore());
    }
  }, [scenario]);

  const loadScenario = useCallback((newScenario: Scenario) => {
    if (engineRef.current) {
      engineRef.current.loadScenario(newScenario);
      setScenario(newScenario);
      setGameState(newScenario.initialState);
      setCurrentPhase(newScenario.phases[0] || null);
      setAvailableActions(
        newScenario.phases[0]?.availableActions
          .map(id => newScenario.actions[id])
          .filter(Boolean) || []
      );
      setUpcomingEvents(
        newScenario.timelineEvents.filter(e => e.week > newScenario.initialState.week)
      );
      setScore(engineRef.current.calculateScore());
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);
      setLastActionResult(null);
    }
  }, []);

  return {
    gameState,
    scenario,
    currentPhase,
    isRunning,
    isPaused,
    speed,
    score,
    availableActions,
    upcomingEvents,
    lastActionResult,
    lastEvent,
    isCompleted,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    setSpeed,
    makeDecision,
    advanceTime,
    restartSimulation,
    loadScenario,
    saveState,
    loadState,
    updateCustomState,
    isDirty,
    sessionId: sessionIdRef.current,
  };
}

export default useSimulation;