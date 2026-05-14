import { useState } from 'react';
import {
    X, CheckCircle, Circle, AlertTriangle, FileText, ClipboardList, ThumbsUp, RotateCcw,
    Mail, MonitorPlay, Sparkles, PartyPopper, UserRound, Briefcase, CalendarDays,
} from 'lucide-react';
import type { WeeklyActionItem, ScenarioAction, ActionChoice } from '../types';
import { TypingText } from '../../../components/ui/TypingText';
import { HintSystem } from '../../../components/simulation/HintSystem';

interface HintConfig {
    whatThisIs: string;
    whatThatIs?: string;
    hint: string;
    tips?: string[];
}

interface ActionModalProps {
    action: ModalAction;
    gameState?: any;
    onComplete: (actionId: string, result: Record<string, unknown>) => void;
    onLegacyDecision?: (choice: ActionChoice) => void;
    onClose: () => void;
    hint?: HintConfig;
    primaryColor?: string;
}

// ─── Unified action shape the modal can handle ────────────────
export type ModalAction =
    | { kind: 'weekly'; item: WeeklyActionItem }
    | { kind: 'legacy'; item: ScenarioAction };

const CATEGORY_ICON: Record<string, React.ReactNode> = {
    decision: <AlertTriangle className="w-5 h-5 text-primary" />,
    document: <FileText className="w-5 h-5 text-blue-400" />,
    task: <ClipboardList className="w-5 h-5 text-purple-400" />,
    approval: <ThumbsUp className="w-5 h-5 text-emerald-400" />,
    review: <FileText className="w-5 h-5 text-teal-400" />,
    notification: <CheckCircle className="w-5 h-5 text-gray-400" />,
};

function InternOfferLetter() {
    return (
        <div className="relative overflow-hidden rounded-[22px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-4 shadow-xl dark:border-amber-300/20 dark:from-amber-300/10 dark:via-white/[0.06] dark:to-sky-400/10">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-300/30 blur-2xl dark:bg-pink-500/10" />
            <div className="relative rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm animate-in zoom-in-95 duration-300 dark:border-white/10 dark:bg-[#111318]">
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-4 dark:border-white/10">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                            <Mail className="h-3.5 w-3.5" />
                            Offer Letter
                        </div>
                        <h4 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">TechCorp Product Intern</h4>
                    </div>
                    <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                        Day 1<br />
                        Signed
                    </div>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-slate-950 dark:text-white">Dear Product Manager Intern,</p>
                    <p>
                        We are excited to welcome you to TechCorp. You will join Sarah Chen's Product team and learn how real product decisions move from customer signal to shipped work.
                    </p>
                    <div className="grid gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-white/5 sm:grid-cols-2">
                        <div><span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Role</span><p className="font-bold text-slate-900 dark:text-white">PM Intern</p></div>
                        <div><span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Manager</span><p className="font-bold text-slate-900 dark:text-white">Sarah Chen</p></div>
                        <div><span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Start</span><p className="font-bold text-slate-900 dark:text-white">Today</p></div>
                        <div><span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Mission</span><p className="font-bold text-slate-900 dark:text-white">Learn by doing</p></div>
                    </div>
                    <p>
                        Your first task is to read this letter, confirm your onboarding, then join the product team room for your first live brief.
                    </p>
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-dashed border-slate-200 pt-4 dark:border-white/10">
                    <div>
                        <p className="font-serif text-2xl text-slate-950 dark:text-white">Lisa Martinez</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">People Operations</p>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">Ready to onboard</div>
                </div>
            </div>
        </div>
    );
}

