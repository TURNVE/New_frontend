/**
 * SimulationShell — Reusable Simulation Workspace
 * Uses SimulationConfig. Backlog tab is the main activity hub.
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ChevronRight, LayoutList, Map, Building2, FolderOpen,
    Bell, Play, Pause,
    Clock, CheckCircle, Trophy, AlertTriangle, FileText,
    PhoneCall, Video, Menu, Calendar,
} from 'lucide-react';
import useSimulationCore from './useSimulationCore';
import type {
    SimulationConfig, ScenarioAction, ActionChoice,
    WeeklyActionItem, WeeklySignal, WeeklyEvent, BacklogActionItem,
} from './types';
import { DocumentsPanel } from '../../components/simulation/DocumentsPanel';
import { CompanyPanel } from '../../components/company/CompanyPanel';
import { RoadmapPanel } from '../../components/pmtools/RoadmapPanel';
import { NotificationCenter, useNotifications } from '../../components/communications/NotificationCenter';
import { ToastContainer } from '../../components/communications/ToastContainer';
import { WelcomeHint } from '../../components/overlay/WelcomeHint';
import { enableSounds } from '../../utils/sounds';
import ActionModal, { type ModalAction } from './components/ActionModal';
import { TypingText } from '../../components/ui/TypingText';
import SimRoadmapMindmap from './components/SimRoadmapMindmap';
import { CalendarPanel } from '../../components/simulation/CalendarPanel';

type ActiveTab = 'dashboard' | 'backlog' | 'roadmap' | 'documents' | 'company' | 'calendar';

// ─── Priority badge ───────────────────────────────────────────
    const PRI: Record<string, string> = {
        urgent: 'bg-red-500/20 text-red-400',
        high: 'bg-primary/20 text-primary',
        normal: 'bg-primary/20 text-primary',
        low: 'bg-[rgba(255,255,255,0.1)] text-text-tertiary',
    };

// ─── Severity dot ─────────────────────────────────────────────
    const SEV_DOT: Record<string, string> = {
        critical: 'bg-red-500',
        warning: 'bg-primary',
        info: 'bg-[#10b981]',
        high: 'bg-red-500',
        urgent: 'bg-red-500',
        normal: 'bg-primary',
        low: 'bg-[rgba(255,255,255,0.3)]',
    };

// ─── Metrics derivation ───────────────────────────────────────
function deriveMetrics(gs: ReturnType<typeof useSimulationCore>['gameState'], _c: SimulationConfig) {
    if (!gs) return [];
    const bp = Math.round((gs.budget / gs.initialBudget) * 100);
    const pp = Math.round(gs.progress);
    const rp = Math.round(gs.riskLevel * 100);
    return [
        { label: 'Budget', value: `$${(gs.budget / 1000).toFixed(0)}K`, dot: bp > 30 ? 'bg-[#7170ff]' : 'bg-red-500', trendDir: bp > 30 ? 'up' as const : 'down' as const, trendVal: `${bp}% left`, trendColor: bp > 30 ? 'green' : 'red' as 'green' | 'red' },
        { label: 'Progress', value: `${pp}%`, dot: pp > 70 ? 'bg-[#10b981]' : 'bg-[#7170ff]', trendDir: 'up' as const, trendVal: `Wk ${gs.week}/${gs.totalWeeks}`, trendColor: 'green' as const },
        { label: 'Risk', value: `${rp}%`, dot: rp > 60 ? 'bg-red-500' : rp > 40 ? 'bg-primary' : 'bg-[#10b981]', trendDir: rp > 50 ? 'up' as const : 'down' as const, trendVal: rp > 60 ? 'Critical' : 'Managed', trendColor: rp > 60 ? 'red' : 'green' as 'red' | 'green' },
        { label: 'Morale', value: `${Math.round(gs.teamMorale)}%`, dot: gs.teamMorale > 75 ? 'bg-[#10b981]' : 'bg-primary', trendDir: gs.teamMorale > 60 ? 'up' as const : 'down' as const, trendVal: gs.teamMorale > 75 ? 'High' : 'Low', trendColor: gs.teamMorale > 75 ? 'green' : 'yellow' as 'green' | 'yellow' },
    ];
}

// ─── Backlog Panel ────────────────────────────────────────────
interface BacklogPanelProps {
    gameState: ReturnType<typeof useSimulationCore>['gameState'];
    config: SimulationConfig;
    completedIds: Set<string>;
    onOpenAction: (item: WeeklyActionItem) => void;
}

function SimBacklogPanel({ gameState, config, completedIds, onOpenAction }: BacklogPanelProps) {
    const [filter, setFilter] = useState<'todo' | 'done'>('todo');

    if (!gameState) return null;

    const currentWeek = gameState.week;
    const overdueActions: BacklogActionItem[] = gameState.backlogActionItems ?? [];
    const overdueIds = new Set(overdueActions.map(o => o.id));

    // Current week content only
    const weekSignals: WeeklySignal[] = (config.weeklySignals ?? []).filter(s => s.week === currentWeek);
    const weekEvents: WeeklyEvent[] = (config.weeklyEvents ?? []).filter(e => e.week === currentWeek);
    const weekActions: WeeklyActionItem[] = (config.weeklyActions ?? []).filter(a => a.week === currentWeek);

    // Separate by type
    const actionItems = weekActions.filter(a => !completedIds.has(a.id));
    const completedActions = weekActions.filter(a => completedIds.has(a.id));
    const actionRequiredEvents = weekEvents.filter(e => e.requiresAction && !completedIds.has(e.actionId || ''));
    const fyiSignals = weekSignals;

    const todoItems = [...actionRequiredEvents, ...actionItems];

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Tasks</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your main workspace — complete tasks to advance</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Week {currentWeek}</span>
                        <span>•</span>
                        <span>{todoItems.length} pending</span>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1">
                    {[
                        { id: 'todo' as const, label: 'To Do', count: todoItems.length },
                        { id: 'done' as const, label: 'Done', count: completedActions.length },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${filter === t.id ? 'bg-[#5e6ad2] text-white' : 'bg-surface text-text-tertiary hover:bg-surface-secondary'}`}
                        >
                            {t.label}
                            {t.count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === t.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">

                {/* TO DO Section */}
                {filter === 'todo' && todoItems.length > 0 && (
                    <section>
                        <div className="space-y-3">
                            {/* Events requiring action */}
                            {actionRequiredEvents.map(evt => (
                                <div key={evt.id} className="p-3 rounded-lg border border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-primary dark:text-primary">From: {evt.from}</span>
                                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">Action Required</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{evt.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{evt.description}</p>
                                </div>
                            ))}

                            {/* Actions */}
                            {actionItems.map(action => {
                                const overdue = overdueIds.has(action.id);
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => onOpenAction(action)}
                                        className={`w-full text-left bg-card rounded-xl p-4 border transition-all hover:shadow-md ${overdue ? 'border-red-500/30 bg-red-500/5' : 'border-border hover:border-primary/40'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${overdue ? 'bg-red-500/20' : 'bg-primary/10'}`}>
                                                {overdue ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-primary" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-sm font-semibold text-foreground">{action.title}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRI[action.priority]}`}>{action.priority}</span>
                                                    {overdue && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">OVERDUE</span>}
                                                </div>
                                                <p className="text-xs text-text-secondary line-clamp-2">{action.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] text-text-tertiary uppercase">{action.actionType}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-1" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* DONE Section */}
                {filter === 'done' && completedActions.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Completed
                        </h3>
                        <div className="space-y-2">
                            {completedActions.map(action => (
                                <div key={action.id} className="bg-card rounded-xl p-4 border border-border opacity-60">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-semibold text-text-tertiary line-through">{action.title}</span>
                                            <p className="text-xs text-text-tertiary mt-1">{action.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {todoItems.length === 0 && completedActions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500/30 mb-4" />
                        <p className="text-foreground font-semibold text-sm">All tasks done for Week {currentWeek}!</p>
                        <p className="text-text-tertiary text-xs mt-1 mb-4">Advance to the next week when you're ready.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────
export default function SimulationShell({ config }: { config: SimulationConfig }) {
    const navigate = useNavigate();
    const { subpage } = useParams();
    const { pathname } = useLocation();

    const {
        gameState, isRunning, isPaused, isCompleted, score,
        availableActions, weeklyActions, backlogCount,
        sessionId, startSimulation, pauseSimulation, resumeSimulation,
        restartSimulation, advanceTime, makeDecision, completeWeeklyAction, updateCustomState,
        respondToMeeting,
    } = useSimulationCore(config);

    // ── Tab Management (URL-based) ────────────────────────────
    const activeTab = useMemo<ActiveTab>(() => {
        const lastPart = pathname.split('/').pop();
        const validTabs: ActiveTab[] = ['backlog', 'roadmap', 'documents', 'company', 'calendar'];
        if (validTabs.includes(lastPart as ActiveTab)) return lastPart as ActiveTab;
        return 'dashboard';
    }, [pathname]);

    const setActiveTab = useCallback((tab: ActiveTab) => {
        const parts = pathname.split('/');
        const isSubpage = ['backlog', 'roadmap', 'documents', 'company', 'calendar'].includes(parts[parts.length - 1]);
        const basePath = isSubpage ? parts.slice(0, -1).join('/') : pathname.replace(/\/$/, '');

        if (tab === 'dashboard') {
            navigate(basePath);
        } else {
            navigate(`${basePath}/${tab}`);
        }
    }, [navigate, pathname]);

    const [showWelcomeHint, setShowWelcomeHint] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [openModal, setOpenModal] = useState<ModalAction | null>(null);
    const [feedback, setFeedback] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [pagePrimary, setPagePrimary] = useState(config.primaryColor);

    useEffect(() => {
        setPagePrimary(config.primaryColor);
    }, [config.primaryColor]);

    const { notifications, markNotificationRead } = useNotifications();

    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!gameState && !isRunning && !hasStartedRef.current) {
            hasStartedRef.current = true;
            startSimulation();
        }
    }, [gameState, isRunning, startSimulation]);

    const completedIds = useMemo(() =>
        new Set((gameState?.completedActions ?? []).map(c => c.actionId)),
        [gameState?.completedActions]
    );

    const metrics = useMemo(() => gameState ? deriveMetrics(gameState, config) : [], [gameState, config]);

    // Week change notification logic
    const lastWeekRef = useRef<number>(1);
    const [weekChangeInfo, setWeekChangeInfo] = useState<{ week: number; total: number } | null>(null);

    useEffect(() => {
        if (gameState && gameState.week > lastWeekRef.current) {
            setWeekChangeInfo({ week: gameState.week, total: gameState.totalWeeks });
            lastWeekRef.current = gameState.week;
            setTimeout(() => setWeekChangeInfo(null), 8000);
        }
    }, [gameState?.week]);

    const activeMeeting = gameState?.activeMeeting;
    const [showMeetingContent, setShowMeetingContent] = useState(false);

    useEffect(() => {
        if (activeMeeting) {
            setShowMeetingContent(true);
        } else {
            setShowMeetingContent(false);
        }
    }, [activeMeeting]);

    const handleLegacyDecision = useCallback((choice: ActionChoice) => {
        if (!openModal || openModal.kind !== 'legacy') return;
        const result = makeDecision(openModal.item.id, choice);
        setFeedback(result.feedback);
        setTimeout(() => setFeedback(''), 5000);
    }, [openModal, makeDecision]);

    const handleCompleteWeeklyAction = useCallback((actionId: string, result: Record<string, unknown>) => {
        const res = completeWeeklyAction(actionId, result);
        setFeedback(res.feedback);
        setTimeout(() => setFeedback(''), 5000);
    }, [completeWeeklyAction]);

    const NAV_ITEMS: { name: string; icon: React.ComponentType<{ className?: string }>; id: ActiveTab; badge?: number }[] = [
        { name: 'Tasks', icon: LayoutList, id: 'backlog', badge: weeklyActions.filter(a => !completedIds.has(a.id)).length > 0 
            ? weeklyActions.filter(a => !completedIds.has(a.id)).length 
            : undefined },
        { name: 'Roadmap', icon: Map, id: 'roadmap' },
        { name: 'Documents', icon: FolderOpen, id: 'documents' },
        { name: 'Company', icon: Building2, id: 'company' },
        { name: 'Calendar', icon: Calendar, id: 'calendar' },
    ];

    if (!gameState) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${pagePrimary}40`, borderTopColor: pagePrimary, borderLeftColor: pagePrimary }} />
                    <p className="text-gray-500 dark:text-gray-400">Initialising {config.companyName}...</p>
                </div>
            </div>
        );
    }

    return (
        <>


            {/* New Week Overlay */}
            {weekChangeInfo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="p-8 rounded-[20px] shadow-2xl text-center text-white max-w-md mx-4 animate-in zoom-in duration-300" style={{ background: `linear-gradient(135deg, ${pagePrimary}, ${pagePrimary}cc)` }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Clock className="w-8 h-8" />
                        </div>
                        <TypingText text={`Week ${weekChangeInfo.week} Started`} speed={40} as="h2" className="text-2xl font-bold mb-2" key={`week-${weekChangeInfo.week}`} />
                        <p className="text-white/80 mb-2 font-medium">{weekChangeInfo.total - weekChangeInfo.week + 1} weeks remaining</p>
                        <p className="text-white/70 text-sm mb-6">Check your Backlog for new tasks and signals.</p>
                        <button
                            onClick={() => setWeekChangeInfo(null)}
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Meeting Call Overlay */}
            {activeMeeting && showMeetingContent && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 p-4">
                    <div className="glass-panel w-full max-w-lg rounded-[20px] border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                        <div className="p-8 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-50" />
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl z-10 relative ${activeMeeting.fromColor}`}>
                                    {activeMeeting.fromInitials}
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                                <PhoneCall className="w-3 h-3" /> Incoming Call
                            </div>

                            <h2 className="text-2xl font-bold dark:text-white mb-2">{activeMeeting.title}</h2>
                            <p className="text-gray-400 font-medium mb-1">From: {activeMeeting.from}</p>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                {activeMeeting.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        respondToMeeting('join');
                                        if (activeMeeting.actionId) {
                                            const allActions = [
                                                ...(config.weeklyActions || []),
                                                ...((gameState as any).backlogActionItems || [])
                                            ];
                                            const action = allActions.find(a => a.id === activeMeeting.actionId);
                                            if (action) setOpenModal({ kind: 'weekly', item: action as any });
                                        }
                                    }}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    <Video className="w-4 h-4" /> Join & Complete
                                </button>

                                <button
                                    onClick={() => respondToMeeting('later')}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
                                >
                                    Handle Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer notifications={notifications} onDismiss={markNotificationRead} onNotificationClick={() => setShowNotifications(true)} hidden={showNotifications} />
            <WelcomeHint
                isOpen={showWelcomeHint}
                onClose={() => setShowWelcomeHint(false)}
                companyName={config.companyName}
                challengeTitle={config.challenge}
                archetype={config.archetype}
            />

            <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">

                {/* ── Sidebar ───────────────────────────────── */}
                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}
                <aside className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] flex flex-col shrink-0 transition-transform duration-300 ease-in-out`}>
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[16px] shadow-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: config.primaryColor }}>
                            <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 truncate">{config.companyName}</span>
                    </div>

                    <nav className="flex-1 px-3 lg:px-4 py-2 space-y-0.5">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all relative ${activeTab === item.id
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                style={activeTab === item.id ? {
                                    borderLeft: `3px solid ${config.primaryColor}`,
                                } : { borderLeft: '3px solid transparent' }}
                            >
                                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                <span className="flex-1 text-left">{item.name}</span>
                                {item.badge !== undefined && (
                                    <span className="w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: config.primaryColor }}>
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="border-t border-gray-200 dark:border-gray-800 mx-3 mt-2" />

                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            <span>Week {gameState.week}/{gameState.totalWeeks}</span>
                            <span>{Math.round(gameState.progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${gameState.progress}%`, backgroundColor: config.primaryColor }} />
                        </div>
                    </div>
                </aside>

                {/* ── Main ─────────────────────────────────── */}
                <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#121212] min-w-0">
                    {/* Header */}
                    <header className="h-14 lg:h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 lg:px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10 flex-shrink-0">
                        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                            <button 
                                onClick={() => setMobileSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                            >
                                <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                            <TypingText text={config.companyName} speed={35} className="text-sm lg:text-base font-semibold dark:text-white" />
                            <span className="inline-flex text-xs font-bold px-2 py-1 rounded border" style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor, borderColor: `${config.primaryColor}30` }}>
                                WEEK {String(gameState.week).padStart(2, '0')} / {gameState.totalWeeks}
                            </span>
                            {isPaused && (
                                <span className="hidden sm:inline-flex bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                                    <Pause className="w-3 h-3" /> PAUSED
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Notifications */}
                            <button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-500" />
                                {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: pagePrimary }} />}
                            </button>
                            
                            {/* Start/Pause */}
                            {!isRunning ? (
                                <button onClick={() => { enableSounds(); startSimulation(); }} className="p-2 text-white rounded-lg shadow-lg transition-all" style={{ backgroundColor: pagePrimary, boxShadow: `0 4px 14px ${pagePrimary}40` }} title="Start Simulation">
                                    <Play className="w-5 h-5" />
                                </button>
                            ) : isPaused ? (
                                <button onClick={() => { enableSounds(); resumeSimulation(); }} className="p-2 text-white rounded-lg shadow-lg transition-all" style={{ backgroundColor: pagePrimary, boxShadow: `0 4px 14px ${pagePrimary}40` }} title="Resume">
                                    <Play className="w-5 h-5" />
                                </button>
                            ) : (
                                <button onClick={pauseSimulation} className="p-2 text-white rounded-lg shadow-lg transition-all" style={{ backgroundColor: pagePrimary, boxShadow: `0 4px 14px ${pagePrimary}40` }} title="Pause">
                                    <Pause className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </header>

                    {feedback && (
                        <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-6 py-3 text-sm flex-shrink-0">
                            {feedback}
                        </div>
                    )}

                    {/* ── Panel Content ─────────────────────── */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {activeTab === 'documents' ? (
                            <DocumentsPanel
                                artifacts={(gameState as any).artifacts || []}
                                onGenerateArtifact={(type) => console.log('generate', type)}
                                onViewArtifact={(a) => console.log('view', a)}
                                onExportArtifact={(a, fmt) => console.log('export', a, fmt)}
                                onDeleteArtifact={(a) => updateCustomState('artifacts', ((gameState as any).artifacts || []).filter((x: any) => x.id !== a.id))}
                                currentWeek={gameState.week}
                            />
                        ) : activeTab === 'company' ? (
                            <CompanyPanel currentWeek={gameState.week} />
                        ) : activeTab === 'backlog' ? (
                            <SimBacklogPanel
                                gameState={gameState}
                                config={config}
                                completedIds={completedIds}
                                onOpenAction={(item) => setOpenModal({ kind: 'weekly', item })}
                            />
                        ) : activeTab === 'roadmap' ? (
                            <SimRoadmapMindmap
                                totalWeeks={gameState.totalWeeks}
                                currentWeek={gameState.week}
                                phases={config.timelinePhases || []}
                                onTriggerAction={(id) => {
                                    const allActions = [
                                        ...(config.weeklyActions || []),
                                        ...((gameState as any).backlogActionItems || [])
                                    ];
                                    const action = allActions.find(a => a.id === id);
                                    if (action) {
                                        setOpenModal({ kind: 'weekly', item: action as any });
                                    } else {
                                        const weekAction = (config.weeklyActions || []).find(a => a.week === gameState.week);
                                        if (weekAction) setOpenModal({ kind: 'weekly', item: weekAction });
                                    }
                                }}
                            />
                        ) : activeTab === 'calendar' ? (
                            <CalendarPanel
                                slots={[
                                    { id: '1', title: 'CEO Welcome Meeting', with: 'Marcus Johnson (CEO)', time: '6:00 PM', duration: '30 min', available: true, description: 'Your first meeting with the CEO' },
                                    { id: '2', title: 'Team Standup', with: 'Product Team', time: '10:00 AM', duration: '15 min', available: true, description: 'Daily team sync' },
                                    { id: '3', title: '1:1 with PM', with: 'Sarah Chen', time: '2:00 PM', duration: '30 min', available: false, description: 'Weekly check-in' },
                                ]}
                                primaryColor={config.primaryColor}
                            />
                        ) : (
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                                {/* Week Context */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold" style={{ backgroundColor: config.primaryColor }}>
                                            W{gameState.week}
                                        </span>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Week {gameState.week} of {gameState.totalWeeks}
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {weeklyActions.filter(a => !completedIds.has(a.id)).length > 0
                                                    ? `${weeklyActions.filter(a => !completedIds.has(a.id)).length} tasks to complete`
                                                    : 'All tasks done - advance when ready'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main: This Week's Tasks */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-semibold dark:text-white">Your Tasks</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click a task to complete it, then advance to the next week</p>
                                    </div>
                                    <div className="p-4">
                                        {weeklyActions.filter(a => !completedIds.has(a.id)).length === 0 ? (
                                            <div className="text-center py-12">
                                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">All tasks completed</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Advance to the next week to continue</p>
                                                <button
                                                    onClick={advanceTime}
                                                    className="px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-all"
                                                    style={{ backgroundColor: pagePrimary }}
                                                >
                                                    Advance to Week {gameState.week + 1}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {weeklyActions.filter(a => !completedIds.has(a.id)).map((action, index) => (
                                                    <button
                                                        key={action.id}
                                                        onClick={() => setOpenModal({ kind: 'weekly', item: action })}
                                                        className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                {index + 1}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${PRI[action.priority]}`}>{action.priority}</span>
                                                                    <span className="text-xs text-gray-400">{action.actionType}</span>
                                                                </div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</h4>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        </div>
                                                    </button>
                                                ))}
                                                {availableActions.map((action) => (
                                                    <button
                                                        key={action.id}
                                                        onClick={() => setOpenModal({ kind: 'legacy', item: action })}
                                                        className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-amber-50 dark:hover:bg-primary/5 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs font-medium text-primary dark:text-primary">D</span>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/20 text-primary mb-1 inline-block">Decision</span>
                                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{action.name}</h4>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={advanceTime}
                                        disabled={!isRunning || isPaused}
                                        className="flex-1 py-3 text-white rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: pagePrimary }}
                                    >
                                        Advance to Week {gameState.week + 1}
                                    </button>
                                    {backlogCount > 0 && (
                                        <button
                                            onClick={() => setActiveTab('backlog')}
                                            className="px-6 py-3 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all text-sm font-medium"
                                        >
                                            {backlogCount} overdue
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Action Modal */}
            {openModal && (
                <ActionModal
                    action={openModal}
                    gameState={gameState}
                    onComplete={handleCompleteWeeklyAction}
                    onLegacyDecision={handleLegacyDecision}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {/* Completion Modal */}
            {isCompleted && score && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[16px] border border-gray-200 dark:border-gray-800 max-w-md w-full p-10 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold dark:text-white mb-2">Simulation Complete!</h2>
                        <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-[16px] p-6 mb-8 border border-gray-100 dark:border-gray-800">
                            <div className="text-5xl font-black dark:text-white mb-2">{score.overall}%</div>
                            <div className="text-sm font-bold text-emerald-500 uppercase tracking-widest">{score.grade} Grade</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                                Check the Documents tab for artifacts you created during the simulation.
                            </p>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Check your portfolio for artifacts you've created.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={restartSimulation} className="text-white font-bold py-4 rounded-xl shadow-lg transition-all" style={{ backgroundColor: pagePrimary, boxShadow: `0 4px 14px ${pagePrimary}40` }}>Try Again</button>
                            <button onClick={() => navigate('/simulations')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-all">Exit</button>
                        </div>
                    </div>
                </div>
            )}

            <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </>
    );
}
