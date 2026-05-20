import type { WeeklyActionItem } from '../types';

export type StageNodeKind =
    | 'letter'
    | 'pm'
    | 'calendar'
    | 'invite'
    | 'team'
    | 'meeting'
    | 'task'
    | 'promotion';

export interface StageNodeConfig {
    actionId: string;
    label: string;
    detail: string;
    kind: StageNodeKind;
    position: [number, number, number];
    color: string;
    darkColor: string;
    accent: string;
}

export interface InternThreeStageProps {
    actions: WeeklyActionItem[];
    completedIds: Set<string>;
    onOpenAction: (action: WeeklyActionItem) => void;
}

export const STAGE_NODES: StageNodeConfig[] = [
    {
        actionId: 'intern-action-offer-letter',
        label: 'Offer letter',
        detail: 'Open the envelope',
        kind: 'letter',
        position: [-3.15, 0.32, -1.15],
        color: '#fb7185',
        darkColor: '#fda4af',
        accent: '#fed7aa',
    },
    {
        actionId: 'intern-action-meet-pm',
        label: 'Sarah',
        detail: 'Meet your PM',
        kind: 'pm',
        position: [-1.55, 0.32, 0.25],
        color: '#8b5cf6',
        darkColor: '#c4b5fd',
        accent: '#f0abfc',
    },
    {
        actionId: 'intern-action-check-calendar',
        label: 'Calendar',
        detail: 'Check availability',
        kind: 'calendar',
        position: [0.2, 0.32, -1.2],
        color: '#06b6d4',
        darkColor: '#67e8f9',
        accent: '#bae6fd',
    },
    {
        actionId: 'intern-action-accept-ceo-meeting',
        label: 'CEO invite',
        detail: 'RSVP to Marcus',
        kind: 'invite',
        position: [1.72, 0.32, -0.42],
        color: '#10b981',
        darkColor: '#6ee7b7',
        accent: '#bbf7d0',
    },
    {
        actionId: 'intern-action-team-intro',
        label: 'Team',
        detail: 'Meet HR + peers',
        kind: 'team',
        position: [3.08, 0.32, 0.82],
        color: '#f97316',
        darkColor: '#fdba74',
        accent: '#fde68a',
    },
    {
        actionId: 'intern-action-join-ceo-meeting',
        label: 'Live room',
        detail: 'Join the CEO call',
        kind: 'meeting',
        position: [1.28, 0.32, 1.62],
        color: '#6366f1',
        darkColor: '#a5b4fc',
        accent: '#c7d2fe',
    },
    {
        actionId: 'intern-action-first-task',
        label: 'Microtask',
        detail: 'Product judgment',
        kind: 'task',
        position: [-0.55, 0.32, 1.75],
        color: '#84cc16',
        darkColor: '#bef264',
        accent: '#d9f99d',
    },
    {
        actionId: 'intern-action-promotion',
        label: 'Promotion',
        detail: 'Level up',
        kind: 'promotion',
        position: [-2.55, 0.32, 1.15],
        color: '#facc15',
        darkColor: '#fde047',
        accent: '#f9a8d4',
    },
];

export function getVisibleActionIds(actions: WeeklyActionItem[], completedIds: Set<string>) {
    const firstPendingIndex = actions.findIndex((action) => !completedIds.has(action.id));
    if (firstPendingIndex === -1) return new Set(actions.map((action) => action.id));
    return new Set(
        actions
            .filter((action, index) => completedIds.has(action.id) || index <= firstPendingIndex + 1)
            .map((action) => action.id)
    );
}