function InternMeetingRoom({ title }: { title: string }) {
    const people = [
        { name: 'Sarah', role: 'PM Mentor', color: 'from-violet-500 to-fuchsia-500' },
        { name: 'Marcus', role: 'CEO', color: 'from-sky-500 to-cyan-400' },
        { name: 'You', role: 'PM Intern', color: 'from-emerald-500 to-lime-400' },
    ];

    return (
        <div className="overflow-hidden rounded-[22px] border border-sky-200 bg-slate-950 p-4 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-200">
                    <MonitorPlay className="h-4 w-4 animate-pulse" />
                    TechCorp Live Room
                </div>
                <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-black">REC</div>
            </div>
            <h4 className="mb-4 text-xl font-black">{title}</h4>
            <div className="grid gap-3 sm:grid-cols-3">
                {people.map((person, index) => (
                    <div key={person.name} className="rounded-3xl bg-white/10 p-3 shadow-lg" style={{ animationDelay: `${index * 90}ms` }}>
                        <div className={`mb-3 flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br ${person.color} text-2xl font-black shadow-lg`}>
                            {person.name.slice(0, 1)}
                        </div>
                        <p className="font-black">{person.name}</p>
                        <p className="text-xs font-bold text-white/60">{person.role}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {['Introduce yourself', 'Listen for product goals', 'Confirm next action'].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-white/80">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

function InternCelebration() {
    return (
        <div className="rounded-[22px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-5 text-center shadow-xl dark:border-emerald-300/20 dark:from-emerald-400/10 dark:via-white/[0.06] dark:to-yellow-400/10">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 to-pink-400 text-white shadow-lg animate-floaty">
                <PartyPopper className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-black text-slate-950 dark:text-white">Level up unlocked</h4>
            <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-600 dark:text-slate-300">
                You completed your onboarding arc. Your next mission opens a real product ownership challenge.
            </p>
        </div>
    );
}

export default function ActionModal({ action, gameState, onComplete, onLegacyDecision, onClose, hint, primaryColor = '#7170ff' }: ActionModalProps) {
    const [textValue, setTextValue] = useState('');
    const [prdValues, setPrdValues] = useState<Record<string, string>>({});
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [approvalReason, setApprovalReason] = useState('');
    const [selectedApproval, setSelectedApproval] = useState('');
    const [showReasonFor, setShowReasonFor] = useState('');

    if (action.kind === 'legacy') {
        const item = action.item;
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[#1a1a1a] rounded-[16px] border border-gray-200 dark:border-gray-800 max-w-lg w-full p-8 shadow-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-4">{item.name}</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed whitespace-pre-line">{item.description}</p>
                    <div className="space-y-3 mb-6">
                        {item.choices.map((choice) => (
                            <button
                                key={choice.id}
                                onClick={() => { onLegacyDecision?.(choice); onClose(); }}
                                className="w-full text-left p-4 rounded-[12px] border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
                            >
                                <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500">{choice.label}</span>
                                <span className="block text-xs text-gray-500 mt-1">{choice.description}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                </div>
            </div>
        );
    }

    const item = action.item;
    const icon = CATEGORY_ICON[item.category] ?? CATEGORY_ICON.notification;
    const isInternAction = item.id.startsWith('intern-action-');
    const isOfferLetter = item.id === 'intern-action-offer-letter';
    const isMeetingAction = ['intern-action-meet-pm', 'intern-action-team-intro', 'intern-action-join-ceo-meeting'].includes(item.id);
    const isPromotion = item.id === 'intern-action-promotion';
    const submitLabel = isOfferLetter ? 'Accept Offer Letter'
        : isMeetingAction ? 'Complete Meeting'
            : isPromotion ? 'Celebrate & Continue'
                : item.actionType === 'decision_text' ? 'Submit Decision'
                    : item.actionType === 'submit_prd' ? 'Submit Document'
                        : item.actionType === 'task' ? 'Complete Task'
                            : item.actionType === 'approval' ? 'Submit Approval'
                                : 'Acknowledge';
    const modalTitleClass = isInternAction ? 'text-lg font-bold text-slate-950 dark:text-white' : 'text-lg font-bold text-gray-900 dark:text-white';
    const modalDescriptionClass = isInternAction
        ? 'text-[15px] text-slate-700 leading-relaxed font-semibold antialiased dark:text-slate-300'
        : 'text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium antialiased';

    const canSubmit = (): boolean => {
        if (item.actionType === 'decision_text') return textValue.trim().length > 20;
        if (item.actionType === 'submit_prd') {
            const required = (item.prdFields ?? []).filter(f => f.required);
            return required.every(f => (prdValues[f.id] ?? '').trim().length > 0);
        }
        if (item.actionType === 'task') {
            const required = (item.taskChecklist ?? []).filter(t => t.required);
            return required.every(t => checkedItems.has(t.id));
        }
        if (item.actionType === 'approval') return selectedApproval !== '';
        if (item.actionType === 'choice') return false; // handled by choice click
        return true;
    };

    const handleRecallPrevious = () => {
        if (!gameState?.completedActions) return;
        const previous = (gameState.completedActions as any[]).find(c => c.actionId === item.id);
        if (previous?.result) {
            const res = previous.result;
            if (item.actionType === 'decision_text' && res.memo) setTextValue(res.memo);
            if (item.actionType === 'submit_prd' && res.prd) setPrdValues(res.prd);
            if (item.actionType === 'task' && res.checklist) setCheckedItems(new Set(res.checklist as string[]));
            if (item.actionType === 'approval' && res.approval) {
                setSelectedApproval(res.approval);
                setApprovalReason(res.reason || '');
            }
        }
    };

    const hasPrevious = gameState?.completedActions?.some((c: any) => c.actionId === item.id);

    const handleSubmit = () => {
        const result: Record<string, unknown> = { summary: `Completed: ${item.title}` };
        if (item.actionType === 'decision_text') result.memo = textValue;
        if (item.actionType === 'submit_prd') result.prd = prdValues;
        if (item.actionType === 'task') result.checklist = Array.from(checkedItems);
        if (item.actionType === 'approval') { result.approval = selectedApproval; result.reason = approvalReason; }
        onComplete(item.id, result);
        onClose();
    };

    const priorityBadge: Record<string, string> = {
        urgent: 'bg-red-500/20 text-red-400 border border-red-500/30',
        high: 'bg-primary/20 text-primary border border-primary/30',
        normal: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isInternAction ? 'bg-slate-950/70 backdrop-blur-xl' : 'bg-black/60 backdrop-blur-sm'}`}>
            <div className={`${isInternAction ? 'bg-gradient-to-br from-white via-orange-50 to-sky-50 border-white/80 max-w-3xl rounded-[28px] dark:from-[#111318] dark:via-[#0f1011] dark:to-[#101827] dark:border-white/10' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 max-w-xl rounded-[16px]'} border w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden`}>
                {/* Header */}
                <div className={`p-6 border-b flex items-start justify-between flex-shrink-0 ${isInternAction ? 'border-white/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]' : 'border-gray-100 dark:border-gray-800'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 ${isInternAction ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            {isInternAction ? <Sparkles className="w-5 h-5 animate-pulse" /> : icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityBadge[item.priority]}`}>
                                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase">{isInternAction ? 'mission popup' : item.category}</span>
                                {item.dueWeek && <span className="text-[10px] text-gray-400">Due Week {item.dueWeek}</span>}
                            </div>
                            <TypingText text={item.title} speed={30} delay={400} className={modalTitleClass} key={`title-${item.id}`} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasPrevious && (
                            <button
                                onClick={handleRecallPrevious}
                                className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded border border-primary/20 transition-colors"
                                title="Recall previous submission for this task"
                            >
                                <RotateCcw className="w-3 h-3" /> Recall
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg flex-shrink-0">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Immersive Strategic Briefing */}
                    <div className="relative group">
                        <div className={`absolute -inset-0.5 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 ${isInternAction ? 'bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>
                        <div className="relative bg-white dark:bg-[#111318] border border-blue-500/10 dark:border-white/10 rounded-[16px] p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 px-2 bg-blue-500/10 rounded text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                    {isInternAction ? 'Action Beat' : 'Your Task'}
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                            </div>
                            <TypingText text={item.description} speed={20} delay={800} className={modalDescriptionClass} key={`desc-${item.id}`} />
                        </div>
                    </div>

                    {isOfferLetter && <InternOfferLetter />}
                    {isMeetingAction && <InternMeetingRoom title={item.title} />}
                    {isPromotion && <InternCelebration />}
                    {isInternAction && !isOfferLetter && !isMeetingAction && !isPromotion && (
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-violet-200 bg-white/80 p-4 shadow-sm dark:border-violet-300/20 dark:bg-white/5">
                                <UserRound className="mb-2 h-5 w-5 text-violet-500" />
                                <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Character</p>
                                <p className="font-bold text-slate-900 dark:text-white">PM Intern</p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4 shadow-sm dark:border-cyan-300/20 dark:bg-white/5">
                                <CalendarDays className="mb-2 h-5 w-5 text-cyan-500" />
                                <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Moment</p>
                                <p className="font-bold text-slate-900 dark:text-white">Week {item.week}</p>
                            </div>
                            <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm dark:border-amber-300/20 dark:bg-white/5">
                                <Briefcase className="mb-2 h-5 w-5 text-amber-500" />
                                <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Skill</p>
                                <p className="font-bold text-slate-900 dark:text-white">Product judgment</p>
                            </div>
                        </div>
                    )}

                    {/* Hint System - For Intern Onboarding */}
                    {hint && (
                        <HintSystem hint={hint} primaryColor={primaryColor} compact={false} />
                    )}

                    {/* Guidance Box */}
                    {item.actionType === 'choice' && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/5 border border-blue-500/20">
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                <strong>Tip:</strong> Each choice has trade-offs. Consider your current KPIs before deciding.
                            </p>
                        </div>
                    )}
                    {item.actionType === 'decision_text' && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                <strong>Tip:</strong> Be specific. Include your reasoning and any risks you've considered.
                            </p>
                        </div>
                    )}
                    {item.actionType === 'submit_prd' && (
                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-500/5 border border-purple-500/20">
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                <strong>Tip:</strong> Fill all required fields. Clear documents score higher.
                            </p>
                        </div>
                    )}
                    {item.actionType === 'task' && (
                        <div className="p-3 rounded-lg bg-primary/5 dark:bg-primary/5 border border-primary/20">
                            <p className="text-xs text-primary dark:text-primary">
                                <strong>Tip:</strong> Check off all required items to complete this task.
                            </p>
                        </div>
                    )}

                    {/* Success Criteria Hint */}
                    {item.actionType === 'decision_text' && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-[12px] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">What makes a good response</span>
                            </div>
                            <ul className="text-xs text-emerald-600 dark:text-emerald-400 space-y-1 list-disc list-inside">
                                <li>Be specific and actionable in your recommendation</li>
                                <li>Consider trade-offs and constraints</li>
                                <li>Include next steps or immediate actions</li>
                            </ul>
                        </div>
                    )}

                    {item.actionType === 'choice' && (
                        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-500/20 rounded-[12px] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">How to decide</span>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Each choice has trade-offs. Consider your current KPIs (Budget, Risk, Morale) and stakeholder priorities before selecting.
                            </p>
                        </div>
                    )}

                    {item.actionType === 'submit_prd' && (
                        <div className="bg-purple-50 dark:bg-purple-500/5 border border-purple-500/20 rounded-[12px] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Document requirements</span>
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                Fill in all required fields. Clear, concise documents score higher and help stakeholders understand your reasoning.
                            </p>
                        </div>
                    )}

                    {item.actionType === 'task' && (
                        <div className="bg-primary/5 dark:bg-primary/5 border border-primary/20 rounded-[12px] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-primary dark:text-primary uppercase">Task completion</span>
                            </div>
                            <p className="text-xs text-primary dark:text-primary">
                                Check off all required items to complete this task. Each item represents a key step in the process.
                            </p>
                        </div>
                    )}

                    {/* CHOICE */}
                    {item.actionType === 'choice' && item.choices && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                {item.choices.map((ch) => (
                                    <button
                                        key={ch.id}
                                        onClick={() => setSelectedApproval(ch.id)}
                                        className={`w-full text-left p-4 rounded-[12px] border transition-all ${selectedApproval === ch.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
                                    >
                                        <span className={`block text-sm font-bold ${selectedApproval === ch.id ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>{ch.label}</span>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{ch.description}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedApproval && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rationale: Why this path? *</label>
                                    <textarea
                                        value={textValue}
                                        onChange={e => setTextValue(e.target.value)}
                                        placeholder="Explain your strategic reasoning..."
                                        rows={3}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[12px] p-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Key Constraints / Risks Considered</label>
                                    <textarea
                                        value={approvalReason}
                                        onChange={e => setApprovalReason(e.target.value)}
                                        placeholder="e.g. Time limits, technical debt, compliance gaps..."
                                        rows={2}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[12px] p-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* DECISION TEXT */}
                    {item.actionType === 'decision_text' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{item.decisionPrompt}</label>
                            <textarea
                                value={textValue}
                                onChange={e => setTextValue(e.target.value)}
                                placeholder={item.decisionPlaceholder}
                                rows={10}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[12px] p-4 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none font-mono leading-relaxed"
                            />
                            <p className="text-xs text-gray-400 mt-1">{textValue.length} characters (min 20)</p>
                        </div>
                    )}

                    {/* SUBMIT PRD */}
                    {item.actionType === 'submit_prd' && item.prdFields && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-[12px] px-4 py-3">
                                <p className="text-xs font-bold text-blue-500 uppercase">{item.prdTitle}</p>
                            </div>
                            {item.prdFields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1.5">
                                        {field.label} {field.required && <span className="text-red-400">*</span>}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select
                                            value={prdValues[field.id] ?? ''}
                                            onChange={e => setPrdValues(v => ({ ...v, [field.id]: e.target.value }))}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-gray-200 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={prdValues[field.id] ?? ''}
                                            onChange={e => setPrdValues(v => ({ ...v, [field.id]: e.target.value }))}
                                            placeholder={field.placeholder}
                                            rows={4}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                        />
                                    ) : (
                                        <input
                                            value={prdValues[field.id] ?? ''}
                                            onChange={e => setPrdValues(v => ({ ...v, [field.id]: e.target.value }))}
                                            placeholder={field.placeholder}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TASK CHECKLIST */}
                    {item.actionType === 'task' && item.taskChecklist && (
                        <div className="space-y-2">
                            {item.taskChecklist.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => setCheckedItems(prev => {
                                        const n = new Set(prev);
                                        if (n.has(task.id)) {
                                            n.delete(task.id);
                                        } else {
                                            n.add(task.id);
                                        }
                                        return n;
                                    })}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-500/40 transition-colors text-left"
                                >
                                    {checkedItems.has(task.id)
                                        ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                    }
                                    <span className={`text-sm ${checkedItems.has(task.id) ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                        {task.label}
                                    </span>
                                    {task.required && <span className="ml-auto text-[10px] text-red-400 font-bold">Required</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* APPROVAL */}
                    {item.actionType === 'approval' && item.approvalOptions && (
                        <div className="space-y-3">
                            {item.approvalContext && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-[12px] p-4 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed font-mono">
                                    {item.approvalContext}
                                </div>
                            )}
                            {item.approvalOptions.map((opt) => (
                                <div key={opt.id}>
                                    <button
                                        onClick={() => { setSelectedApproval(opt.id); setShowReasonFor(opt.requiresReason ? opt.id : ''); }}
                                        className={`w-full text-left p-4 rounded-[12px] border transition-all ${selectedApproval === opt.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
                                    >
                                        <span className={`text-sm font-bold ${selectedApproval === opt.id ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>{opt.label}</span>
                                    </button>
                                    {showReasonFor === opt.id && selectedApproval === opt.id && (
                                        <textarea
                                            value={approvalReason}
                                            onChange={e => setApprovalReason(e.target.value)}
                                            placeholder="Provide your reasoning..."
                                            rows={3}
                                            className="mt-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ACKNOWLEDGE */}
                    {item.actionType === 'acknowledge' && (
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-[12px] p-4 text-sm text-blue-600 dark:text-blue-400">
                            Click "Acknowledge" below to confirm you have read and understood this notification.
                        </div>
                    )}
                </div>

                {/* Footer */}
                {item.actionType !== 'choice' ? (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit()}
                            className="flex-1 py-2.5 text-sm font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                        >
                            {submitLabel}
                        </button>
                    </div>
                ) : (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                const ch = item.choices?.find(c => c.id === selectedApproval);
                                if (ch) {
                                    onComplete(item.id, {
                                        choice: ch.id,
                                        summary: ch.label,
                                        rationale: textValue,
                                        constraints: approvalReason
                                    });
                                    onClose();
                                }
                            }}
                            disabled={!selectedApproval || textValue.length < 10 || approvalReason.length < 10}
                            className="flex-1 py-2.5 text-sm font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                        >
                            Confirm Choice
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
