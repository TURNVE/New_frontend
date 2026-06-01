/**
 * SimulationShell — Reusable Simulation Workspace
 * Uses SimulationConfig. Backlog tab is the main activity hub.
 */
import { lazy, Suspense, useState, useCallback, useEffect, useMemo, useRef, type ComponentProps } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronRight, LayoutList, Building2,
    Bell, Play, Pause,
    Clock, CheckCircle, Trophy, AlertTriangle, FileText,
    PhoneCall, Video, Menu, Calendar, Sparkles, Mail, MonitorPlay,
    ClipboardCheck, PartyPopper, UserRound, MessageCircle, LockKeyhole, Rocket,
    Target, Users, BookOpen, Lightbulb, BarChart3, ArrowLeft, ArrowRight, BadgeCheck, ListChecks,
    X, Download,
} from 'lucide-react';
import useSimulationCore from './useSimulationCore';
import type {
    SimulationConfig, ScenarioAction, ActionChoice,
    WeeklyActionItem, WeeklyEvent, BacklogActionItem,
} from './types';
import { DocumentsPanel } from '../../components/simulation/DocumentsPanel';
import { CompanyPanel } from '../../components/company/CompanyPanel';
import { NotificationCenter, useNotifications } from '../../components/communications/NotificationCenter';
import { ToastContainer } from '../../components/communications/ToastContainer';
import { WelcomeHint } from '../../components/overlay/WelcomeHint';
import { enableSounds } from '../../utils/sounds';
import ActionModal, { type ModalAction } from './components/ActionModal';
import { TypingText } from '../../components/ui/TypingText';
import SimRoadmapMindmap from './components/SimRoadmapMindmap';
import { CalendarPanel } from '../../components/simulation/CalendarPanel';

type ActiveTab = 'dashboard' | 'backlog' | 'roadmap' | 'documents' | 'company' | 'calendar';
type DocumentsPanelArtifact = ComponentProps<typeof DocumentsPanel>['artifacts'][number];

const InternThreeStage = lazy(() => import('./components/InternThreeStage'));

// ─── Priority badge ───────────────────────────────────────────
    const PRI: Record<string, string> = {
        urgent: 'bg-red-500/20 text-red-400',
        high: 'bg-primary/20 text-primary',
        normal: 'bg-primary/20 text-primary',
        low: 'bg-[rgba(255,255,255,0.1)] text-text-tertiary',
    };

// ─── Severity dot ─────────────────────────────────────────────
// ─── Metrics derivation ───────────────────────────────────────
const isInternConfig = (config: SimulationConfig) => config.id === 'sim-intern-001';
const isProductManagementConfig = (config: SimulationConfig) =>
    config.id.startsWith('sim-pm-') || config.promptEngine?.toLowerCase().includes('product management');

function getArtifactLabel(action: WeeklyActionItem) {
    if (action.artifactType === 'prd') return 'PRD / stories';
    if (action.artifactType === 'roadmap') return 'Prioritization artifact';
    if (action.artifactType === 'stakeholder_update') return 'Stakeholder update';
    if (action.artifactType === 'user_research') return 'Research summary';
    if (action.artifactType === 'metrics_report') return 'Metrics analysis';
    if (action.artifactType === 'decision_log') return 'Problem framing';
    if (action.artifactType === 'project_charter') return 'Portfolio case study';
    return action.outputTemplate?.[0]?.label ?? action.prdTitle ?? 'Work submission';
}

function getSkillLabel(action: WeeklyActionItem) {
    const title = action.title.toLowerCase();
    if (title.includes('feedback') || title.includes('complaint')) return 'User evidence';
    if (title.includes('impact') || title.includes('business')) return 'Business reasoning';
    if (title.includes('problem statement') || title.includes('define')) return 'Problem framing';
    if (title.includes('feature ideas') || title.includes('generate')) return 'Solution thinking';
    if (title.includes('prioritize')) return 'Trade-off thinking';
    if (title.includes('prd')) return 'Product documentation';
    if (title.includes('stories') || title.includes('acceptance')) return 'Engineering handoff';
    if (title.includes('stakeholder')) return 'Stakeholder communication';
    if (title.includes('portfolio') || title.includes('case study')) return 'Portfolio storytelling';
    return 'Product context';
}

function getActionPointTotal(action: WeeklyActionItem) {
    return action.scoringRubric?.reduce((sum, criterion) => sum + criterion.points, 0) ?? 0;
}

function getActionMaterialCount(action: WeeklyActionItem) {
    return action.workplaceMaterials?.length ?? 0;
}

