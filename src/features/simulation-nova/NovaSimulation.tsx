/**
 * NovaSimulation - Main simulation component
 * 
 * The complete PM simulation experience:
 * - 4-phase timeline (Discovery → Definition → Delivery → Launch)
 * - 5 avatar stakeholders with AI-powered chat
 * - Deliverable submission with avatar reviews
 * - Real-time KPI dashboard
 */

import { useState, useEffect } from 'react';
import { X, Menu, ChevronRight, Trophy } from 'lucide-react';
import { PhaseTimeline } from './components/PhaseTimeline';
import { AvatarList } from './components/AvatarList';
import { AvatarChat } from './components/AvatarChat';
import { KPIDashboard } from './components/KPIDashboard';
import { DeliverableForm } from './components/DeliverableForm';
import { useSimulationState } from './hooks/useSimulationState';
import { AvatarId } from './data/novaPayAvatars';
import { NOVAPAY_CONTEXT } from './data/novaPayConfig';

type ActiveView = 'chat' | 'deliverables';

export function NovaSimulation() {
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  const {
    state,
    advanceWeek,
    completeDeliverable,
    updateKPI
  } = useSimulationState(1);

  // Simulate time passing
  useEffect(() => {
    if (state.isCompleted) {
      setShowCompletion(true);
    }
  }, [state.isCompleted]);

  // Track actions that affect KPIs
  const handleDeliverableSubmit = (deliverableId: string, _content: string) => {
    completeDeliverable(deliverableId);
    
    // KPIs improve when deliverables are submitted
    updateKPI('stakeholderTrust', state.kpis.stakeholderTrust + 5);
    updateKPI('teamMorale', state.kpis.teamMorale + 3);
    updateKPI('riskLevel', Math.max(10, state.kpis.riskLevel - 5));
    
    // Advance week after deliverable (simplified)
    if (state.currentWeek < 8) {
      advanceWeek();
    }
  };

  // Avatar interaction effects on KPIs
  const handleAvatarSelect = (avatarId: AvatarId) => {
    setSelectedAvatarId(avatarId);
    setActiveView('chat');
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden bg-card border-r border-border`}
      >
        <div className="p-6 h-full flex flex-col overflow-hidden">
          {/* Company Header */}
          <div className="pb-6 mb-6 border-b border-border/60">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              NovaPay
            </h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {NOVAPAY_CONTEXT.project.title}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mt-2">
              Goal: {NOVAPAY_CONTEXT.project.currentMetric} → {NOVAPAY_CONTEXT.project.targetMetric}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-1.5 mb-8">
            <button
              onClick={() => setActiveView('chat')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeView === 'chat' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <span className="text-lg">💬</span>
              <span>Stakeholder Chat</span>
            </button>
            <button
              onClick={() => setActiveView('deliverables')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeView === 'deliverables' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <span className="text-lg">📄</span>
              <span>Deliverables</span>
            </button>
          </div>

          {/* Avatar List or Deliverables */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'chat' ? (
              <AvatarList 
                selectedAvatarId={selectedAvatarId}
                onSelectAvatar={handleAvatarSelect}
              />
            ) : (
              <DeliverableForm
                currentPhase={state.phase}
                completedDeliverables={state.completedDeliverables}
                onSubmit={handleDeliverableSubmit}
              />
            )}
          </div>

          {/* KPI Dashboard (sidebar) */}
          <div className="pt-6 mt-6 border-t border-border/60">
            <KPIDashboard 
              kpis={state.kpis}
              currentWeek={state.currentWeek}
              totalWeeks={state.totalWeeks}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="text-sm font-bold text-foreground">
              NovaPay <span className="mx-2 text-border">/</span> {NOVAPAY_CONTEXT.project.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center px-3 py-1 bg-secondary rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Week {state.currentWeek}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-border" />
            <div className="flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{state.phaseConfig.name}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Phase Timeline */}
          <div className="max-w-4xl mx-auto mb-12">
            <PhaseTimeline 
              currentPhase={state.phase}
              currentWeek={state.currentWeek}
              completedDeliverables={state.completedDeliverables}
            />
          </div>

          {/* Chat or Deliverable View */}
          {activeView === 'chat' && selectedAvatarId && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <AvatarChat 
                  avatarId={selectedAvatarId}
                  currentPhase={state.phase}
                  onClose={() => setSelectedAvatarId(null)}
                />
              </div>
            </div>
          )}

          {activeView === 'chat' && !selectedAvatarId && (
            <div className="text-center py-24">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Select a Stakeholder
              </h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Choose a team member from the sidebar to gather insights and discuss project requirements.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-card border border-primary/30 rounded-3xl p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Simulation Complete!
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              You've successfully mastered the NovaPay simulation. Your results have been integrated into your professional portfolio.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-3xl font-bold text-emerald-500">{state.completedDeliverables.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Deliverables</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-3xl font-bold text-blue-500">{Math.round(state.kpis.stakeholderTrust)}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Trust Score</p>
              </div>
            </div>

            <button
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
              onClick={() => window.location.href = '/portfolio'}
            >
              Go to Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NovaSimulation;