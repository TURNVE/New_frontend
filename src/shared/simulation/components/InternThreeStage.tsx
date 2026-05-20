import { lazy, Suspense, useMemo, useState } from 'react';
import { Box, Map as MapIcon } from 'lucide-react';
import { getVisibleActionIds, STAGE_NODES, type InternThreeStageProps } from './internStageModel';

const InternThreeCanvas = lazy(() => import('./InternThreeCanvas'));

function InternOfficeMap({
    actions,
    completedIds,
    onOpenAction,
}: InternThreeStageProps) {
    const actionMap = useMemo(() => new Map(actions.map((action) => [action.id, action])), [actions]);
    const visibleActionIds = useMemo(() => getVisibleActionIds(actions, completedIds), [actions, completedIds]);

    return (
        <div className="relative h-full min-h-[300px] overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-100 via-white to-orange-100 p-4 dark:from-[#090b10] dark:via-[#111318] dark:to-[#191126] sm:p-5">
            <div className="absolute inset-0 opacity-70">
                <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-cyan-300/40 blur-2xl dark:bg-cyan-500/20" />
                <div className="absolute right-4 top-16 h-28 w-28 rounded-full bg-violet-300/45 blur-2xl dark:bg-violet-500/20" />
                <div className="absolute bottom-6 left-1/3 h-24 w-32 rounded-full bg-amber-300/45 blur-2xl dark:bg-amber-400/20" />
            </div>
            <div className="relative grid h-full min-h-[270px] grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {STAGE_NODES.map((node, index) => {
                    const action = actionMap.get(node.actionId);
                    if (!action) return null;
                    const isCompleted = completedIds.has(node.actionId);
                    const isUnlocked = visibleActionIds.has(node.actionId);
                    const status = isCompleted ? 'Done' : isUnlocked ? 'Open' : 'Locked';

                    return (
                        <button
                            key={node.actionId}
                            type="button"
                            disabled={!isUnlocked}
                            onClick={() => action && isUnlocked && onOpenAction(action)}
                            className={`group relative min-h-[110px] overflow-hidden rounded-2xl border p-3 text-left shadow-sm transition-all duration-300 sm:min-h-[124px] ${
                                isCompleted
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100'
                                    : isUnlocked
                                        ? 'border-white/80 bg-white/90 text-slate-950 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.08] dark:text-white'
                                        : 'border-white/45 bg-white/45 text-slate-500 opacity-70 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400'
                            }`}
                            style={{ animation: `intern-card-pop 360ms ease-out ${index * 55}ms both` }}
                        >
                            <span
                                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 transition-opacity group-hover:opacity-40"
                                style={{ backgroundColor: isCompleted ? '#22c55e' : isUnlocked ? node.color : '#94a3b8' }}
                            />
                            <span
                                className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg"
                                style={{ backgroundColor: isCompleted ? '#22c55e' : isUnlocked ? node.color : '#94a3b8' }}
                            >
                                {index + 1}
                            </span>
                            <span className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : isUnlocked
                                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                                        : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                            }`}>
                                {status}
                            </span>
                            <h3 className="text-sm font-black leading-tight">{node.label}</h3>
                            <p className="mt-1 text-xs font-semibold opacity-75">{isUnlocked ? node.detail : 'Unlocks after the active mission'}</p>
                        </button>
                    );
                })}
            </div>
            <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-slate-950/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl dark:bg-white/90 dark:text-slate-950">
                Responsive office map
            </div>
        </div>
    );
}

function ThreeLoadingState() {
    return (
        <div className="flex h-full min-h-[300px] items-center justify-center rounded-[28px] bg-white/75 text-center text-sm font-black uppercase tracking-widest text-slate-500 shadow-inner dark:bg-white/[0.06] dark:text-slate-300">
            Loading 3D office
        </div>
    );
}

export default function InternThreeStage({ actions, completedIds, onOpenAction }: InternThreeStageProps) {
    const [showThreeD, setShowThreeD] = useState(false);

    return (
        <div className="relative h-[min(68vh,430px)] min-h-[340px] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-100 via-white to-orange-100 dark:from-[#090b10] dark:via-[#111318] dark:to-[#191126] sm:h-[390px] lg:h-[430px]">
            {showThreeD ? (
                <Suspense fallback={<ThreeLoadingState />}>
                    <InternThreeCanvas actions={actions} completedIds={completedIds} onOpenAction={onOpenAction} />
                </Suspense>
            ) : (
                <InternOfficeMap actions={actions} completedIds={completedIds} onOpenAction={onOpenAction} />
            )}
            <div className="absolute right-4 top-4 flex rounded-2xl bg-white/90 p-1 shadow-xl ring-1 ring-white/70 backdrop-blur dark:bg-[#111318]/90 dark:ring-white/10">
                <button
                    type="button"
                    onClick={() => setShowThreeD(false)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-black uppercase tracking-widest transition ${
                        !showThreeD
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                    }`}
                    aria-pressed={!showThreeD}
                >
                    <MapIcon className="mr-1.5 h-4 w-4" />
                    Map
                </button>
                <button
                    type="button"
                    onClick={() => setShowThreeD(true)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-black uppercase tracking-widest transition ${
                        showThreeD
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                    }`}
                    aria-pressed={showThreeD}
                >
                    <Box className="mr-1.5 h-4 w-4" />
                    3D
                </button>
            </div>
        </div>
    );
}