function DetailedProjectBrief({
    config,
    pagePrimary,
}: {
    config: SimulationConfig;
    pagePrimary: string;
}) {
    const briefItems = [
        { label: 'Company', value: config.companyName },
        { label: 'Industry', value: config.industry },
        { label: 'Project type', value: config.projectType },
        { label: 'Team size', value: config.teamSize },
    ].filter((item) => item.value);

    const successCriteria = config.successCriteria ?? [];

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
            <div className="mb-5">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Detailed project brief
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                        {config.challenge}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">
                        {config.challengeDetails || config.description}
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {briefItems.map((item) => (
                    <div key={item.label} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.06]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {item.label}
                        </p>
                        <p className="mt-1 text-sm font-bold leading-5 text-slate-950 dark:text-white">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-white/[0.06]">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Project overview
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {config.description}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 dark:bg-white/[0.06]">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Company context
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {config.marketContext || config.technicalStack || `${config.companyName} is the workplace context for this simulation.`}
                    </p>
                </div>
            </div>

            {successCriteria.length > 0 && (
                <div className="mt-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        What success looks like
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {successCriteria.slice(0, 4).map((criterion, index) => (
                            <div key={criterion.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-black/20">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: pagePrimary }}>
                                    {index + 1}
                                </span>
                                <p className="text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
                                    {criterion.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function formatArtifactContent(content?: Record<string, unknown>) {
    if (!content) return 'No saved content for this artifact yet.';
    return Object.entries(content)
        .map(([key, value]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
            if (value && typeof value === 'object') {
                return `## ${label}\n${Object.entries(value as Record<string, unknown>)
                    .map(([nestedKey, nestedValue]) => `- ${nestedKey.replace(/_/g, ' ')}: ${String(nestedValue)}`)
                    .join('\n')}`;
            }
            return `## ${label}\n${String(value)}`;
        })
        .join('\n\n');
}

const INTERN_ACTION_STYLE: Record<string, { emoji: string; icon: React.ComponentType<{ className?: string }>; gradient: string; label: string }> = {
    'intern-action-offer-letter': {
        emoji: '💌',
        icon: Mail,
        gradient: 'from-rose-400 via-orange-300 to-amber-300',
        label: 'Document drop',
    },
    'intern-action-meet-pm': {
        emoji: '👋',
        icon: MessageCircle,
        gradient: 'from-violet-500 via-fuchsia-400 to-pink-300',
        label: 'Manager intro',
    },
    'intern-action-check-calendar': {
        emoji: '🗓️',
        icon: Calendar,
        gradient: 'from-cyan-400 via-sky-400 to-blue-500',
        label: 'Calendar quest',
    },
    'intern-action-accept-ceo-meeting': {
        emoji: '✅',
        icon: ClipboardCheck,
        gradient: 'from-emerald-400 via-teal-300 to-cyan-300',
        label: 'RSVP',
    },
    'intern-action-team-intro': {
        emoji: '🎉',
        icon: PartyPopper,
        gradient: 'from-amber-300 via-orange-400 to-rose-400',
        label: 'Team moment',
    },
    'intern-action-join-ceo-meeting': {
        emoji: '🎥',
        icon: MonitorPlay,
        gradient: 'from-indigo-500 via-violet-500 to-purple-400',
        label: 'Live room',
    },
    'intern-action-first-task': {
        emoji: '🧩',
        icon: ClipboardCheck,
        gradient: 'from-lime-300 via-emerald-400 to-teal-400',
        label: 'First mission',
    },
    'intern-action-promotion': {
        emoji: '🚀',
        icon: Trophy,
        gradient: 'from-yellow-300 via-pink-400 to-violet-500',
        label: 'Level up',
    },
};

function getInternActionStyle(actionId: string) {
    return INTERN_ACTION_STYLE[actionId] ?? {
        emoji: '✨',
        icon: Sparkles,
        gradient: 'from-violet-400 via-cyan-300 to-emerald-300',
        label: 'Action',
    };
}

function getVisibleInternActions(actions: WeeklyActionItem[], completedIds: Set<string>) {
    const firstPendingIndex = actions.findIndex((action) => !completedIds.has(action.id));
    if (firstPendingIndex === -1) return actions;
    return actions.filter((action, index) => completedIds.has(action.id) || index <= firstPendingIndex + 1);
}

function InternActionCard({
    action,
    index,
    isCompleted,
    isLocked = false,
    onOpenAction,
}: {
    action: WeeklyActionItem;
    index: number;
    isCompleted: boolean;
    isLocked?: boolean;
    onOpenAction: (item: WeeklyActionItem) => void;
}) {
    const style = getInternActionStyle(action.id);
    const Icon = isLocked ? LockKeyhole : isCompleted ? CheckCircle : style.icon;

    return (
        <button
            type="button"
            disabled={isLocked}
            onClick={() => !isLocked && onOpenAction(action)}
            className={`group relative w-full overflow-hidden rounded-3xl border p-4 text-left shadow-sm transition-all duration-500 ${
                isLocked
                    ? 'border-white/60 bg-white/50 opacity-70 dark:border-white/10 dark:bg-white/5'
                    : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/90 dark:border-emerald-400/20 dark:bg-emerald-400/10'
                        : 'border-white/80 bg-white/85 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/[0.07]'
            }`}
            style={{ animation: `intern-card-pop 420ms ease-out ${index * 90}ms both` }}
        >
            {!isLocked && (
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-[0.12] transition-opacity group-hover:opacity-20`} />
            )}
            <div className="relative flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-2xl shadow-lg shadow-black/10 ${!isLocked && !isCompleted ? 'animate-bounce-slow' : ''}`}>
                    {isLocked ? <LockKeyhole className="h-6 w-6 text-white" /> : style.emoji}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
                            {isLocked ? 'Coming next' : style.label}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'}`}>
                            {isCompleted ? 'Done' : action.priority}
                        </span>
                    </div>
                    <h4 className="text-base font-black text-slate-950 dark:text-white">{action.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                        {isLocked ? 'Complete the current mission to unlock this next moment.' : action.description}
                    </p>
                </div>
                <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-md dark:bg-white/10 dark:text-slate-200'}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
        </button>
    );
}

function InternDashboardPanel({
    gameState,
    config,
    completedIds,
    availableActions,
    onOpenAction,
    onOpenLegacy,
    setActiveTab,
    pagePrimary,
}: {
    gameState: NonNullable<ReturnType<typeof useSimulationCore>['gameState']>;
    config: SimulationConfig;
    completedIds: Set<string>;
    availableActions: ScenarioAction[];
    onOpenAction: (item: WeeklyActionItem) => void;
    onOpenLegacy: (item: ScenarioAction) => void;
    setActiveTab: (tab: ActiveTab) => void;
    pagePrimary: string;
}) {
    const orderedActions = gameState.weeklyActionsForThisWeek;
    const visibleActions = getVisibleInternActions(orderedActions, completedIds);
    const pendingVisibleActions = visibleActions.filter((action) => !completedIds.has(action.id));
    const lockedCount = Math.max(0, orderedActions.length - visibleActions.length);
    const weeks = Array.from({ length: gameState.totalWeeks }, (_, index) => index + 1);
    const scrollToPanel = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative flex-1 overflow-y-auto bg-[#fff7ed] p-4 text-slate-950 sm:p-6 lg:p-8 custom-scrollbar dark:bg-[#08090a] dark:text-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-80px] top-[-120px] h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-500/10" />
                <div className="absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-fuchsia-300/40 blur-3xl dark:bg-fuchsia-500/10" />
                <div className="absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/10" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                    <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-orange-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.07] dark:shadow-black/30 sm:p-7">
                        <div className="absolute right-6 top-6 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-yellow-950 shadow-lg rotate-3">
                            Day 1 Quest
                        </div>
                        <nav className="mb-5 flex max-w-full gap-2 overflow-x-auto rounded-3xl border border-white/70 bg-white/75 p-1.5 text-xs font-black uppercase tracking-widest shadow-sm dark:border-white/10 dark:bg-white/10" aria-label="Intern onboarding navigation">
                            <button type="button" onClick={() => setActiveTab('dashboard')} className="shrink-0 rounded-2xl bg-slate-950 px-4 py-2 text-white shadow-sm dark:bg-white dark:text-slate-950">
                                Welcome
                            </button>
                            <button type="button" onClick={() => scrollToPanel('intern-office-stage')} className="shrink-0 rounded-2xl px-4 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                                Office
                            </button>
                            <button type="button" onClick={() => scrollToPanel('intern-mission-stream')} className="shrink-0 rounded-2xl px-4 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                                Missions
                            </button>
                            <button type="button" onClick={() => setActiveTab('calendar')} className="shrink-0 rounded-2xl px-4 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                                Calendar
                            </button>
                            <button type="button" onClick={() => setActiveTab('backlog')} className="shrink-0 rounded-2xl px-4 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                                Task Board
                            </button>
                        </nav>
                        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                                    <Sparkles className="h-4 w-4 animate-pulse" />
                                    Intern onboarding simulator
                                </div>
                                <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                                    Welcome to <span className="text-violet-600 dark:text-violet-300">{config.companyName}</span>. Your first PM adventure starts now.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                                    Open messages, read your offer letter, join rooms, meet teammates, and unlock each mission one step at a time.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => pendingVisibleActions[0] ? onOpenAction(pendingVisibleActions[0]) : setActiveTab('backlog')}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                                    >
                                        <Rocket className="h-4 w-4" />
                                        {pendingVisibleActions[0] ? 'Start Next Action' : 'Open Task Board'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('calendar')}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 dark:bg-white/10 dark:text-white dark:ring-1 dark:ring-white/10"
                                    >
                                        <Calendar className="h-4 w-4 text-cyan-500" />
                                        Check Calendar
                                    </button>
                                </div>
                            </div>

                            <div id="intern-office-stage" className="relative min-h-[320px] scroll-mt-6">
                                <Suspense
                                    fallback={
                                        <div className="flex h-[340px] items-center justify-center rounded-[28px] bg-white/70 text-sm font-black text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                            Loading interactive office...
                                        </div>
                                    }
                                >
                                    <InternThreeStage
                                        actions={orderedActions}
                                        completedIds={completedIds}
                                        onOpenAction={onOpenAction}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl shadow-violet-300/30 dark:border-white/10 dark:bg-white/[0.07] dark:shadow-black/30">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">Onboarding weeks</p>
                                <h2 className="text-3xl font-black">Week {gameState.week}/{gameState.totalWeeks}</h2>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 to-pink-400 text-3xl shadow-lg animate-floaty">
                                🏆
                            </div>
                        </div>
                        <div className="grid gap-2">
                            {weeks.map((week) => {
                                const weekActions = (config.weeklyActions ?? []).filter((action) => action.week === week);
                                const weekDone = weekActions.filter((action) => completedIds.has(action.id)).length;
                                const status = week < gameState.week ? 'Completed' : week === gameState.week ? 'Current' : 'Upcoming';
                                return (
                                    <button
                                        key={week}
                                        type="button"
                                        onClick={() => setActiveTab('calendar')}
                                        className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
                                            week === gameState.week
                                                ? 'border-cyan-300/70 bg-cyan-300/15'
                                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-black">Week {week}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{weekDone}/{weekActions.length} activities</p>
                                            </div>
                                            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-100">{status}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-2xl bg-white/10 p-3">
                                <p className="text-2xl font-black">{completedIds.size}</p>
                                <p className="text-[10px] font-bold uppercase text-white/60">Done</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-3">
                                <p className="text-2xl font-black">{pendingVisibleActions.length}</p>
                                <p className="text-[10px] font-bold uppercase text-white/60">Active</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-3">
                                <p className="text-2xl font-black">{lockedCount}</p>
                                <p className="text-[10px] font-bold uppercase text-white/60">Locked</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className="mt-5 w-full rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50"
                            style={{ backgroundColor: pagePrimary }}
                        >
                            Open Calendar Plan
                        </button>
                    </div>
                </section>

                <DetailedProjectBrief config={config} pagePrimary={pagePrimary} />

                <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
                    <div id="intern-mission-stream" className="scroll-mt-6 rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.07] dark:shadow-black/20">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-violet-600">Action stream</p>
                                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Week {gameState.week} tasks arrive as missions</h2>
                            </div>
                            <button onClick={() => setActiveTab('backlog')} className="rounded-2xl bg-violet-100 px-4 py-2 text-xs font-black text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                                Full board
                            </button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {visibleActions.map((action, index) => (
                                <InternActionCard
                                    key={action.id}
                                    action={action}
                                    index={index}
                                    isCompleted={completedIds.has(action.id)}
                                    onOpenAction={onOpenAction}
                                />
                            ))}
                            {lockedCount > 0 && (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 p-5 text-center text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                                    <LockKeyhole className="mx-auto mb-2 h-6 w-6" />
                                    <p className="text-sm font-black">{lockedCount} mission{lockedCount === 1 ? '' : 's'} unlock later</p>
                                    <p className="mt-1 text-xs font-medium">Complete the active action to reveal the next step.</p>
                                </div>
                            )}
                        </div>
                        {availableActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => onOpenLegacy(action)}
                                className="mt-3 w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-sm font-bold text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
                            >
                                Decision: {action.name}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'Mailbox', body: 'Offer letter and HR notes land here.', icon: Mail, color: 'bg-rose-100 text-rose-600' },
                            { title: 'Meeting room', body: 'Calls become interactive scenes.', icon: MonitorPlay, color: 'bg-indigo-100 text-indigo-600' },
                            { title: 'Team map', body: 'Meet the people behind TechCorp.', icon: UserRound, color: 'bg-emerald-100 text-emerald-600' },
                        ].map((item) => (
                            <div key={item.title} className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.07]">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-950 dark:text-white">{item.title}</h3>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

// ─── Backlog Panel ────────────────────────────────────────────
function ProductActionCard({
    action,
    index,
    isCompleted = false,
    overdue = false,
    onOpenAction,
    primaryColor,
}: {
    action: WeeklyActionItem;
    index: number;
    isCompleted?: boolean;
    overdue?: boolean;
    onOpenAction: (item: WeeklyActionItem) => void;
    primaryColor: string;
}) {
    const points = getActionPointTotal(action);
    const materialCount = getActionMaterialCount(action);

    return (
        <button
            type="button"
            onClick={() => onOpenAction(action)}
            className={`group w-full overflow-hidden rounded-lg border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#111318] ${
                overdue
                    ? 'border-red-300 dark:border-red-500/40'
                    : isCompleted
                        ? 'border-emerald-200 opacity-80 dark:border-emerald-400/30'
                        : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
            }`}
            style={{
                animation: `intern-card-pop 320ms ease-out ${index * 55}ms both`,
                backgroundImage: isCompleted
                    ? undefined
                    : `linear-gradient(135deg, ${primaryColor}14 0%, transparent 48%)`,
            }}
        >
            <div className="h-1 w-full" style={{ backgroundColor: isCompleted ? '#10b981' : overdue ? '#ef4444' : primaryColor }} />
            <div className="p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: primaryColor }}>
                        Module {action.week}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
                        {isCompleted ? 'Completed' : action.priority}
                    </span>
                    {overdue && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-700 dark:bg-red-500/15 dark:text-red-200">
                            Overdue
                        </span>
                    )}
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm" style={{ backgroundColor: isCompleted ? '#10b981' : primaryColor }}>
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className={`text-sm font-bold leading-snug ${isCompleted ? 'text-slate-600 line-through dark:text-slate-400' : 'text-slate-950 dark:text-white'}`}>
                            {action.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            {action.description}
                        </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                <div className="mt-4 grid gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 dark:bg-white/[0.06]">
                        <BadgeCheck className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        {getArtifactLabel(action)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 dark:bg-white/[0.06]">
                        <BookOpen className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        {materialCount} material{materialCount === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 dark:bg-white/[0.06]">
                        <Target className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                        {points || 10} pts
                    </span>
                </div>
            </div>
        </button>
    );
}

function ProductManagementDashboardPanel({
    gameState,
    config,
    completedIds,
    availableActions,
    advanceTime,
    onOpenAction,
    onOpenLegacy,
    setActiveTab,
    pagePrimary,
}: {
    gameState: NonNullable<ReturnType<typeof useSimulationCore>['gameState']>;
    config: SimulationConfig;
    completedIds: Set<string>;
    availableActions: ScenarioAction[];
    advanceTime: () => void;
    onOpenAction: (item: WeeklyActionItem) => void;
    onOpenLegacy: (item: ScenarioAction) => void;
    setActiveTab: (tab: ActiveTab) => void;
    pagePrimary: string;
}) {
    const allActions = config.weeklyActions ?? gameState.weeklyActionsForThisWeek;
    const currentActions = gameState.weeklyActionsForThisWeek;
    const pendingCurrentActions = currentActions.filter((action) => !completedIds.has(action.id));
    const nextAction = pendingCurrentActions[0] ?? allActions.find((action) => !completedIds.has(action.id));
    const completedTotal = allActions.filter((action) => completedIds.has(action.id)).length;
    const progress = Math.round((completedTotal / Math.max(1, allActions.length)) * 100);
    const artifactCount = gameState.artifacts?.length ?? 0;
    const materialCount = allActions.reduce((sum, action) => sum + getActionMaterialCount(action), 0);
    const currentModuleIndex = nextAction ? Math.max(0, allActions.findIndex((action) => action.id === nextAction.id)) : completedTotal;
    const keyMetric = config.kpis[0]?.label ?? 'Key product metric';

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 text-slate-950 custom-scrollbar dark:bg-[#08090a] dark:text-white sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-4 md:grid-cols-2">
                        <article
                            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318] md:col-span-2"
                            style={{ backgroundImage: `linear-gradient(135deg, ${pagePrimary}18 0%, transparent 48%)` }}
                        >
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: pagePrimary }}>
                                    Product Management Intern
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                                    {config.industry}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                                    Module {gameState.week} of {gameState.totalWeeks}
                                </span>
                            </div>
                            <h1 className="max-w-3xl text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                                Solve a real product problem for {config.companyName}.
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">
                                {config.challengeDetails}
                            </p>
                        </article>

                        {[
                            { label: 'Product context', value: config.description, icon: Users },
                            { label: 'Business goal', value: config.challenge, icon: Target },
                            { label: 'Metric to improve', value: keyMetric, icon: BarChart3 },
                            { label: 'Final evidence', value: 'Portfolio-ready PM case study', icon: FileText },
                        ].map((item) => (
                            <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/[0.06]">
                                    <item.icon className="h-5 w-5" style={{ color: pagePrimary }} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.label}</p>
                                <p className="mt-1 text-sm font-bold leading-6 text-slate-900 dark:text-white">{item.value}</p>
                            </article>
                        ))}
                    </div>

                    <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                        <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-lg dark:border-white/10">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/55">Internship progress</p>
                                    <p className="mt-1 text-3xl font-black">{progress}%</p>
                                </div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                                    <ListChecks className="h-7 w-7" style={{ color: pagePrimary }} />
                                </div>
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-white/10">
                                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: pagePrimary }} />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-lg bg-white/10 p-3">
                                    <p className="text-xl font-black">{completedTotal}</p>
                                    <p className="text-[10px] font-bold uppercase text-white/55">Done</p>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3">
                                    <p className="text-xl font-black">{artifactCount}</p>
                                    <p className="text-[10px] font-bold uppercase text-white/55">Artifacts</p>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3">
                                    <p className="text-xl font-black">{materialCount}</p>
                                    <p className="text-[10px] font-bold uppercase text-white/55">Materials</p>
                                </div>
                            </div>
                        </article>

                        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Next action</p>
                            <h2 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                                {nextAction?.title ?? 'Ready for final review'}
                            </h2>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {nextAction?.learnerInstruction ?? 'All visible module work is complete. Review your documents or move forward.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => nextAction ? onOpenAction(nextAction) : advanceTime()}
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
                                style={{ backgroundColor: pagePrimary }}
                            >
                                {nextAction ? 'Open Module' : `Advance to Module ${Math.min(gameState.week + 1, gameState.totalWeeks)}`}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </article>
                    </aside>
                </section>

                <DetailedProjectBrief config={config} pagePrimary={pagePrimary} />

                <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Project path</p>
                                <h2 className="text-xl font-black text-slate-950 dark:text-white">10 modules from evidence to portfolio</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveTab('backlog')}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                Open task board
                            </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {allActions.map((action, index) => {
                                const status = completedIds.has(action.id)
                                    ? 'Done'
                                    : index === currentModuleIndex
                                        ? 'Active'
                                        : index < currentModuleIndex
                                            ? 'Review'
                                            : 'Locked';
                                const isClickable = status !== 'Locked';
                                return (
                                    <button
                                        key={action.id}
                                        type="button"
                                        disabled={!isClickable}
                                        onClick={() => isClickable && onOpenAction(action)}
                                        className={`rounded-lg border p-3 text-left transition ${
                                            status === 'Active'
                                                ? 'border-transparent shadow-md'
                                                : status === 'Done'
                                                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10'
                                                    : 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.04]'
                                        } ${isClickable ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-55'}`}
                                        style={status === 'Active' ? { boxShadow: `0 16px 32px ${pagePrimary}1f`, borderColor: `${pagePrimary}55` } : undefined}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: status === 'Done' ? '#10b981' : pagePrimary }}>
                                                {status === 'Done' ? <CheckCircle className="h-4 w-4" /> : index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: status === 'Active' ? pagePrimary : undefined }}>
                                                        {status}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{getSkillLabel(action)}</span>
                                                </div>
                                                <p className="text-sm font-bold leading-snug text-slate-950 dark:text-white">{action.title}</p>
                                                <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{getArtifactLabel(action)}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">How to work</p>
                            <div className="mt-4 space-y-3">
                                {[
                                    { title: 'Read the messy docs', body: 'Use complaints, tickets, metrics, and stakeholder notes as evidence.', icon: BookOpen },
                                    { title: 'Make a product call', body: 'Separate user pain from business impact before choosing a feature.', icon: Lightbulb },
                                    { title: 'Ship a portfolio artifact', body: 'Every module creates proof you can show in a PM case study.', icon: FileText },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10">
                                            <item.icon className="h-4 w-4" style={{ color: pagePrimary }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-950 dark:text-white">{item.title}</p>
                                            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Product signals</p>
                            <div className="mt-4 grid gap-2">
                                {config.kpis.slice(0, 3).map((kpi) => (
                                    <div key={kpi.id} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.06]">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{kpi.label}</p>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                                                kpi.status === 'critical'
                                                    ? 'bg-red-500/10 text-red-600 dark:text-red-300'
                                                    : kpi.status === 'warning'
                                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-200'
                                                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                                            }`}>
                                                {kpi.status}
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10">
                                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, kpi.progress))}%`, backgroundColor: pagePrimary }} />
                                        </div>
                                        <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">{kpi.goal}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Stakeholder pressure</p>
                            <div className="mt-4 space-y-3">
                                {config.stakeholders.slice(0, 3).map((stakeholder) => (
                                    <div key={stakeholder.id} className="flex gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/[0.06]">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: pagePrimary }}>
                                            {stakeholder.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-950 dark:text-white">{stakeholder.role}</p>
                                            <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{stakeholder.concerns[0] ?? stakeholder.priorities[0]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {availableActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => onOpenLegacy(action)}
                                className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-sm font-bold text-amber-900 transition hover:-translate-y-0.5 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
                            >
                                Decision: {action.name}
                            </button>
                        ))}
                    </aside>
                </section>
            </div>
        </div>
    );
}

interface BacklogPanelProps {
    gameState: ReturnType<typeof useSimulationCore>['gameState'];
    config: SimulationConfig;
    completedIds: Set<string>;
    onOpenAction: (item: WeeklyActionItem) => void;
}

function SimBacklogPanel({ gameState, config, completedIds, onOpenAction }: BacklogPanelProps) {
    const [filter, setFilter] = useState<'all' | 'todo' | 'done'>(() => isProductManagementConfig(config) ? 'all' : 'todo');

    if (!gameState) return null;

    const internMode = isInternConfig(config);
    const pmMode = isProductManagementConfig(config);
    const effectiveFilter = filter === 'all' ? 'todo' : filter;
    const currentWeek = gameState.week;
    const overdueActions: BacklogActionItem[] = gameState.backlogActionItems ?? [];
    const overdueIds = new Set(overdueActions.map(o => o.id));

    // Current week content only
    const weekEvents: WeeklyEvent[] = (config.weeklyEvents ?? []).filter(e => e.week === currentWeek);
    const weekActions: WeeklyActionItem[] = (config.weeklyActions ?? []).filter(a => a.week === currentWeek);

    // Separate by type
    const visibleWeekActions = internMode ? getVisibleInternActions(weekActions, completedIds) : weekActions;
    const actionItems = visibleWeekActions.filter(a => !completedIds.has(a.id));
    const completedActions = weekActions.filter(a => completedIds.has(a.id));
    const actionRequiredEvents = weekEvents.filter(e => e.requiresAction && !completedIds.has(e.actionId || ''));
    const lockedActionCount = Math.max(0, weekActions.length - visibleWeekActions.length);

    const todoItems = [...actionRequiredEvents, ...actionItems];
    const allActions = config.weeklyActions ?? [];
    const completedTotal = allActions.filter((action) => completedIds.has(action.id)).length;
    const notCompletedTotal = allActions.length - completedTotal;
    const projectProgress = Math.round((completedTotal / Math.max(1, allActions.length)) * 100);
    const nextPmAction = actionItems[0] ?? allActions.find((action) => !completedIds.has(action.id));
    const weekPointTotal = weekActions.reduce((sum, action) => sum + getActionPointTotal(action), 0);
    const weekMaterialTotal = weekActions.reduce((sum, action) => sum + getActionMaterialCount(action), 0);
    const boardTabs = pmMode
        ? [
            { id: 'all' as const, label: 'All weeks', count: allActions.length },
            { id: 'todo' as const, label: 'Not completed', count: notCompletedTotal },
            { id: 'done' as const, label: 'Completed', count: completedTotal },
        ]
        : [
            { id: 'todo' as const, label: 'To Do', count: todoItems.length },
            { id: 'done' as const, label: 'Done', count: completedActions.length },
        ];

    if (pmMode) {
        const totalMaterialCount = allActions.reduce((sum, action) => sum + getActionMaterialCount(action), 0);
        const totalPointCount = allActions.reduce((sum, action) => sum + getActionPointTotal(action), 0);
        const nextAvailableAction = allActions.find((action) => !completedIds.has(action.id) && action.week <= currentWeek)
            ?? allActions.find((action) => !completedIds.has(action.id));
        const weeklyTaskGroups = Array.from({ length: config.totalWeeks }, (_, index) => {
            const weekNumber = index + 1;
            const actions = allActions.filter((action) => action.week === weekNumber);
            const completed = actions.filter((action) => completedIds.has(action.id)).length;
            const notCompleted = actions.length - completed;
            const visibleActions = actions.filter((action) => {
                if (filter === 'done') return completedIds.has(action.id);
                if (filter === 'todo') return !completedIds.has(action.id);
                return true;
            });
            const weekStatus = weekNumber > currentWeek
                ? 'Locked'
                : notCompleted === 0 && actions.length > 0
                    ? 'Completed'
                    : weekNumber === currentWeek
                        ? 'Available'
                        : 'Not completed';

            return { weekNumber, actions, visibleActions, completed, notCompleted, weekStatus };
        }).filter((group) => group.actions.length > 0 && group.visibleActions.length > 0);

        return (
            <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#08090a]">
                <div className="border-b border-slate-200 p-4 dark:border-white/10 sm:p-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: config.primaryColor }}>
                                        PM Internship Board
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                        Week {currentWeek}/{config.totalWeeks}
                                    </span>
                                </div>
                                <h2 className="text-lg font-black text-slate-950 dark:text-white">{config.companyName} product task board</h2>
                                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    Track every module in the PM simulation: what is completed, what is not completed, and what unlocks by week.
                                </p>
                            </div>
                            <div className="grid min-w-[260px] grid-cols-4 gap-2 text-center text-xs">
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{projectProgress}%</p>
                                    <p className="font-bold uppercase text-slate-400">Progress</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{completedTotal}</p>
                                    <p className="font-bold uppercase text-slate-400">Done</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{notCompletedTotal}</p>
                                    <p className="font-bold uppercase text-slate-400">Open</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{totalMaterialCount}</p>
                                    <p className="font-bold uppercase text-slate-400">Docs</p>
                                </div>
                            </div>
                        </div>

                        {nextAvailableAction && (
                            <button
                                type="button"
                                onClick={() => nextAvailableAction.week <= currentWeek && onOpenAction(nextAvailableAction)}
                                disabled={nextAvailableAction.week > currentWeek}
                                className="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06]"
                            >
                                <span>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Next deliverable</span>
                                    <span className="block text-sm font-bold text-slate-950 dark:text-white">{getArtifactLabel(nextAvailableAction)}</span>
                                </span>
                                <ArrowRight className="h-4 w-4" style={{ color: config.primaryColor }} />
                            </button>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {boardTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilter(tab.id)}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition ${filter === tab.id ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15'}`}
                                    style={filter === tab.id ? { backgroundColor: config.primaryColor } : undefined}
                                >
                                    {tab.label}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-slate-500 dark:bg-black/20 dark:text-slate-300'}`}>{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar sm:p-6">
                    <div className="grid gap-4 xl:grid-cols-2">
                        {weeklyTaskGroups.map(({ weekNumber, visibleActions, completed, notCompleted, weekStatus }) => (
                            <section key={weekNumber} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Module {weekNumber}</p>
                                        <h3 className="text-base font-black text-slate-950 dark:text-white">Week {weekNumber} task list</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                                            weekStatus === 'Completed'
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                                                : weekStatus === 'Locked'
                                                    ? 'bg-slate-500/10 text-slate-500 dark:text-slate-300'
                                                    : weekStatus === 'Available'
                                                        ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-200'
                                                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-200'
                                        }`}>
                                            {weekStatus}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/10 dark:text-slate-300">
                                            {completed} done / {notCompleted} open
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {visibleActions.map((action) => {
                                        const isCompleted = completedIds.has(action.id);
                                        const isLocked = action.week > currentWeek && !isCompleted;
                                        const statusLabel = isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available';

                                        return (
                                            <button
                                                key={action.id}
                                                type="button"
                                                disabled={isLocked}
                                                onClick={() => !isLocked && onOpenAction(action)}
                                                className={`w-full rounded-lg border p-3 text-left transition ${
                                                    isCompleted
                                                        ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/10'
                                                        : isLocked
                                                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70 dark:border-white/10 dark:bg-white/[0.03]'
                                                            : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-white/20'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white" style={{ backgroundColor: isCompleted ? '#10b981' : isLocked ? '#64748b' : config.primaryColor }}>
                                                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : isLocked ? <LockKeyhole className="h-4 w-4" /> : action.week}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-black/20 dark:text-slate-300">
                                                                {statusLabel}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{getSkillLabel(action)}</span>
                                                        </div>
                                                        <p className="text-sm font-black leading-snug text-slate-950 dark:text-white">{action.title}</p>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{action.description}</p>
                                                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                                                            <span className="rounded-md bg-white px-2 py-1 dark:bg-black/20">{getArtifactLabel(action)}</span>
                                                            <span className="rounded-md bg-white px-2 py-1 dark:bg-black/20">{getActionMaterialCount(action)} docs</span>
                                                            <span className="rounded-md bg-white px-2 py-1 dark:bg-black/20">{getActionPointTotal(action) || 10} pts</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>

                    {weeklyTaskGroups.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center dark:border-white/15 dark:bg-[#111318]">
                            <CheckCircle className="mb-4 h-12 w-12 text-emerald-500/40" />
                            <p className="text-sm font-black text-slate-950 dark:text-white">No tasks match this filter.</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Switch to All weeks to see the complete PM task board.</p>
                        </div>
                    )}

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-[#111318] dark:text-slate-400">
                        Track total PM workload: {allActions.length} modules, {totalPointCount || 100} scoring points, and {totalMaterialCount} workplace documents.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                {pmMode && (
                    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111318]">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: config.primaryColor }}>
                                        PM Internship Board
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                        Module {currentWeek}
                                    </span>
                                </div>
                                <h2 className="text-lg font-black text-slate-950 dark:text-white">{config.companyName} product workspace</h2>
                                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    Work like a PM intern: read the messy workplace materials, write the deliverable, then unlock the next module.
                                </p>
                            </div>
                            <div className="grid min-w-[220px] grid-cols-3 gap-2 text-center text-xs">
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{projectProgress}%</p>
                                    <p className="font-bold uppercase text-slate-400">Progress</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{weekMaterialTotal}</p>
                                    <p className="font-bold uppercase text-slate-400">Docs</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.06]">
                                    <p className="font-black text-slate-950 dark:text-white">{weekPointTotal || 10}</p>
                                    <p className="font-bold uppercase text-slate-400">Pts</p>
                                </div>
                            </div>
                        </div>
                        {nextPmAction && (
                            <button
                                type="button"
                                onClick={() => onOpenAction(nextPmAction)}
                                className="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
                            >
                                <span>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Next deliverable</span>
                                    <span className="block text-sm font-bold text-slate-950 dark:text-white">{getArtifactLabel(nextPmAction)}</span>
                                </span>
                                <ArrowRight className="h-4 w-4" style={{ color: config.primaryColor }} />
                            </button>
                        )}
                    </div>
                )}
                <div className={pmMode ? 'hidden' : 'mb-4'}>
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
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${filter === t.id ? 'text-white' : 'bg-surface text-text-tertiary hover:bg-surface-secondary'}`}
                            style={filter === t.id ? { backgroundColor: config.primaryColor } : undefined}
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
                {effectiveFilter === 'todo' && todoItems.length > 0 && (
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
                            {actionItems.map((action, index) => {
                                const overdue = overdueIds.has(action.id);
                                if (internMode) {
                                    return (
                                        <InternActionCard
                                            key={action.id}
                                            action={action}
                                            index={index}
                                            isCompleted={false}
                                            onOpenAction={onOpenAction}
                                        />
                                    );
                                }

                                if (pmMode) {
                                    return (
                                        <ProductActionCard
                                            key={action.id}
                                            action={action}
                                            index={index}
                                            overdue={overdue}
                                            onOpenAction={onOpenAction}
                                            primaryColor={config.primaryColor}
                                        />
                                    );
                                }

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
                            {internMode && lockedActionCount > 0 && (
                                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm font-bold text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                                    <LockKeyhole className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                    {lockedActionCount} more mission{lockedActionCount === 1 ? '' : 's'} will unlock after your next action.
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* DONE Section */}
                {effectiveFilter === 'done' && completedActions.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Completed
                        </h3>
                        <div className="space-y-2">
                            {completedActions.map((action, index) => (
                                pmMode ? (
                                    <ProductActionCard
                                        key={action.id}
                                        action={action}
                                        index={index}
                                        isCompleted
                                        onOpenAction={onOpenAction}
                                        primaryColor={config.primaryColor}
                                    />
                                ) : (
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
                                )
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
    const { pathname } = useLocation();

    const {
        gameState, isRunning, isPaused, isCompleted, score,
        availableActions, weeklyActions, backlogCount,
        startSimulation, pauseSimulation, resumeSimulation,
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
    const [viewingArtifact, setViewingArtifact] = useState<DocumentsPanelArtifact | null>(null);
    const pagePrimary = config.primaryColor;
    const internMode = isInternConfig(config);
    const pmMode = isProductManagementConfig(config);

    const { notifications, markNotificationRead, addNotification } = useNotifications();

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
    const completedActionIdList = useMemo(() => Array.from(completedIds), [completedIds]);

    const documentArtifacts = useMemo<DocumentsPanelArtifact[]>(
        () => (gameState?.artifacts ?? []).map((artifact) => ({
            ...artifact,
            type: artifact.type as DocumentsPanelArtifact['type'],
            createdAt: new Date(artifact.createdAt),
            status: artifact.status ?? 'generated',
        })),
        [gameState?.artifacts]
    );

    const handleExportArtifact = useCallback((artifact: DocumentsPanelArtifact) => {
        const review = artifact.metadata && typeof artifact.metadata === 'object'
            ? (artifact.metadata as { review?: { score: number; maxScore: number; stakeholderReaction: string } }).review
            : undefined;
        const markdown = [
            `# ${artifact.title}`,
            '',
            artifact.description,
            '',
            `- Week: ${artifact.week}`,
            `- Type: ${artifact.type}`,
            review ? `- PM review: ${review.score}/${review.maxScore} - ${review.stakeholderReaction}` : '',
            '',
            formatArtifactContent(artifact.content as Record<string, unknown> | undefined),
        ].filter(Boolean).join('\n');
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'turnve-artifact'}.md`;
        link.click();
        URL.revokeObjectURL(url);
        if (gameState) {
            updateCustomState('artifacts', gameState.artifacts.map((item) => item.id === artifact.id ? { ...item, status: 'exported' } : item));
        }
    }, [gameState, updateCustomState]);

    const handleExportCaseStudy = useCallback(() => {
        const projectCharters = documentArtifacts.filter((artifact) => artifact.type === 'project_charter');
        const finalArtifact = projectCharters.find((artifact) => artifact.week === config.totalWeeks) ?? projectCharters[projectCharters.length - 1];
        if (finalArtifact) {
            handleExportArtifact(finalArtifact);
            return;
        }

        const finalAction = (config.weeklyActions ?? [])
            .slice()
            .sort((a, b) => b.week - a.week)
            .find((action) => action.artifactType === 'project_charter');
        if (finalAction) {
            setOpenModal({ kind: 'weekly', item: finalAction });
        }
    }, [config.totalWeeks, config.weeklyActions, documentArtifacts, handleExportArtifact]);

    // Week change notification logic
    const lastWeekRef = useRef<number>(1);
    const [weekChangeInfo, setWeekChangeInfo] = useState<{ week: number; total: number } | null>(null);

    useEffect(() => {
        if (gameState && gameState.week > lastWeekRef.current) {
            const nextInfo = { week: gameState.week, total: gameState.totalWeeks };
            lastWeekRef.current = gameState.week;
            queueMicrotask(() => {
                setWeekChangeInfo(nextInfo);
                setTimeout(() => setWeekChangeInfo(null), 8000);
            });
        }
    }, [gameState]);

    const activeMeeting = gameState?.activeMeeting;
    const [showMeetingContent, setShowMeetingContent] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setShowMeetingContent(Boolean(activeMeeting)));
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
        { name: pmMode ? 'Project overview' : 'Overview', icon: Rocket, id: 'dashboard' },
        { name: 'Tasks', icon: LayoutList, id: 'backlog', badge: weeklyActions.filter(a => !completedIds.has(a.id)).length > 0 
            ? weeklyActions.filter(a => !completedIds.has(a.id)).length 
            : undefined },
        { name: 'Company', icon: Building2, id: 'company' },
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
                                                ...(gameState?.backlogActionItems || [])
                                            ];
                                            const action = allActions.find(a => a.id === activeMeeting.actionId);
                                            if (action) setOpenModal({ kind: 'weekly', item: action });
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

            <div className={`flex h-screen w-full overflow-hidden ${internMode ? 'bg-[#fff7ed] text-slate-900 dark:bg-[#08090a] dark:text-white' : 'bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white'}`}>

                {/* ── Sidebar ───────────────────────────────── */}
                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}
                <aside className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${internMode ? 'border-orange-100 bg-white/90 text-slate-900 shadow-xl shadow-orange-100/40 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:shadow-black/30' : 'border-gray-200 bg-white dark:border-white/5 dark:bg-[#0a0a0a]'}`}>
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[16px] shadow-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: config.primaryColor }}>
                            <Building2 className="w-4 h-4" />
                        </div>
                        <span className={`font-semibold text-sm truncate ${internMode ? 'text-slate-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{config.companyName}</span>
                    </div>

                    <div className="px-3 lg:px-4 pb-3">
                        <button
                            type="button"
                            onClick={() => {
                                navigate('/simulations');
                                setMobileSidebarOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-bold transition ${
                                internMode
                                    ? 'border-orange-100 bg-orange-50 text-slate-700 hover:bg-orange-100 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10'
                                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/10'
                            }`}
                        >
                            <ArrowLeft className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 flex-1 truncate">All simulations</span>
                        </button>
                    </div>

                    <nav className="flex-1 px-3 lg:px-4 py-2 space-y-0.5">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all relative ${internMode
                                    ? activeTab === item.id
                                        ? 'bg-violet-50 text-slate-950 shadow-sm dark:bg-violet-400/15 dark:text-white'
                                        : 'text-slate-600 hover:bg-orange-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                                    : activeTab === item.id
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

                </aside>

                {/* ── Main ─────────────────────────────────── */}
                <main className={`flex-1 flex flex-col overflow-hidden min-w-0 ${internMode ? 'bg-[#fff7ed] dark:bg-[#08090a]' : 'bg-gray-50 dark:bg-[#121212]'}`}>
                    {/* Header */}
                    <header className={`h-14 lg:h-16 border-b flex items-center justify-between px-3 lg:px-6 backdrop-blur-md z-10 flex-shrink-0 ${internMode ? 'border-orange-100 bg-white/75 text-slate-900 dark:border-white/10 dark:bg-[#0f1011]/85 dark:text-white' : 'border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50'}`}>
                        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                            <button 
                                onClick={() => setMobileSidebarOpen(true)}
                                className={`lg:hidden p-2 rounded-lg transition ${internMode ? 'hover:bg-orange-50 dark:hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <Menu className={`h-5 w-5 ${internMode ? 'text-slate-600 dark:text-slate-300' : 'text-gray-500 dark:text-gray-400'}`} />
                            </button>
                            <TypingText text={config.companyName} speed={35} className={`text-sm lg:text-base font-semibold ${internMode ? 'text-slate-950 dark:text-white' : 'dark:text-white'}`} />
                            {isPaused && (
                                <span className="hidden sm:inline-flex bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                                    <Pause className="w-3 h-3" /> PAUSED
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Notifications */}
                            <button onClick={() => setShowNotifications(true)} className={`relative p-2 rounded-lg transition-colors ${internMode ? 'hover:bg-orange-50 dark:hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <Bell className={`w-5 h-5 ${internMode ? 'text-slate-600 dark:text-slate-300' : 'text-gray-500'}`} />
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

                    {activeTab === 'dashboard' && !pmMode && !internMode && (
                        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#121212] sm:p-6">
                            <DetailedProjectBrief config={config} pagePrimary={pagePrimary} />
                        </div>
                    )}

                    {feedback && (
                        <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-6 py-3 text-sm flex-shrink-0">
                            {feedback}
                        </div>
                    )}

                    {/* ── Panel Content ─────────────────────── */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {activeTab === 'documents' ? (
                            <DocumentsPanel
                                artifacts={documentArtifacts}
                                onGenerateArtifact={(type) => console.log('generate', type)}
                                onViewArtifact={(artifact) => setViewingArtifact(artifact)}
                                onExportArtifact={(artifact) => handleExportArtifact(artifact)}
                                onDeleteArtifact={(a) => updateCustomState('artifacts', gameState.artifacts.filter((artifact) => artifact.id !== a.id))}
                                currentWeek={gameState.week}
                                simulationMode={pmMode ? 'product_management' : 'default'}
                                weeklyActions={config.weeklyActions ?? []}
                                completedActionIds={completedActionIdList}
                                primaryColor={pagePrimary}
                                onOpenAction={(item) => setOpenModal({ kind: 'weekly', item })}
                                onExportCaseStudy={handleExportCaseStudy}
                            />
                        ) : activeTab === 'company' ? (
                            <CompanyPanel
                                currentWeek={gameState.week}
                                config={config}
                                stakeholderStates={gameState.stakeholders}
                            />
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
                                        ...(gameState.backlogActionItems || [])
                                    ];
                                    const action = allActions.find(a => a.id === id);
                                    if (action) {
                                        setOpenModal({ kind: 'weekly', item: action });
                                    } else {
                                        const weekAction = (config.weeklyActions || []).find(a => a.week === gameState.week);
                                        if (weekAction) setOpenModal({ kind: 'weekly', item: weekAction });
                                    }
                                }}
                            />
                        ) : activeTab === 'calendar' ? (
                            <CalendarPanel
                                slots={(config.weeklyEvents ?? [])
                                    .filter((event) => event.week === gameState.week)
                                    .map((event, index) => ({
                                        id: event.id,
                                        title: event.title,
                                        with: event.from,
                                        time: `${10 + index}:00 AM`,
                                        duration: event.type === 'meeting' ? '30 min' : '15 min',
                                        available: !event.requiresAction,
                                        description: event.description,
                                    }))}
                                weeklyActions={config.weeklyActions ?? []}
                                weeklyEvents={config.weeklyEvents ?? []}
                                currentWeek={gameState.week}
                                totalWeeks={gameState.totalWeeks}
                                timeLeft={gameState.timeLeft}
                                completedActionIds={completedActionIdList}
                                onNotify={(notification) => addNotification(notification)}
                                onOpenAction={(item) => setOpenModal({ kind: 'weekly', item })}
                                primaryColor={config.primaryColor}
                            />
                        ) : pmMode ? (
                            <ProductManagementDashboardPanel
                                gameState={gameState}
                                config={config}
                                completedIds={completedIds}
                                availableActions={availableActions}
                                advanceTime={advanceTime}
                                onOpenAction={(item) => setOpenModal({ kind: 'weekly', item })}
                                onOpenLegacy={(item) => setOpenModal({ kind: 'legacy', item })}
                                setActiveTab={setActiveTab}
                                pagePrimary={pagePrimary}
                            />
                        ) : internMode ? (
                            <InternDashboardPanel
                                gameState={gameState}
                                config={config}
                                completedIds={completedIds}
                                availableActions={availableActions}
                                advanceTime={advanceTime}
                                onOpenAction={(item) => setOpenModal({ kind: 'weekly', item })}
                                onOpenLegacy={(item) => setOpenModal({ kind: 'legacy', item })}
                                setActiveTab={setActiveTab}
                                pagePrimary={pagePrimary}
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

            {viewingArtifact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111318]">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: pagePrimary }}>
                                    Portfolio artifact
                                </div>
                                <h2 className="text-xl font-black text-slate-950 dark:text-white">{viewingArtifact.title}</h2>
                                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{viewingArtifact.description}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close artifact viewer"
                                onClick={() => setViewingArtifact(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            {(() => {
                                const metadata = viewingArtifact.metadata as { review?: { score: number; maxScore: number; stakeholderReaction: string; strengths?: string[]; gaps?: string[] } } | undefined;
                                const review = metadata?.review;
                                return review ? (
                                    <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-50 p-4 dark:bg-emerald-500/5">
                                        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">PM review</p>
                                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-200">{review.score}/{review.maxScore} pts</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{review.stakeholderReaction}</p>
                                    </div>
                                ) : null;
                            })()}
                            <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-300">
                                {formatArtifactContent(viewingArtifact.content as Record<string, unknown> | undefined)}
                            </pre>
                        </div>
                        <div className="flex gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => setViewingArtifact(null)}
                                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExportArtifact(viewingArtifact)}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black text-white transition"
                                style={{ backgroundColor: pagePrimary }}
                            >
                                <Download className="h-4 w-4" />
                                Export Markdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {openModal && (
                <ActionModal
                    action={openModal}
                    gameState={gameState}
                    onComplete={handleCompleteWeeklyAction}
                    onLegacyDecision={handleLegacyDecision}
                    onClose={() => setOpenModal(null)}
                    primaryColor={pagePrimary}
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
