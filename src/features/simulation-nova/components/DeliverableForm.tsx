/**
 * DeliverableForm - Form for submitting deliverables
 */

import { useState } from 'react';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { Phase, PHASES } from '../data/novaPayConfig';

interface Deliverable {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  required: boolean;
}

interface DeliverableFormProps {
  currentPhase: Phase;
  completedDeliverables: string[];
  onSubmit: (deliverableId: string, content: string) => void;
}

const DELIVERABLES_BY_PHASE: Record<Phase, Deliverable[]> = {
  discovery: [
    {
      id: 'discovery_summary',
      name: 'Discovery Summary',
      description: 'Summarize your research findings, problem analysis, and recommended focus area.',
      placeholder: 'Start with the problem: What did you discover about the 72% drop-off at step 3?\n\nKey findings:\n- What users are saying\n- What the data shows\n- What the team knows\n\nRecommended focus: What should we tackle first and why?',
      required: true
    }
  ],
  definition: [
    {
      id: 'prd',
      name: 'Product Requirements Document (PRD)',
      description: 'Define the product requirements, user stories, success metrics, and scope.',
      placeholder: '## Problem Statement\nWhat specific problem are we solving?\n\n## Success Metrics\nHow will we measure success?\n- Primary metric:\n- Secondary metrics:\n\n## User Stories\n1. As a [user], I want [feature] so that [benefit]\n\n## Scope\n- In scope:\n- Out of scope:',
      required: true
    },
    {
      id: 'roadmap',
      name: 'Product Roadmap',
      description: 'Phase-based roadmap for the next 8 weeks.',
      placeholder: '## Phase 1: Quick Wins (Weeks 1-2)\n- [ ] Item 1\n\n## Phase 2: Core Features (Weeks 3-5)\n- [ ] Item 1\n\n## Phase 3: Polish (Weeks 6-8)\n- [ ] Item 1',
      required: true
    }
  ],
  delivery: [
    {
      id: 'risk_log',
      name: 'Risk Log',
      description: 'Document risks identified during delivery and mitigation strategies.',
      placeholder: '| Risk | Severity | Likelihood | Mitigation |\n|------|----------|------------|------------|\n| API delays | High | Medium | Buffer time |\n\nAdd your own risks and mitigation strategies...',
      required: true
    },
    {
      id: 'stakeholder_update',
      name: 'Stakeholder Status Update',
      description: 'Weekly update for the CEO and team.',
      placeholder: '## Week {week} Update\n\n### Wins\n- What went well\n\n### Challenges\n- What's not going well\n\n### Next Steps\n- What we\'re doing next\n\n### Help Needed\n- Where do we need support?',
      required: true
    }
  ],
  launch: [
    {
      id: 'launch_plan',
      name: 'Launch Plan',
      description: 'Go-to-market plan with rollout strategy and success metrics.',
      placeholder: '## Launch Date\n\n## Rollout Strategy\n- [ ] Phase 1 (10%)\n- [ ] Phase 2 (50%)\n- [ ] Phase 3 (100%)\n\n## Success Metrics\n- Primary: \n- Secondary:\n\n## Rollback Plan\nIf things go wrong...',
      required: true
    },
    {
      id: 'retrospective',
      name: 'Retrospective',
      description: 'Post-launch retrospective: what went well, what didn\'t, what you\'d do differently.',
      placeholder: '## What Went Well\n\n## What Could Have Gone Better\n\n## What I Would Do Differently\n\n## Key Learnings',
      required: true
    }
  ]
};

export function DeliverableForm({ currentPhase, completedDeliverables, onSubmit }: DeliverableFormProps) {
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliverables = DELIVERABLES_BY_PHASE[currentPhase];
  const pendingDeliverables = deliverables.filter(d => !completedDeliverables.includes(d.id));
  const completedCount = deliverables.filter(d => completedDeliverables.includes(d.id)).length;

  const handleSubmit = async () => {
    if (!selectedDeliverable || !content.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSubmit(selectedDeliverable, content);
    setIsSubmitting(false);
    setSelectedDeliverable(null);
    setContent('');
  };

  const currentDeliverable = deliverables.find(d => d.id === selectedDeliverable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Deliverables</h3>
        <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {completedCount}/{deliverables.length} Complete
        </span>
      </div>

      {/* Deliverable list */}
      <div className="space-y-3">
        {deliverables.map(deliverable => {
          const isCompleted = completedDeliverables.includes(deliverable.id);
          const isSelected = selectedDeliverable === deliverable.id;

          return (
            <button
              key={deliverable.id}
              onClick={() => !isCompleted && setSelectedDeliverable(deliverable.id)}
              disabled={isCompleted}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70' 
                  : isSelected 
                    ? 'bg-primary/10 border-primary/30 shadow-sm' 
                    : 'bg-card border-border hover:border-primary/20 hover:bg-secondary/30'
              }`}
              style={{ cursor: isCompleted ? 'default' : 'pointer' }}
            >
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompleted 
                    ? 'bg-emerald-500/15 text-emerald-500' 
                    : isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-secondary text-muted-foreground group-hover:text-primary'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${isCompleted ? 'text-emerald-500' : 'text-foreground'}`}>
                  {deliverable.name}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/70 truncate">{deliverable.description}</p>
              </div>
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submission form */}
      {currentDeliverable && (
        <div className="mt-6 p-6 rounded-3xl bg-background border border-primary/20 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Submit Deliverable</span>
              <h4 className="text-base font-bold text-foreground mt-1">
                {currentDeliverable.name}
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedDeliverable(null);
                setContent('');
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentDeliverable.placeholder}
            className="w-full h-56 p-4 rounded-2xl bg-card border border-border text-sm resize-none outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all custom-scrollbar"
          />
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Deliverable</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}