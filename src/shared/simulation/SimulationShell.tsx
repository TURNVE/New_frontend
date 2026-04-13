/**
 * SimulationShell — Reusable Simulation Workspace
 * Uses SimulationConfig. Backlog tab is the main activity hub.
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ChevronRight, Home, LayoutList, Map, Gauge, Building2, FolderOpen,
    FolderHeart, Bell, Play, Pause, RotateCcw, ArrowRight, Moon, Sun,
    Zap, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown,
    Trophy, X, AlertTriangle, FileText, Filter, Search, Tag, CreditCard,
    Phone, PhoneCall, Video, User, Menu, HelpCircle, BookOpen,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import useSimulationCore from './useSimulationCore';
import type {
    SimulationConfig, ScenarioAction, ActionChoice,
    WeeklyActionItem, WeeklySignal, WeeklyEvent, BacklogActionItem,
} from './types';
import { DocumentsPanel } from '../../components/simulation/DocumentsPanel';
import { PortfolioBuilder } from '../../components/simulation/PortfolioBuilder';
import { CompanyPanel } from '../../components/company/CompanyPanel';
import { RoadmapPanel } from '../../components/pmtools/RoadmapPanel';
import { NotificationCenter, useNotifications } from '../../components/communications/NotificationCenter';
import { ToastContainer } from '../../components/communications/ToastContainer';
import { WelcomeHint } from '../../components/overlay/WelcomeHint';
import { enableSounds } from '../../utils/sounds';
import ActionModal, { type ModalAction } from './components/ActionModal';
import SimRoadmapMindmap from './components/SimRoadmapMindmap';

type ActiveTab = 'dashboard' | 'backlog' | 'roadmap' | 'documents' | 'portfolio' | 'company' | 'guide';

// ─── Priority badge ───────────────────────────────────────────
const PRI: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-amber-500/20 text-amber-400',
    normal: 'bg-blue-500/20 text-blue-400',
    low: 'bg-gray-500/20 text-gray-400',
};

// ─── Severity dot ─────────────────────────────────────────────
const SEV_DOT: Record<string, string> = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-emerald-500',
    high: 'bg-red-500',
    urgent: 'bg-red-500',
    normal: 'bg-blue-500',
    low: 'bg-gray-500',
};

// ─── Metrics derivation ───────────────────────────────────────
function deriveMetrics(gs: ReturnType<typeof useSimulationCore>['gameState'], _c: SimulationConfig) {
    if (!gs) return [];
    const bp = Math.round((gs.budget / gs.initialBudget) * 100);
    const pp = Math.round(gs.progress);
    const rp = Math.round(gs.riskLevel * 100);
    return [
        { label: 'Budget', value: `$${(gs.budget / 1000).toFixed(0)}K`, dot: bp > 30 ? 'bg-blue-500' : 'bg-red-500', trendDir: bp > 30 ? 'up' as const : 'down' as const, trendVal: `${bp}% left`, trendColor: bp > 30 ? 'green' : 'red' as 'green' | 'red' },
        { label: 'Progress', value: `${pp}%`, dot: pp > 70 ? 'bg-green-500' : 'bg-blue-500', trendDir: 'up' as const, trendVal: `Wk ${gs.week}/${gs.totalWeeks}`, trendColor: 'green' as const },
        { label: 'Risk', value: `${rp}%`, dot: rp > 60 ? 'bg-red-500' : rp > 40 ? 'bg-amber-500' : 'bg-green-500', trendDir: rp > 50 ? 'up' as const : 'down' as const, trendVal: rp > 60 ? 'Critical' : 'Managed', trendColor: rp > 60 ? 'red' : 'green' as 'red' | 'green' },
        { label: 'Morale', value: `${Math.round(gs.teamMorale)}%`, dot: gs.teamMorale > 75 ? 'bg-green-500' : 'bg-amber-500', trendDir: gs.teamMorale > 60 ? 'up' as const : 'down' as const, trendVal: gs.teamMorale > 75 ? 'High' : 'Low', trendColor: gs.teamMorale > 75 ? 'green' : 'yellow' as 'green' | 'yellow' },
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
    const [filter, setFilter] = useState<'all' | 'signals' | 'events' | 'actions' | 'overdue' | 'completed'>('all');
    const [search, setSearch] = useState('');

    if (!gameState) return null;

    // Collect ALL signals across all past + current weeks
    const allSignals: WeeklySignal[] = (config.weeklySignals ?? []).filter(s => s.week <= gameState.week);
    // Collect ALL events across all past + current weeks
    const allEvents: WeeklyEvent[] = (config.weeklyEvents ?? []).filter(e => e.week <= gameState.week);
    // Collect ALL actions across all past + current weeks
    const allActions: WeeklyActionItem[] = (config.weeklyActions ?? []).filter(a => a.week <= gameState.week);
    // Overdue items (from game state)
    const overdueActions: BacklogActionItem[] = gameState.backlogActionItems ?? [];

    const overdueIds = new Set(overdueActions.map(o => o.id));

    const searchLower = search.toLowerCase();

    // Filter helpers
    const filtSignals = allSignals.filter(s =>
        (filter === 'all' || filter === 'signals') &&
        (!searchLower || s.message.toLowerCase().includes(searchLower) || s.source.toLowerCase().includes(searchLower))
    );
    const filtEvents = allEvents.filter(e =>
        (filter === 'all' || filter === 'events') &&
        (!searchLower || e.title.toLowerCase().includes(searchLower) || e.description.toLowerCase().includes(searchLower))
    );
    const filtActions = allActions.filter(a => {
        const matchFilter =
            filter === 'all' ? true :
                filter === 'actions' ? true :
                    filter === 'overdue' ? (overdueIds.has(a.id) && !completedIds.has(a.id)) :
                        filter === 'completed' ? completedIds.has(a.id) :
                            false;
        const matchSearch = !searchLower || a.title.toLowerCase().includes(searchLower) || a.description.toLowerCase().includes(searchLower);
        return matchFilter && matchSearch;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'signals', label: 'Signals' },
        { id: 'events', label: 'Events' },
        { id: 'actions', label: 'Actions' },
        { id: 'overdue', label: 'Overdue' },
        { id: 'completed', label: 'Done' },
    ] as const;

    const totalItems = filtSignals.length + filtEvents.length + filtActions.length;

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">Activity Backlog</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{totalItems} items • Week {gameState.week}</p>
                    </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filter === t.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">

                {/* Signals Section */}
                {(filter === 'all' || filter === 'signals') && filtSignals.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Signals ({filtSignals.length})
                        </h3>
                        <div className="space-y-2">
                            {filtSignals.map(sig => (
                                <div key={sig.id} className="bg-white dark:bg-gray-800/60 rounded-[12px] p-4 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full ${sig.sourceColor} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                                        {sig.sourceInitials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold dark:text-gray-300">{sig.source}</span>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SEV_DOT[sig.severity] ?? 'bg-gray-400'}`} />
                                            <span className="text-[10px] text-gray-400 uppercase">{sig.severity}</span>
                                            <span className="text-[10px] text-gray-400 ml-auto">Week {sig.week}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{sig.message}</p>
                                        {sig.tags && sig.tags.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {sig.tags.map(tag => (
                                                    <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Events Section */}
                {(filter === 'all' || filter === 'events') && filtEvents.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            Events ({filtEvents.length})
                        </h3>
                        <div className="space-y-2">
                            {filtEvents.map(evt => (
                                <div key={evt.id} className={`bg-white dark:bg-gray-800/60 rounded-[12px] p-4 border transition-colors ${evt.requiresAction ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full ${evt.fromColor} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                                            {evt.fromInitials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-sm font-semibold dark:text-gray-200">{evt.title}</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRI[evt.priority]}`}>{evt.priority}</span>
                                                {evt.requiresAction && <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">Action Required</span>}
                                                <span className="text-[10px] text-gray-400 ml-auto">Week {evt.week}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{evt.from} • {evt.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Actions Section */}
                {(filter === 'all' || filter === 'actions' || filter === 'overdue' || filter === 'completed') && filtActions.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Actions ({filtActions.length})
                        </h3>
                        <div className="space-y-2">
                            {filtActions.map(action => {
                                const done = completedIds.has(action.id);
                                const overdue = overdueIds.has(action.id) && !done;
                                return (
                                    <div
                                        key={action.id}
                                        className={`bg-white dark:bg-gray-800/60 rounded-[12px] p-4 border transition-colors ${done ? 'opacity-60 border-gray-100 dark:border-gray-800' : overdue ? 'border-red-500/30 bg-red-500/5' : 'border-gray-100 dark:border-gray-700 hover:border-blue-500/40'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20' : overdue ? 'bg-red-500/20' : 'bg-blue-500/10'}`}>
                                                {done ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : overdue ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`text-sm font-semibold ${done ? 'line-through text-gray-400' : 'dark:text-gray-200'}`}>{action.title}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRI[action.priority]}`}>{action.priority}</span>
                                                    {overdue && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">OVERDUE</span>}
                                                    {done && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">DONE</span>}
                                                    <span className="text-[10px] text-gray-400 ml-auto">Week {action.week}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{action.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] text-gray-400 uppercase">{action.actionType} • {action.category}</span>
                                                    {action.dueWeek && <span className="text-[10px] text-gray-400">Due Wk {action.dueWeek}</span>}
                                                    {!done && (
                                                        <button
                                                            onClick={() => onOpenAction(action)}
                                                            className="ml-auto px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold rounded-lg transition-colors"
                                                        >
                                                            Open
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {totalItems === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No items match this filter.</p>
                        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Advance weeks to see more content.</p>
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
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

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
        const validTabs: ActiveTab[] = ['backlog', 'roadmap', 'metrics', 'documents', 'portfolio', 'company'];
        if (validTabs.includes(lastPart as ActiveTab)) return lastPart as ActiveTab;
        return 'dashboard';
    }, [pathname]);

    const setActiveTab = useCallback((tab: ActiveTab) => {
        // Find base path (e.g., /simulation/pm-01)
        const parts = pathname.split('/');
        const isSubpage = ['backlog', 'roadmap', 'metrics', 'documents', 'portfolio', 'company'].includes(parts[parts.length - 1]);
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
    
    // Week countdown timer (7 days in seconds = 604800, but we'll use a shorter duration for gameplay)
    const WEEK_DURATION = 300; // 5 minutes per week for gameplay
    const [weekTimeLeft, setWeekTimeLeft] = useState(WEEK_DURATION);
    const [weekAlertShown, setWeekAlertShown] = useState(false);

    const { notifications, markNotificationRead } = useNotifications();

    useEffect(() => {
        if (!gameState && !isRunning) startSimulation();
    }, [gameState, isRunning, startSimulation]);

    const completedIds = useMemo(() =>
        new Set((gameState?.completedActions ?? []).map(c => c.actionId)),
        [gameState?.completedActions]
    );

    const metrics = useMemo(() => gameState ? deriveMetrics(gameState, config) : [], [gameState, config]);

    // Current week's signals (preview, up to 3)
    const currentSignals = useMemo(() =>
        (gameState?.weeklySignalsShown ?? []).slice(0, 3),
        [gameState?.weeklySignalsShown]
    );

    // Current week's events (preview, up to 3)
    const currentEvents = useMemo(() =>
        (gameState?.weeklyEventsShown ?? []).slice(0, 3),
        [gameState?.weeklyEventsShown]
    );

    // Week change notification logic
    const lastWeekRef = useRef<number>(1);
    const [weekChangeInfo, setWeekChangeInfo] = useState<{ week: number; total: number } | null>(null);

    useEffect(() => {
        if (gameState && gameState.week > lastWeekRef.current) {
            setWeekChangeInfo({ week: gameState.week, total: gameState.totalWeeks });
            lastWeekRef.current = gameState.week;
            setTimeout(() => setWeekChangeInfo(null), 8000);
            // Reset timer for new week
            setWeekTimeLeft(WEEK_DURATION);
            setWeekAlertShown(false);
        }
    }, [gameState?.week]);
    
    // Week countdown timer effect
    useEffect(() => {
        if (!isRunning || isPaused) return;
        
        const timer = setInterval(() => {
            setWeekTimeLeft((prev) => {
                if (prev <= 1) {
                    // Week time has passed
                    if (!weekAlertShown) {
                        setWeekAlertShown(true);
                        // Show alert
                        alert(`Week ${gameState?.week || 1} has passed!`);
                        // Auto advance to next week
                        advanceTime();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [isRunning, isPaused, gameState?.week, weekAlertShown]);

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
        { name: 'Dashboard', icon: Home, id: 'dashboard' },
        { name: 'Backlog', icon: LayoutList, id: 'backlog', badge: backlogCount > 0 ? backlogCount : undefined },
        { name: 'Roadmap', icon: Map, id: 'roadmap' },
        { name: 'Company', icon: Building2, id: 'company' },
        { name: 'Documents', icon: FolderOpen, id: 'documents' },
        { name: 'Portfolio', icon: FolderHeart, id: 'portfolio' },
        { name: 'User Guide', icon: BookOpen, id: 'guide' },
    ];

    if (!gameState) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[20px] shadow-2xl text-center text-white max-w-md mx-4 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Week {weekChangeInfo.week} Started!</h2>
                        <p className="text-blue-100 opacity-90 mb-6 font-medium">You have {weekChangeInfo.total - weekChangeInfo.week + 1} weeks left in the simulation.</p>
                        <button
                            onClick={() => setWeekChangeInfo(null)}
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Get to Work
                        </button>
                    </div>
                </div>
            )}

            {/* Meeting Call Overlay */}
            {activeMeeting && showMeetingContent && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 p-4">
                    <div className="glass-panel w-full max-w-lg rounded-[20px] border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                        <div className="p-8 text-center">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-50" />
                                <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-spin-slow opacity-30 ${activeMeeting.fromColor.includes('red') ? 'border-red-500' : 'border-blue-500'}`} />
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl z-10 relative ${activeMeeting.fromColor}`}>
                                    {activeMeeting.fromInitials}
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                                <PhoneCall className="w-3 h-3" /> Incoming Strategy Call
                            </div>

                            <h2 className="text-3xl font-black dark:text-white mb-2">{activeMeeting.title}</h2>
                            <p className="text-gray-400 font-medium mb-1">From: {activeMeeting.from}</p>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                {activeMeeting.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    <Video className="w-5 h-5" /> Join Now
                                </button>

                                <button
                                    onClick={() => respondToMeeting('later')}
                                    className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
                                >
                                    Submit Later
                                </button>

                                <button
                                    onClick={() => {
                                        // Logic to mark as skipped/not available (would reduce stakeholder satisfaction)
                                        respondToMeeting('unavailable');
                                    }}
                                    className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white/50 text-sm font-medium rounded-2xl border border-dashed border-white/5 transition-all"
                                >
                                    Not Available
                                </button>

                                <button
                                    onClick={() => respondToMeeting('ignore')}
                                    className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white/50 text-sm font-medium rounded-2xl border border-dashed border-white/5 transition-all"
                                >
                                    Didn't do it
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 flex items-center justify-center gap-6 border-t border-white/10">
                            <div className="flex flex-col items-center gap-1 opacity-40">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[10px] text-white">Audio</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[10px] text-white/60">Decline</span>
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
                    <div className="p-4 lg:p-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[16px] shadow-lg flex items-center justify-center text-white" style={{ backgroundColor: config.primaryColor }}>
                            {config.industry.toLowerCase().includes('fintech') || config.industry.toLowerCase().includes('payment') ? (
                                <CreditCard className="w-4 h-4" />
                            ) : config.industry.toLowerCase().includes('tech') ? (
                                <Zap className="w-4 h-4" />
                            ) : (
                                <Building2 className="w-4 h-4" />
                            )}
                        </div>
                        <span className="font-bold text-base lg:text-lg tracking-tight truncate">{config.companyName}</span>
                        <button 
                            onClick={() => setMobileSidebarOpen(false)}
                            className="lg:hidden ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 lg:px-4 py-4 space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[12px] transition-colors relative ${activeTab === item.id
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="flex-1 text-left">{item.name}</span>
                                {item.badge !== undefined && (
                                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-3 lg:p-4 mx-3 lg:mx-4 mb-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Phase Progress</div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${gameState.phaseProgress}%`, backgroundColor: config.primaryColor }} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(gameState.phaseProgress)}% complete</p>
                    </div>
                    
                    {/* Week Countdown Timer */}
                    <div className="p-3 lg:p-4 mx-3 lg:mx-4 mb-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Week Timer</span>
                            <span className={`text-xs font-mono font-bold ${weekTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                                {Math.floor(weekTimeLeft / 60).toString().padStart(2, '0')}:{(weekTimeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all ${weekTimeLeft < 60 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                style={{ width: `${(weekTimeLeft / WEEK_DURATION) * 100}%` }} 
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Time remaining in week</p>
                    </div>
                    
                    {/* Dark Mode Toggle */}
                    <div className="p-3 lg:p-4 mx-3 lg:mx-4 mb-4 border-t border-gray-200 dark:border-gray-800">
                        <button 
                            onClick={toggleTheme}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            <span className="flex-1 text-left">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
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
                            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition hidden sm:flex">
                                <ChevronRight className="h-5 w-5 rotate-180 text-gray-500 dark:text-gray-400" />
                            </button>
                            <h1 className="text-sm lg:text-base font-semibold dark:text-white truncate">PM Workspace</h1>
                            <span className="hidden sm:inline-flex text-xs font-bold px-2 py-1 rounded border" style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor, borderColor: `${config.primaryColor}30` }}>
                                WEEK {String(gameState.week).padStart(2, '0')}
                            </span>
                            <div className="hidden md:flex items-center gap-1.5 px-2 lg:px-3 py-1 font-mono text-xs lg:text-sm bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                <Clock className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${gameState.timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                                <span className={gameState.timeLeft < 60 ? 'text-red-500 font-bold' : 'dark:text-white'}>
                                    {Math.floor(gameState.timeLeft / 60).toString().padStart(2, '0')}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                            {isPaused && (
                                <span className="hidden sm:inline-flex bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                                    <Pause className="w-3 h-3" /> PAUSED
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Notifications - icon only */}
                            <button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-500" />
                                {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                            </button>
                            
                            {/* Play/Pause - icon only */}
                            {!isRunning ? (
                                <button onClick={() => { enableSounds(); startSimulation(); }} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all" title="Start">
                                    <Play className="w-5 h-5" />
                                </button>
                            ) : isPaused ? (
                                <button onClick={() => { enableSounds(); resumeSimulation(); }} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all" title="Resume">
                                    <Play className="w-5 h-5" />
                                </button>
                            ) : (
                                <button onClick={pauseSimulation} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all" title="Pause">
                                    <Pause className="w-5 h-5" />
                                </button>
                            )}
                            
                            {/* Next Week - arrow icon only */}
                            <button
                                onClick={advanceTime}
                                disabled={!isRunning || isPaused}
                                className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                                title="Next Week"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
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
                        ) : activeTab === 'portfolio' ? (
                            <PortfolioBuilder artifacts={(gameState as any).artifacts || []} />
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
                                    // Find action by ID from the node trigger
                                    const allActions = [
                                        ...(config.weeklyActions || []),
                                        ...((gameState as any).backlogActionItems || [])
                                    ];
                                    const action = allActions.find(a => a.id === id);
                                    if (action) {
                                        setOpenModal({ kind: 'weekly', item: action as any });
                                    } else {
                                        // Fallback: open first active action of the week
                                        const weekAction = (config.weeklyActions || []).find(a => a.week === gameState.week);
                                        if (weekAction) setOpenModal({ kind: 'weekly', item: weekAction });
                                    }
                                }}
                            />
                        ) : activeTab === 'guide' ? (
                            /* ── User Guide ── */
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
                                <div className="max-w-3xl mx-auto">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Guide</h2>
                                        <p className="text-gray-500 dark:text-gray-400">Everything you need to know about this simulation</p>
                                    </div>

                                    {/* Simulation Overview */}
                                    <div className="bg-white dark:bg-gray-800/50 rounded-[16px] border border-gray-200 dark:border-gray-700 p-5 mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Simulation Overview</h3>
                                                <p className="text-sm text-gray-500">{config.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                            <p><strong className="text-gray-900 dark:text-white">Company:</strong> {config.companyName}</p>
                                            <p><strong className="text-gray-900 dark:text-white">Industry:</strong> {config.industry}</p>
                                            <p><strong className="text-gray-900 dark:text-white">Challenge:</strong> {config.challenge}</p>
                                            <p>{config.challengeDetails}</p>
                                        </div>
                                    </div>

                                    {/* How to Play */}
                                    <div className="bg-white dark:bg-gray-800/50 rounded-[16px] border border-gray-200 dark:border-gray-700 p-5 mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <HelpCircle className="w-5 h-5 text-blue-500" />
                                            How to Navigate
                                        </h3>
                                        
                                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-500">1</span>
                                                </div>
                                                <p><strong>Dashboard</strong> — Monitor your KPIs (Budget, Progress, Risk, Morale) and see weekly signals/events</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-500">2</span>
                                                </div>
                                                <p><strong>Backlog</strong> — Your main workspace. Complete actions, respond to signals, and make decisions</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-500">3</span>
                                                </div>
                                                <p><strong>Roadmap</strong> — Visual timeline showing project phases and your progress</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-500">4</span>
                                                </div>
                                                <p><strong>Company</strong> — Learn about stakeholders, company news, and industry context</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-500">5</span>
                                                </div>
                                                <p><strong>Documents</strong> — Generate artifacts like PRDs, roadmaps, and decision memos</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[16px] p-5">
                                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-3">Pro Tips</h3>
                                        <ul className="space-y-2 text-sm text-amber-600 dark:text-amber-300 list-disc list-inside">
                                            <li>Keep an eye on the week timer — it auto-advances when time runs out</li>
                                            <li>Balance all four KPIs: Budget, Progress, Risk, and Morale</li>
                                            <li>Check the Backlog regularly for urgent actions</li>
                                            <li>Read stakeholder messages before making big decisions</li>
                                            <li>Generate documents to build your portfolio</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── Dashboard ── */
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
                                {/* KPI Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    {metrics.map((m) => (
                                        <div key={m.label} className="bg-white dark:bg-gray-800/80 rounded-[20px] p-3 sm:p-4 border border-gray-200 dark:border-gray-700/60">
                                            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium truncate">{m.label}</div>
                                            </div>
                                            <div className="text-xl sm:text-2xl font-bold mb-1 dark:text-white">{m.value}</div>
                                            <div className={`text-xs flex items-center gap-1 ${m.trendColor === 'green' ? 'text-emerald-400' : m.trendColor === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                {m.trendDir === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                <span className="truncate">{m.trendVal}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                                    {/* LEFT: Signals & Events Preview */}
                                    <div className="space-y-3 sm:space-y-4">
                                        {/* Signals */}
                                        <div className="glass-panel rounded-[20px] border border-gray-200 dark:border-white/5 overflow-hidden">
                                            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                                                <h3 className="text-sm font-semibold dark:text-white flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                                    Signals — Week {gameState.week}
                                                </h3>
                                                <button onClick={() => setActiveTab('backlog')} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                                    View all <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                                {currentSignals.length === 0 ? (
                                                    <div className="text-center py-6">
                                                        <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-500 text-sm">No signals this week yet.</p>
                                                    </div>
                                                ) : currentSignals.map((s) => (
                                                    <div key={s.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-[16px] border border-gray-100 dark:border-gray-800">
                                                        <div className={`w-7 h-7 rounded-full ${s.sourceColor} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>{s.sourceInitials}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="text-xs font-semibold dark:text-gray-300">{s.source}</span>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${SEV_DOT[s.severity]}`} />
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{s.message}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Events */}
                                        <div className="glass-panel rounded-[20px] border border-gray-200 dark:border-white/5 overflow-hidden">
                                            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                                                <h3 className="text-sm font-semibold dark:text-white flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                                    Events — Week {gameState.week}
                                                </h3>
                                                <button onClick={() => setActiveTab('backlog')} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                                    View all <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                                {currentEvents.length === 0 ? (
                                                    <div className="text-center py-6">
                                                        <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-500 text-sm">No events this week.</p>
                                                    </div>
                                                ) : currentEvents.map((e) => (
                                                    <div
                                                        key={e.id}
                                                        onClick={() => {
                                                            if (e.actionId) {
                                                                const allActions = [
                                                                    ...(config.weeklyActions || []),
                                                                    ...((gameState as any).backlogActionItems || [])
                                                                ];
                                                                const action = allActions.find(a => a.id === e.actionId);
                                                                if (action) setOpenModal({ kind: 'weekly', item: action as any });
                                                            }
                                                        }}
                                                        className={`p-3 rounded-lg border transition-all ${e.requiresAction ? 'cursor-pointer hover:border-amber-500 border-amber-500/30 bg-amber-500/5' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`w-6 h-6 rounded-full ${e.fromColor} flex items-center justify-center text-[10px] font-bold`}>{e.fromInitials}</span>
                                                            <span className="text-xs font-semibold dark:text-gray-300">{e.title}</span>
                                                            {e.requiresAction && <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">Action</span>}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 pl-8 line-clamp-2">{e.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stakeholders */}
                                        <div className="glass-panel rounded-[12px] border border-gray-200 dark:border-white/5 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Key Stakeholders</h3>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {gameState.stakeholders.map((person) => (
                                                    <div key={person.id} className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: config.primaryColor }}>
                                                                {person.name.charAt(0)}
                                                            </div>
                                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${person.satisfaction > 70 ? 'bg-emerald-500' : person.satisfaction > 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-semibold truncate dark:text-gray-200">{person.name}</span>
                                                                <span className="text-[10px] text-gray-400">{person.role}</span>
                                                            </div>
                                                            <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div className={`h-full transition-all ${person.satisfaction > 70 ? 'bg-emerald-500' : person.satisfaction > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${person.satisfaction}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: Strategic Actions */}
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-gray-800/50 rounded-[12px] border-2 border-dashed overflow-hidden" style={{ borderColor: `${config.primaryColor}40` }}>
                                            <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: config.primaryColor }}>
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-white" />
                                                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">This Week's Actions</h3>
                                                </div>
                                                {weeklyActions.filter(a => !completedIds.has(a.id)).length > 0 && (
                                                    <span className="text-[10px] bg-white text-gray-800 px-2 py-1 rounded-full font-bold animate-pulse">
                                                        {weeklyActions.filter(a => !completedIds.has(a.id)).length} PENDING
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-5 space-y-3">
                                                {weeklyActions.length === 0 && availableActions.length === 0 ? (
                                                    <div className="text-center py-6">
                                                        <CheckCircle className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">All actions done for Week {gameState.week}.</p>
                                                        <button onClick={advanceTime} className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all">
                                                            Advance to Next Week
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Rich weekly actions */}
                                                        {weeklyActions.filter(a => !completedIds.has(a.id)).map((action) => (
                                                            <button
                                                                key={action.id}
                                                                onClick={() => setOpenModal({ kind: 'weekly', item: action })}
                                                                className="w-full group text-left p-4 rounded-[12px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${PRI[action.priority]}`}>{action.priority}</span>
                                                                    <span className="text-[10px] text-gray-400 uppercase">{action.actionType}</span>
                                                                    {action.dueWeek === gameState.week && <span className="text-[10px] text-red-400 font-bold ml-auto">Due this week</span>}
                                                                </div>
                                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                                                    {action.title}
                                                                    <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                                </h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{action.description}</p>
                                                            </button>
                                                        ))}

                                                        {/* Legacy engine actions */}
                                                        {availableActions.map((action) => (
                                                            <button
                                                                key={action.id}
                                                                onClick={() => setOpenModal({ kind: 'legacy', item: action })}
                                                                className="w-full group text-left p-4 rounded-[12px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] hover:border-amber-500 hover:bg-amber-500/5 transition-all"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Decision</span>
                                                                </div>
                                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                                                    {action.name}
                                                                    <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                                </h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{action.description}</p>
                                                            </button>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Backlog shortcut */}
                                        {backlogCount > 0 && (
                                            <button
                                                onClick={() => setActiveTab('backlog')}
                                                className="w-full p-4 rounded-[12px] border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-red-400">{backlogCount} Overdue Item{backlogCount > 1 ? 's' : ''}</p>
                                                        <p className="text-xs text-gray-500">Click to view in Backlog →</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )}
                                    </div>
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
                        <p className="text-gray-500 mb-8">You reached the end of the {config.companyName} scenario.</p>
                        <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-[16px] p-6 mb-8 border border-gray-100 dark:border-gray-800">
                            <div className="text-5xl font-black dark:text-white mb-2">{score.overall}%</div>
                            <div className="text-sm font-bold text-emerald-500 uppercase tracking-widest">{score.grade} Grade</div>
                            <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-500">
                                <span>Decisions: {score.breakdown.decisions}%</span>
                                <span>Stakeholders: {score.breakdown.stakeholders}%</span>
                                <span>Budget: {score.breakdown.budget}%</span>
                                <span>Timeline: {score.breakdown.timeline}%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={restartSimulation} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all">Try Again</button>
                            <button onClick={() => navigate('/simulations')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-all">Exit</button>
                        </div>
                    </div>
                </div>
            )}

            <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </>
    );
}
