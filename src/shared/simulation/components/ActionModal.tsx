import { useState } from 'react';
import { X, CheckCircle, Circle, AlertTriangle, FileText, ClipboardList, ThumbsUp, RotateCcw } from 'lucide-react';
import type { WeeklyActionItem, ScenarioAction, ActionChoice } from '../types';

// ─── Unified action shape the modal can handle ────────────────
export type ModalAction =
    | { kind: 'weekly'; item: WeeklyActionItem }
    | { kind: 'legacy'; item: ScenarioAction };

interface ActionModalProps {
    action: ModalAction;
    gameState?: any;
    onComplete: (actionId: string, result: Record<string, unknown>) => void;
    onLegacyDecision?: (choice: ActionChoice) => void;
    onClose: () => void;
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
    decision: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    document: <FileText className="w-5 h-5 text-blue-400" />,
    task: <ClipboardList className="w-5 h-5 text-purple-400" />,
    approval: <ThumbsUp className="w-5 h-5 text-emerald-400" />,
    review: <FileText className="w-5 h-5 text-teal-400" />,
    notification: <CheckCircle className="w-5 h-5 text-gray-400" />,
};

export default function ActionModal({ action, gameState, onComplete, onLegacyDecision, onClose }: ActionModalProps) {
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
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-lg w-full p-8 shadow-2xl">
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
                                className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
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
        high: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        normal: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between flex-shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            {icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${priorityBadge[item.priority]}`}>
                                    {item.priority}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase">{item.category}</span>
                                {item.dueWeek && <span className="text-[10px] text-gray-400">Due Week {item.dueWeek}</span>}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasPrevious && (
                            <button
                                onClick={handleRecallPrevious}
                                className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded border border-amber-500/20 transition-colors"
                                title="Recall previous submission for this task"
                            >
                                <RotateCcw className="w-3 h-3" /> Recall
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex-shrink-0">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Immersive Strategic Briefing */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative bg-white dark:bg-gray-900 border border-blue-500/10 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 px-2 bg-blue-500/10 rounded text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                    Strategic Briefing
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                            </div>
                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium antialiased">
                                {item.description}
                            </p>
                        </div>
                    </div>

                    {/* CHOICE */}
                    {item.actionType === 'choice' && item.choices && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                {item.choices.map((ch) => (
                                    <button
                                        key={ch.id}
                                        onClick={() => setSelectedApproval(ch.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedApproval === ch.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
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
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Key Constraints / Risks Considered</label>
                                        <textarea
                                            value={approvalReason}
                                            onChange={e => setApprovalReason(e.target.value)}
                                            placeholder="e.g. Time limits, technical debt, compliance gaps..."
                                            rows={2}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
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
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none font-mono leading-relaxed"
                            />
                            <p className="text-xs text-gray-400 mt-1">{textValue.length} characters (min 20)</p>
                        </div>
                    )}

                    {/* SUBMIT PRD */}
                    {item.actionType === 'submit_prd' && item.prdFields && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
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
                                        n.has(task.id) ? n.delete(task.id) : n.add(task.id);
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
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed font-mono">
                                    {item.approvalContext}
                                </div>
                            )}
                            {item.approvalOptions.map((opt) => (
                                <div key={opt.id}>
                                    <button
                                        onClick={() => { setSelectedApproval(opt.id); setShowReasonFor(opt.requiresReason ? opt.id : ''); }}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedApproval === opt.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
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
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-600 dark:text-blue-400">
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
                            {item.actionType === 'decision_text' ? 'Submit Memo'
                                : item.actionType === 'submit_prd' ? 'Submit Document'
                                    : item.actionType === 'task' ? 'Mark Complete'
                                        : item.actionType === 'approval' ? 'Submit Decision'
                                            : 'Acknowledge'}
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
                            Confirm Decision
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
