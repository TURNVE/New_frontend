/**
 * CalendarPanel - live simulation calendar.
 *
 * Shows meetings, deadlines, weekly task status, and runtime alerts from the
 * active simulation state.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertTriangle,
    Bell,
    BellRing,
    Calendar,
    Check,
    CheckCircle,
    ChevronRight,
    Clock,
    ListChecks,
    Timer,
    Users,
    Video,
    X,
} from 'lucide-react';
import type { CalendarSlot } from '../../features/sim-intern-onboarding/intern-content';
import type { WeeklyActionItem, WeeklyEvent } from '../../shared/simulation/types';
import type { NotificationType } from '../../communications/types';

interface CalendarNotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
}

interface CalendarPanelProps {
    slots: CalendarSlot[];
    weeklyActions?: WeeklyActionItem[];
    weeklyEvents?: WeeklyEvent[];
    currentWeek?: number;
    totalWeeks?: number;
    timeLeft?: number;
    completedActionIds?: string[];
    onNotify?: (notification: CalendarNotificationPayload) => void;
    onOpenAction?: (item: WeeklyActionItem) => void;
    onAcceptMeeting?: (slotId: string) => void;
    onDeclineMeeting?: (slotId: string) => void;
    onSelectSlot?: (slot: CalendarSlot) => void;
    selectedSlot?: string;
    primaryColor?: string;
}

type ActionStatus = 'completed' | 'due_now' | 'overdue' | 'upcoming';

function formatTimeLeft(seconds: number) {
    const minutes = Math.max(0, Math.floor(seconds / 60));
    const remainingSeconds = Math.max(0, seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getWeekLabel(week: number, currentWeek: number) {
    if (week === currentWeek) return 'Now';
    if (week < currentWeek) return 'Past';
    return 'Upcoming';
}

function getActionWindowLabel(week: number, currentWeek: number) {
    if (week === currentWeek) return 'Due this week';
    if (week < currentWeek) return 'Past deadline';
    return `Starts in week ${week}`;
}

function getEventTime(event: WeeklyEvent, index: number) {
    if (event.timeInWeek !== undefined) {
        const hour = 9 + Math.floor(event.timeInWeek / 3600);
        const minute = Math.floor((event.timeInWeek % 3600) / 60);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    return `${(10 + index).toString().padStart(2, '0')}:00`;
}

function getStatusClass(status: ActionStatus) {
    if (status === 'completed') return 'bg-emerald-500/15 text-emerald-500';
    if (status === 'overdue') return 'bg-red-500/15 text-red-400';
    if (status === 'due_now') return 'bg-amber-500/15 text-amber-400';
    return 'bg-gray-500/15 text-gray-400';
}

function getStatusLabel(status: ActionStatus) {
    if (status === 'completed') return 'Completed';
    if (status === 'overdue') return 'Overdue';
    if (status === 'due_now') return 'Due now';
    return 'Upcoming';
}

export function CalendarPanel({
    slots,
    weeklyActions = [],
    weeklyEvents = [],
    currentWeek = 1,
    totalWeeks = 1,
    timeLeft = 0,
    completedActionIds = [],
    onNotify,
    onOpenAction,
    onAcceptMeeting,
    onDeclineMeeting,
    onSelectSlot,
    selectedSlot,
    primaryColor = '#8b5cf6',
}: CalendarPanelProps) {
    const [showHint, setShowHint] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);
    const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
    const notifiedAlertsRef = useRef<Set<string>>(new Set());
    const completedActionSet = useMemo(() => new Set(completedActionIds), [completedActionIds]);

    useEffect(() => {
        setSelectedWeek(currentWeek);
    }, [currentWeek]);

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }, []);

    const acceptedSlots = slots.filter(s => !s.available);
    const availableSlots = slots.filter(s => s.available);
    const weeks = Array.from({ length: totalWeeks }, (_, index) => index + 1);

    const getActionStatus = useCallback((action: WeeklyActionItem): ActionStatus => {
        if (completedActionSet.has(action.id)) return 'completed';
        if ((action.dueWeek ?? action.week) < currentWeek) return 'overdue';
        if (action.week <= currentWeek && (action.dueWeek ?? action.week) >= currentWeek) return 'due_now';
        return 'upcoming';
    }, [completedActionSet, currentWeek]);

    const timelineItems = useMemo(() => {
        const actionItems = weeklyActions.map((action) => ({
            id: `action-${action.id}`,
            week: action.week,
            type: 'task' as const,
            title: action.title,
            description: action.description,
            meta: getActionWindowLabel(action.week, currentWeek),
            status: getActionStatus(action),
            action,
        }));

        const eventItems = weeklyEvents.map((event, index) => ({
            id: `event-${event.id}`,
            week: event.week,
            type: 'event' as const,
            title: event.title,
            description: event.description,
            meta: `${getEventTime(event, index)} - ${event.from}`,
            event,
        }));

        return [...actionItems, ...eventItems].sort((a, b) => {
            if (a.week !== b.week) return a.week - b.week;
            return a.type.localeCompare(b.type);
        });
    }, [currentWeek, weeklyActions, weeklyEvents, getActionStatus]);

    const selectedWeekItems = timelineItems.filter((item) => item.week === selectedWeek);

    const deadlineAlerts = useMemo(() => {
        const overdue = weeklyActions.filter((action) => getActionStatus(action) === 'overdue');
        const dueThisWeek = weeklyActions.filter((action) => getActionStatus(action) === 'due_now');
        const currentEvents = weeklyEvents.filter((event) => event.week === currentWeek);

        return [
            ...overdue.map((action) => ({
                id: `overdue-${action.id}`,
                type: 'error' as const,
                title: 'Calendar deadline approaching',
                message: `${action.title} is overdue. Open it from the calendar or task board.`,
            })),
            ...dueThisWeek.map((action) => ({
                id: `due-${action.id}`,
                type: 'warning' as const,
                title: 'Calendar deadline approaching',
                message: `${action.title} is due in week ${currentWeek}. ${formatTimeLeft(timeLeft)} remains in this week.`,
            })),
            ...currentEvents.map((event) => ({
                id: `meeting-${event.id}`,
                type: event.priority === 'urgent' || event.priority === 'high' ? 'warning' as const : 'info' as const,
                title: 'Calendar meeting reminder',
                message: `${event.title} with ${event.from}: ${event.description}`,
            })),
        ].slice(0, 5);
    }, [currentWeek, timeLeft, weeklyActions, weeklyEvents, getActionStatus]);

    const sendBrowserNotification = (title: string, message: string) => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        new Notification(title, { body: message });
    };

    const enableBrowserNotifications = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            onNotify?.({
                type: 'warning',
                title: 'Browser notifications unavailable',
                message: 'This browser does not support notification permissions.',
            });
            return;
        }

        const permission = await Notification.requestPermission();
        const isEnabled = permission === 'granted';
        setBrowserNotificationsEnabled(isEnabled);
        onNotify?.({
            type: isEnabled ? 'success' : 'warning',
            title: isEnabled ? 'Calendar notifications enabled' : 'Calendar notifications not enabled',
            message: isEnabled
                ? 'TURNVE can now send deadline and meeting reminders from this simulation.'
                : 'You can still see reminders inside the app notification center.',
        });
    };

    useEffect(() => {
        for (const alert of deadlineAlerts) {
            if (notifiedAlertsRef.current.has(alert.id)) continue;
            notifiedAlertsRef.current.add(alert.id);
            onNotify?.({
                type: alert.type,
                title: alert.title,
                message: alert.message,
            });
            sendBrowserNotification(alert.title, alert.message);
        }
    }, [deadlineAlerts, onNotify]);

    const pendingCount = weeklyActions.filter((action) => getActionStatus(action) === 'due_now').length;
    const overdueCount = weeklyActions.filter((action) => getActionStatus(action) === 'overdue').length;
    const completedCount = weeklyActions.filter((action) => getActionStatus(action) === 'completed').length;

    return (
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="p-4 sm:p-6 border-b border-border bg-white dark:bg-[#121212]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${primaryColor}20` }}
                            >
                                <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Live Calendar
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Real-time deadlines, meetings, weekly timeline, and simulation reminders
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {pendingCount} Due now
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {overdueCount} Overdue
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {completedCount} Completed
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Week {currentWeek}/{totalWeeks}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                        <div className="rounded-xl border border-border bg-gray-50 px-4 py-3 dark:bg-white/5">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                <Timer className="h-3.5 w-3.5" />
                                Week timer
                            </div>
                            <div className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                                {formatTimeLeft(timeLeft)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={enableBrowserNotifications}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            {browserNotificationsEnabled ? <BellRing className="h-4 w-4 text-emerald-400" /> : <Bell className="h-4 w-4" />}
                            {browserNotificationsEnabled ? 'Notifications on' : 'Enable reminders'}
                        </button>
                    </div>
                </div>
            </div>

            {showHint && (
                <div className="mx-4 mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                                Calendar is connected to this simulation
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Deadlines update from completed tasks and current week time. Meeting reminders also appear in your notification center.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowHint(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
                {deadlineAlerts.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            Live alerts
                        </h3>
                        <div className="grid gap-3 lg:grid-cols-2">
                            {deadlineAlerts.map((alert) => (
                                <div key={alert.id} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.title}</p>
                                    <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {weeklyActions.length > 0 && (
                    <section>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                                <ListChecks className="w-3 h-3" />
                                Weekly timeline
                            </h3>
                            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                                {weeks.map((week) => (
                                    <button
                                        key={week}
                                        type="button"
                                        onClick={() => setSelectedWeek(week)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                                            selectedWeek === week
                                                ? 'text-white'
                                                : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                                        }`}
                                        style={selectedWeek === week ? { backgroundColor: primaryColor } : undefined}
                                    >
                                        Week {week}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-3">
                            {weeks.map((week) => {
                                const actions = weeklyActions.filter((action) => action.week === week);
                                const events = weeklyEvents.filter((event) => event.week === week);
                                const isActive = week === currentWeek;
                                const completedInWeek = actions.filter((action) => completedActionSet.has(action.id)).length;

                                return (
                                    <div
                                        key={week}
                                        className={`rounded-2xl border p-4 ${
                                            isActive
                                                ? 'border-purple-500 bg-purple-500/10 shadow-md'
                                                : 'border-border bg-white dark:bg-[#1a1a1a]'
                                        }`}
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Week {week}</p>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {completedInWeek}/{actions.length || 0} work items
                                                </h4>
                                            </div>
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                                isActive ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300'
                                            }`}>
                                                {getWeekLabel(week, currentWeek)}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {actions.map((action) => {
                                                const status = getActionStatus(action);
                                                return (
                                                    <button
                                                        key={action.id}
                                                        type="button"
                                                        onClick={() => onOpenAction?.(action)}
                                                        className="w-full rounded-xl border border-border bg-background p-3 text-left transition hover:border-purple-400 hover:bg-purple-500/5"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
                                                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                                        </div>
                                                        <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusClass(status)}`}>
                                                                {getStatusLabel(status)}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                                {getActionWindowLabel(action.week, currentWeek)}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {events.length > 0 && (
                                                <div className="rounded-xl bg-gray-100 p-3 dark:bg-white/5">
                                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Calendar events</p>
                                                    <div className="space-y-1.5">
                                                        {events.map((event, index) => (
                                                            <div key={event.id} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                                <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                                                                <span>{getEventTime(event, index)} - {event.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Week {selectedWeek} agenda
                    </h3>
                    <div className="space-y-3">
                        {selectedWeekItems.length > 0 ? selectedWeekItems.map((item) => (
                            <div key={item.id} className="rounded-xl border border-border bg-white p-4 dark:bg-[#1a1a1a]">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:bg-white/10 dark:text-gray-300">
                                                {item.type === 'task' ? 'Task deadline' : 'Meeting'}
                                            </span>
                                            {'status' in item && (
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusClass(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{item.description}</p>
                                        <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-300">{item.meta}</p>
                                    </div>
                                    {'action' in item && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenAction?.(item.action)}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            Open work
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="rounded-xl border border-dashed border-border bg-white p-6 text-center dark:bg-[#1a1a1a]">
                                <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm font-medium text-foreground">No scheduled agenda items</p>
                                <p className="mt-1 text-xs text-text-tertiary">This week has no configured tasks or meetings.</p>
                            </div>
                        )}
                    </div>
                </section>

                {availableSlots.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Available meetings
                        </h3>
                        <div className="space-y-3">
                            {availableSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`bg-white dark:bg-[#1a1a1a] rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                                        selectedSlot === slot.id
                                            ? 'border-purple-500 shadow-md'
                                            : 'border-border hover:border-purple-300'
                                    }`}
                                    onClick={() => onSelectSlot?.(slot)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                {slot.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {slot.with}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full">
                                            Open
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {slot.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {slot.duration}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        {slot.description}
                                    </p>

                                    {selectedSlot === slot.id && (
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAcceptMeeting?.(slot.id);
                                                }}
                                                className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Check className="w-3 h-3" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeclineMeeting?.(slot.id);
                                                }}
                                                className="py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {acceptedSlots.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            Confirmed meetings
                        </h3>
                        <div className="space-y-3">
                            {acceptedSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-border p-4 opacity-85"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                {slot.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {slot.with}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-bold rounded-full">
                                            Confirmed
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {slot.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Video className="w-3 h-3" />
                                            Virtual
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default CalendarPanel;
