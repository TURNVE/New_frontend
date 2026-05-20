/**
 * useSimulationCore — The canonical simulation state hook
 *
 * Accepts a SimulationConfig and manages all runtime state including
 * per-week signals, events, actions, and the backlog overflow system.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type {
    SimulationConfig,
    GameStateSnapshot,
    ScenarioAction,
    ActionChoice,
    DecisionRecord,
    SimulationScore,
    Signal,
    WeeklyActionItem,
    WeeklyEvent,
    BacklogActionItem,
    CompletedAction,
    ArtifactRecord,
} from './types';
import { evaluateWeeklyActionSubmission } from './pmReview';
import { playSound } from '../../utils/sounds';

// ─── Constants ───────────────────────────────────────────────
const WEEK_TIMER_SECONDS = 1800; // 30 min per week per user request
const TICK_INTERVAL_MS = 1000;

// ─── Helper: build initial state from config ─────────────────
function buildInitialState(config: SimulationConfig): GameStateSnapshot {
    const week1Signals = (config.weeklySignals ?? []).filter((s) => s.week === 1);
    const week1Events = (config.weeklyEvents ?? []).filter((e) => e.week === 1);
    const week1Actions = (config.weeklyActions ?? []).filter((a) => a.week === 1);

    return {
        sessionId: `session-${Date.now()}`,
        simulationId: config.id,
        week: 1,
        totalWeeks: config.totalWeeks,
        timeLeft: WEEK_TIMER_SECONDS,
        budget: config.budget,
        initialBudget: config.budget,
        progress: 0,
        phaseProgress: 0,
        riskLevel: 0.25,
        teamMorale: 75,
        stakeholders: config.stakeholders.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            satisfaction: s.satisfaction,
        })),
        signals: [],
        decisionsMade: [],
        completedCriteria: [],
        artifacts: [],
        backlogItems: [],
        roadmapPhases: [],
        company: { name: config.companyName },
        // New fields
        completedActions: [],
        backlogActionItems: [],
        weeklySignalsShown: week1Signals,
        weeklyEventsShown: week1Events,
        weeklyActionsForThisWeek: week1Actions,
    };
}

// ─── Helper: advance week state ────────────────────────────────
function advanceWeekState(
    prev: GameStateSnapshot,
    config: SimulationConfig
): GameStateSnapshot {
    const nextWeek = prev.week + 1;
    const progress = Math.round((nextWeek / prev.totalWeeks) * 100);

    // New weekly signals/events/actions
    const nextSignals = (config.weeklySignals ?? []).filter((s) => s.week === nextWeek);
    const nextEvents = (config.weeklyEvents ?? []).filter((e) => e.week === nextWeek);
    const nextActions = (config.weeklyActions ?? []).filter((a) => a.week === nextWeek);

    // Move OVERDUE actions to backlog (actions whose dueWeek < nextWeek and not completed)
    const completedActionIds = new Set(prev.completedActions.map((c) => c.actionId));
    const existingBacklogIds = new Set(prev.backlogActionItems.map((b) => b.id));

    const overdueActions: BacklogActionItem[] = [
        // Check previous week's actions
        ...prev.weeklyActionsForThisWeek.filter((a) => {
            const isDue = a.dueWeek !== undefined ? a.dueWeek < nextWeek : a.week < nextWeek - 1;
            return isDue && !completedActionIds.has(a.id) && !existingBacklogIds.has(a.id);
        }).map((a) => ({
            ...a,
            addedToBacklogWeek: nextWeek,
            isOverdue: true,
        })),
        // Keep existing backlog items that are still pending
        ...prev.backlogActionItems.filter((b) => !completedActionIds.has(b.id)),
    ];

    // Auto legacy signal for week advance
    const autoSignal: Signal = {
        id: `sig-wk${nextWeek}`,
        source: 'leadership',
        message: `Week ${nextWeek} has begun. Review your priorities.`,
        priority: 'normal',
        week: nextWeek,
    };

    return {
        ...prev,
        week: nextWeek,
        timeLeft: WEEK_TIMER_SECONDS,
        progress,
        phaseProgress: progress,
        signals: [...prev.signals.slice(-9), autoSignal],
        weeklySignalsShown: nextSignals,
        weeklyEventsShown: nextEvents,
        weeklyActionsForThisWeek: nextActions,
        backlogActionItems: overdueActions,
    };
}

// ─── Helper: compute score ────────────────────────────────────
function computeScore(state: GameStateSnapshot, config: SimulationConfig): SimulationScore {
    const reviewedActions = state.completedActions.filter((action) => action.review);
    const artifactQualityScore = reviewedActions.length
        ? reviewedActions.reduce((sum, action) => sum + (action.review?.percentage ?? 0), 0) / reviewedActions.length
        : null;
    const completionScore = Math.min(100, (state.completedActions.length / Math.max(1, config.weeklyActions?.length ?? config.tasks.length)) * 100);
    const decisionsScore = artifactQualityScore ?? Math.min(100, (state.decisionsMade.length / Math.max(1, config.tasks.length)) * 100);
    const stakeholderScore = state.stakeholders.length
        ? state.stakeholders.reduce((acc, s) => acc + s.satisfaction, 0) / state.stakeholders.length
        : 50;
    const budgetScore = Math.round((state.budget / state.initialBudget) * 100);
    const timelineScore = Math.round(state.progress);

    const overall = Math.round(
        decisionsScore * 0.45 + stakeholderScore * 0.25 + budgetScore * 0.1 + Math.max(timelineScore, completionScore) * 0.2
    );

    const grade =
        overall >= 90 ? 'A+' :
            overall >= 80 ? 'A' :
                overall >= 70 ? 'B' :
                    overall >= 60 ? 'C' :
                        overall >= 50 ? 'D' : 'F';

    return {
        overall,
        grade,
        breakdown: {
            decisions: Math.round(decisionsScore),
            stakeholders: Math.round(stakeholderScore),
            budget: budgetScore,
            timeline: timelineScore,
        },
    };
}

function getArtifactTypeForAction(action?: WeeklyActionItem): string | null {
    if (!action) return null;
    if (action.artifactType) return action.artifactType;
    if (action.actionType === 'submit_prd') return 'prd';
    if (action.actionType === 'decision_text' || action.actionType === 'choice') return 'decision_log';
    return null;
}

function buildArtifactFromAction(
    action: WeeklyActionItem | undefined,
    completed: CompletedAction
): ArtifactRecord | null {
    const artifactType = getArtifactTypeForAction(action);
    if (!action || !artifactType) return null;

    return {
        id: `artifact-${completed.actionId}-${Date.now()}`,
        type: artifactType,
        title: action.prdTitle ?? action.title,
        description: action.description,
        createdAt: new Date().toISOString(),
        week: completed.week,
        status: 'generated',
        content: completed.result,
        metadata: {
            actionId: action.id,
            moduleTitle: action.title,
            moduleWeek: action.week,
            deliverable: action.outputTemplate?.[0]?.label ?? action.prdTitle ?? action.title,
            sourceMaterials: action.workplaceMaterials?.map((material) => ({
                title: material.title,
                source: material.source,
            })) ?? [],
            ...(completed.review ? { review: completed.review } : {}),
        },
    };
}

// ─── Hook Return Type ─────────────────────────────────────────
export interface UseSimulationCoreReturn {
    gameState: GameStateSnapshot | null;
    isRunning: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    score: SimulationScore | null;
    availableActions: ScenarioAction[];       // Legacy engine actions
    weeklyActions: WeeklyActionItem[];         // New per-week rich actions
    backlogCount: number;                      // Notification badge count
    sessionId: string | null;
    startSimulation: () => void;
    pauseSimulation: () => void;
    resumeSimulation: () => void;
    restartSimulation: () => void;
    advanceTime: () => void;
    makeDecision: (actionId: string, choice: ActionChoice) => { feedback: string };
    completeWeeklyAction: (actionId: string, result: Record<string, unknown>) => { feedback: string };
    updateCustomState: <K extends keyof GameStateSnapshot>(key: K, value: GameStateSnapshot[K]) => void;
    respondToMeeting: (response: 'join' | 'later' | 'unavailable' | 'ignore') => void;
}

// ─── Hook ─────────────────────────────────────────────────────
export default function useSimulationCore(config: SimulationConfig): UseSimulationCoreReturn {
    const [gameState, setGameState] = useState<GameStateSnapshot | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [score, setScore] = useState<SimulationScore | null>(null);

    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Derived: legacy available actions for this week ──────────
    const availableActions = useMemo<ScenarioAction[]>(() => {
        if (!gameState || !isRunning || isPaused) return [];
        const madeThisWeek = new Set(
            gameState.decisionsMade.filter((d) => d.week === gameState.week).map((d) => d.actionId)
        );
        return config.actions.filter((action) => {
            if (madeThisWeek.has(action.id)) return false;
            if (action.weekAvailable && action.weekAvailable > gameState.week) return false;
            if (action.triggerCondition && !action.triggerCondition(gameState)) return false;
            return true;
        });
    }, [gameState, isRunning, isPaused, config.actions]);

    // ── Derived: current week's rich actions ─────────────────────
    const weeklyActions = useMemo<WeeklyActionItem[]>(() => {
        if (!gameState || !isRunning || isPaused) return [];
        const completedIds = new Set(gameState.completedActions.map((c) => c.actionId));
        return gameState.weeklyActionsForThisWeek.filter((a) => !completedIds.has(a.id));
    }, [gameState, isRunning, isPaused]);

    // ── Derived: backlog notification count ──────────────────────
    const backlogCount = useMemo(() => {
        if (!gameState) return 0;
        const completedIds = new Set(gameState.completedActions.map((c) => c.actionId));
        return gameState.backlogActionItems.filter((b) => !completedIds.has(b.id)).length;
    }, [gameState]);

    const tick = useCallback(() => {
        setGameState((prev) => {
            if (!prev) return prev;

            // Check for scheduled meetings
            const timeInWeek = WEEK_TIMER_SECONDS - prev.timeLeft;
            const startingMeeting = (config.weeklyEvents || []).find(e =>
                e.week === prev.week &&
                e.type === 'meeting' &&
                e.timeInWeek === timeInWeek &&
                !prev.completedActions.some(c => c.actionId === e.actionId)
            );

            if (startingMeeting && prev.activeMeeting?.id !== startingMeeting.id) {
                playSound('call'); // Play a call-like tone
                return {
                    ...prev,
                    timeLeft: prev.timeLeft - 1,
                    activeMeeting: startingMeeting
                };
            }

            if (prev.timeLeft <= 1) {
                const nextWeek = prev.week + 1;
                if (nextWeek > prev.totalWeeks) {
                    return prev;
                }
                playSound('success'); // Welcome sound for new week
                return advanceWeekState(prev, config);
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
    }, [config]);

    // ── Effect: run ticker ────────────────────────────────────
    useEffect(() => {
        if (isRunning && !isPaused) {
            tickRef.current = setInterval(tick, TICK_INTERVAL_MS);
        } else {
            if (tickRef.current) clearInterval(tickRef.current);
        }
        return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }, [isRunning, isPaused, tick]);

    // ── Effect: check completion ──────────────────────────────
    useEffect(() => {
        if (!gameState || !isRunning || isCompleted) return;
        if (gameState.week > gameState.totalWeeks) {
            const finalScore = computeScore(gameState, config);
            queueMicrotask(() => {
                setIsRunning(false);
                setIsCompleted(true);
                setScore(finalScore);
            });
        }
    }, [gameState, isRunning, isCompleted, config]);

    // ── Actions ───────────────────────────────────────────────
    const startSimulation = useCallback(() => {
        setGameState(buildInitialState(config));
        setIsRunning(true);
        setIsPaused(false);
        setIsCompleted(false);
        setScore(null);
    }, [config]);

    const pauseSimulation = useCallback(() => setIsPaused(true), []);
    const resumeSimulation = useCallback(() => setIsPaused(false), []);

    const restartSimulation = useCallback(() => {
        if (tickRef.current) clearInterval(tickRef.current);
        setGameState(buildInitialState(config));
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        setScore(null);
    }, [config]);

    const advanceTime = useCallback(() => {
        setGameState((prev) => {
            if (!prev) return prev;
            const nextWeek = prev.week + 1;
            if (nextWeek > prev.totalWeeks) return prev;
            return advanceWeekState(prev, config);
        });
    }, [config]);

    // ── Legacy makeDecision ───────────────────────────────────
    const makeDecision = useCallback(
        (actionId: string, choice: ActionChoice): { feedback: string } => {
            const feedback = `You chose: ${choice.label}. ${choice.description}`;
            setGameState((prev) => {
                if (!prev) return prev;
                const record: DecisionRecord = {
                    id: `dec-${Date.now()}`,
                    actionId,
                    choiceId: choice.id,
                    week: prev.week,
                    outcome: choice.label,
                    feedback,
                };
                const impact = choice.impact ?? {};

                // Play sound for decision
                playSound('success');

                return { ...prev, ...impact, decisionsMade: [...prev.decisionsMade, record] };
            });
            return { feedback };
        },
        []
    );

    // ── New: completeWeeklyAction ─────────────────────────────
    const completeWeeklyAction = useCallback(
        (actionId: string, result: Record<string, unknown>): { feedback: string } => {
            const currentActionFromState = gameState
                ? [
                    ...gameState.weeklyActionsForThisWeek,
                    ...gameState.backlogActionItems,
                    ...(config.weeklyActions ?? []),
                ].find((action) => action.id === actionId)
                : undefined;
            const review = currentActionFromState ? evaluateWeeklyActionSubmission(currentActionFromState, result) : undefined;
            const feedback = review
                ? `${review.stakeholderReaction} Score: ${review.score}/${review.maxScore}. ${review.requiresRevision ? review.revisionPrompt : 'Artifact saved to Documents.'}`
                : `Action completed. ${result.summary ?? ''}`;
            const completed: CompletedAction = {
                actionId,
                week: gameState?.week ?? 1,
                result,
                review,
            };

            // Audio Feedback
            playSound('email');

            setGameState((prev) => {
                if (!prev) return prev;

                // Simple "automated email" logic for certain actions
                const updatedEvents = [...prev.weeklyEventsShown];
                const updatedActions = [...prev.weeklyActionsForThisWeek];
                const currentAction = [
                    ...prev.weeklyActionsForThisWeek,
                    ...prev.backlogActionItems,
                    ...(config.weeklyActions ?? []),
                ].find((action) => action.id === actionId);
                const generatedArtifact = buildArtifactFromAction(currentAction, completed);
                const reviewAdjustment = completed.review
                    ? completed.review.requiresRevision
                        ? { morale: -2, risk: 0.03, stakeholder: -3 }
                        : { morale: 2, risk: -0.02, stakeholder: 2 }
                    : { morale: 0, risk: 0, stakeholder: 0 };

                // Example: Trigger a follow-up task if this is a 'Crisis Triage'
                if (actionId === 'action-w1-triage') {
                    const followup: WeeklyEvent = {
                        id: `evt-followup-${Date.now()}`,
                        week: prev.week,
                        type: 'request',
                        title: 'Follow-up: Team Feedback',
                        description: 'Sarah Chen noticed your decision. She has some concerns about the timeline.',
                        from: 'Sarah Chen', fromInitials: 'SC', fromColor: 'bg-purple-500/20 text-purple-400',
                        priority: 'high',
                        requiresAction: false
                    };
                    updatedEvents.push(followup);
                }

                if (completed.review) {
                    updatedEvents.push({
                        id: `evt-review-${actionId}-${Date.now()}`,
                        week: prev.week,
                        type: 'notification',
                        title: completed.review.requiresRevision ? 'PM review: revision requested' : 'PM review: artifact accepted',
                        description: completed.review.stakeholderReaction,
                        from: 'Product Review',
                        fromInitials: 'PR',
                        fromColor: completed.review.requiresRevision ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400',
                        priority: completed.review.requiresRevision ? 'high' : 'normal',
                        requiresAction: false,
                    });
                }

                return {
                    ...prev,
                    completedActions: [...prev.completedActions, completed],
                    artifacts: generatedArtifact ? [...prev.artifacts, generatedArtifact] : prev.artifacts,
                    backlogActionItems: prev.backlogActionItems.filter((b) => b.id !== actionId),
                    weeklyEventsShown: updatedEvents,
                    weeklyActionsForThisWeek: updatedActions,
                    teamMorale: Math.max(0, Math.min(100, prev.teamMorale + reviewAdjustment.morale)),
                    riskLevel: Math.max(0, Math.min(1, prev.riskLevel + reviewAdjustment.risk)),
                    stakeholders: prev.stakeholders.map((stakeholder, index) => index === 0
                        ? {
                            ...stakeholder,
                            satisfaction: Math.max(0, Math.min(100, stakeholder.satisfaction + reviewAdjustment.stakeholder)),
                        }
                        : stakeholder
                    ),
                };
            });
            return { feedback };
        },
        [gameState, config.weeklyActions]
    );

    const updateCustomState = useCallback(
        <K extends keyof GameStateSnapshot>(key: K, value: GameStateSnapshot[K]) => {
            setGameState((prev) => (prev ? { ...prev, [key]: value } : prev));
        },
        []
    );

    const respondToMeeting = useCallback((response: 'join' | 'later' | 'unavailable' | 'ignore') => {
        setGameState(prev => {
            if (!prev || !prev.activeMeeting) return prev;

            const meeting = prev.activeMeeting;
            const updatedBacklog = [...prev.backlogActionItems];

            // If user says "later", "unavailable" or "ignore", ensure the linked action is in the backlog
            if ((response === 'later' || response === 'unavailable' || response === 'ignore') && meeting.actionId) {
                const action = config.weeklyActions?.find(a => a.id === meeting.actionId);
                const isAlreadyInBacklog = updatedBacklog.some(b => b.id === meeting.actionId);
                const isAlreadyCompleted = prev.completedActions.some(c => c.actionId === meeting.actionId);

                if (action && !isAlreadyInBacklog && !isAlreadyCompleted) {
                    updatedBacklog.push({
                        ...action,
                        addedToBacklogWeek: prev.week,
                        isOverdue: true,
                    });
                    playSound('warning');
                }
            }

            if (response === 'join') {
                playSound('notification');
            }

            return {
                ...prev,
                activeMeeting: null,
                backlogActionItems: updatedBacklog
            };
        });
    }, [config]);

    return {
        gameState,
        isRunning,
        isPaused,
        isCompleted,
        score,
        availableActions,
        weeklyActions,
        backlogCount,
        sessionId: gameState?.sessionId ?? null,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        restartSimulation,
        advanceTime,
        makeDecision,
        completeWeeklyAction,
        updateCustomState,
        respondToMeeting,
    };
}
