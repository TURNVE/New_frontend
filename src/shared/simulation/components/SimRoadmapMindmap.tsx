import React, { useState, useMemo } from 'react';
import {
    CheckCircle2, Circle, Clock, MessageSquare, Zap,
    ArrowRight, Lock, ChevronRight, Send, User, X, AlertTriangle, Map
} from 'lucide-react';

interface MindmapNode {
    id: string;
    title: string;
    description: string;
    week: number;
    status: 'completed' | 'active' | 'locked' | 'pending';
    type: 'week' | 'phase' | 'win';
    comments?: { user: string; text: string; time: string }[];
    actionId?: string;
}

interface SimRoadmapMindmapProps {
    currentWeek: number;
    totalWeeks: number;
    phases: any[]; // Using the timelinePhases from config
    onTriggerAction: (actionId: string) => void;
}

export default function SimRoadmapMindmap({ currentWeek, totalWeeks, phases, onTriggerAction }: SimRoadmapMindmapProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    // Transform phases into nodes
    const nodes: MindmapNode[] = useMemo(() => {
        const result: MindmapNode[] = [];

        // Root Node
        result.push({
            id: 'root',
            title: 'PayLink Launch',
            description: 'Critical 3-week window to achieve market readiness.',
            week: 0,
            status: 'active',
            type: 'week'
        });

        phases.forEach((p, _idx) => {
            const weekNum = p.week || 1;
            let status: MindmapNode['status'] = 'pending';
            if (weekNum < currentWeek) status = 'completed';
            else if (weekNum === currentWeek) status = 'active';
            else status = 'locked';

            result.push({
                id: p.id,
                title: p.name,
                description: p.description,
                week: weekNum,
                status,
                type: 'win',
                actionId: p.actionId,
                comments: p.comments || [
                    { user: 'Sarah Chen (CTO)', text: 'We need to be extremely careful with the load testing here.', time: '2h ago' }
                ]
            });
        });

        return result;
    }, [phases, currentWeek]);

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="flex h-full bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden relative">

            {/* ── Mindmap Canvas ──────────────────────────────── */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-12 custom-scrollbar">
                <div className="min-w-[800px] flex items-start gap-12">

                    {/* ROOT COLUMN */}
                    <div className="flex flex-col items-center justify-center h-full relative">
                        {/* Connection Lines (Background) */}
                        <svg className="absolute left-full top-1/2 -translate-y-1/2 w-[1000px] h-96 pointer-events-none opacity-20 dark:opacity-10" style={{ zIndex: -1 }}>
                            <path d="M 0 192 L 150 48" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 0 192 L 150 192" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 0 192 L 150 336" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />

                            <path d="M 280 48 L 430 48" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 280 192 L 430 192" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 280 336 L 430 336" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />

                            <path d="M 560 48 L 710 48" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 560 192 L 710 192" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                            <path d="M 560 336 L 710 336" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                        </svg>

                        <div className="w-48 p-6 bg-blue-600 rounded-[16px] shadow-xl shadow-blue-500/20 text-white text-center border border-white/20 z-10">
                            <Zap className="w-8 h-8 mx-auto mb-3" />
                            <h3 className="font-bold">Project Alpha</h3>
                            <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Sim 001</p>
                        </div>
                    </div>

                    {/* WEEKS COLUMNS */}
                    {[1, 2, 3].map(wk => (
                        <div key={wk} className="flex flex-col gap-6 relative">
                            {/* Week Header */}
                            <div className={`p-3 rounded-[12px] border text-center mb-4 transition-all duration-500 ${wk < currentWeek ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                wk === currentWeek ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-blue-400' :
                                    'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 grayscale'
                                }`}>
                                <p className="text-[10px] font-black uppercase tracking-tighter">Week</p>
                                <p className="text-xl font-black">0{wk}</p>
                            </div>

                            {/* Nodes for this week */}
                            <div className="space-y-4">
                                {nodes.filter(n => n.week === wk).map(node => (
                                    <button
                                        key={node.id}
                                        onClick={() => setSelectedNodeId(node.id)}
                                        disabled={node.status === 'locked'}
                                        className={`group relative w-64 p-4 text-left rounded-[16px] border-2 transition-all duration-300 ${selectedNodeId === node.id
                                            ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10 -translate-y-1'
                                            : node.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/5 opacity-80' :
                                                node.status === 'active' ? 'border-blue-500/20 bg-white dark:bg-gray-900 hover:border-blue-500/50 hover:-translate-y-0.5' :
                                                    'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            {node.status === 'completed' ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : node.status === 'locked' ? (
                                                <Lock className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <Circle className={`w-4 h-4 ${node.status === 'active' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                                            )}
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phase {nodes.filter(n => n.week === wk).indexOf(node) + 1}</span>
                                        </div>
                                        <h4 className={`text-sm font-bold truncate ${node.status === 'locked' ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                            {node.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                            {node.description}
                                        </p>

                                        {/* Status Bar */}
                                        <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${node.status === 'completed' ? 'bg-emerald-500 w-full' :
                                                node.status === 'active' ? 'bg-blue-500 w-[40%]' : 'w-0'
                                                }`} />
                                        </div>

                                        {node.comments && node.comments.length > 0 && (
                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#0a0a0a]">
                                                {node.comments.length}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Side Intelligence Panel ─────────────────────── */}
            <div className={`w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d0d0d] flex flex-col transition-all duration-300 ${selectedNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0 shadow-2xl'}`}>
                {selectedNode ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${selectedNode.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {selectedNode.status}
                                </span>
                                <button onClick={() => setSelectedNodeId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-2">{selectedNode.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">"{selectedNode.description}"</p>
                        </div>

                        {/* Comments Stream */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Internal Thread</h4>
                            </div>

                            {(selectedNode.comments || []).map((c, i) => (
                                <div key={i} className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <User className="w-3 h-3 text-blue-400" />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{c.user}</span>
                                        <span className="text-[9px] text-gray-400 ml-auto">{c.time}</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/[0.03] p-3 rounded-[16px] border border-gray-100 dark:border-white/5">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">{c.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Simulation Tip */}
                            {selectedNode.status === 'active' && (
                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-[12px] space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-bold text-amber-500 uppercase">Strategic Insight</span>
                                    </div>
                                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                                        Completing this milestone will likely trigger a response from the Board. Ensure your rationale is locked in the memo.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Add a thought..."
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] px-4 py-3 text-xs focus:outline-none focus:border-blue-500"
                                />
                                <button className="absolute right-2 top-2 p-1.5 bg-blue-500 text-white rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                                    <Send className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Action Link Footer */}
                        {selectedNode.status === 'active' && (
                            <div className="p-6 bg-blue-500">
                                <button
                                    onClick={() => onTriggerAction(selectedNode.actionId || selectedNode.id)}
                                    className="w-full bg-white text-blue-600 font-bold py-3 rounded-[12px] flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
                                >
                                    Focus on This Feature <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                            <Map className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-bold dark:text-white mb-2">Selection Required</h4>
                        <p className="text-sm text-gray-500 italic">"Select a roadmap milestone to view intelligence and stakeholder commentary."</p>
                    </div>
                )}
            </div>
        </div>
    );
}
