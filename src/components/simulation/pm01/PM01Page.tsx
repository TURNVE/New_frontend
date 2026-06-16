import React, { useState, useEffect } from 'react';
import { 
  Bell, Settings, Save, ChevronLeft, AlertTriangle, 
  MessageSquare, CheckCircle, XCircle, ArrowRight, RefreshCw,
  Mail, AlertCircle, Clock, CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from '@/components/ui/button';
import {
  MetricCard,
  TimerDisplay,
  PhasePanel,
  ActionCard,
  StakeholderCard,
  ArtifactCard,
  ProgressDashboard,
} from './UIComponents';
import { usePM01Engine } from './index';

export default function PM01Page() {
  const {
    pm01State,
    currentPhaseDetail,
    availableArtifacts,
    pendingArtifacts,
    nextPhaseUnlock,
    makeDecision,
    submitArtifact,
    advancePhase,
    generateExecutiveFeedback,
    generateCoachingInsight,
    availableActions,
    notifications,
    tasks,
    activeEvent,
    resolveEvent,
    dismissNotification,
    completeTask,
    isCompleted,
    calculateFinalScore,
    isFired,
    timeRemaining,
  } = usePM01Engine();
  
  const [week, setWeek] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setWeek(pm01State.week);
    setProgress(pm01State.progress);
  }, [pm01State.week, pm01State.progress]);

  const currentPhase = currentPhaseDetail || {
    name: 'Loading...',
    phaseNumber: pm01State.currentPhaseNumber,
    objective: '',
    embeddedTension: '',
    availableActions: [],
    requiredArtifacts: [],
    qualityThresholds: { minProgress: 0, maxRisk: 100, minTrust: 0, artifactQuality: 0 },
  };

  const baseStakeholders = [
    { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', trust: 40, influence: 10 },
    { id: 'cfo', name: 'Diana Chen', role: 'CFO', trust: 50, influence: 9 },
    { id: 'vp_sales', name: 'Tom Rodriguez', role: 'VP Sales', trust: 35, influence: 8 },
    { id: 'vp_cs', name: 'Rachel Kim', role: 'VP CS', trust: 45, influence: 7 },
    { id: 'cto', name: 'James Park', role: 'CTO', trust: 55, influence: 8 },
  ];

  const stakeholders = baseStakeholders.map(sh => ({
    ...sh,
    trust: pm01State.stakeholderTrust[sh.id] || sh.trust,
  }));

  const metrics = pm01State.metrics;

  const actions = availableActions && availableActions.length > 0 
    ? availableActions 
    : [
        {
          id: 'review_metrics',
          name: 'Review All Metrics',
          description: 'Analyze available data to understand current state',
          choices: [
            { id: 'review-all', label: 'Full metric deep-dive', description: 'Spend time analyzing all metrics', risk: 2, timeCost: 1 },
            { id: 'review-focused', label: 'Focus on churn', description: 'Prioritize understanding churn spike', risk: 3, timeCost: 1 },
            { id: 'review-quick', label: 'Quick dashboard', description: 'Brief overview of high-level metrics', risk: 5, timeCost: 0.5 },
          ],
        },
        {
          id: 'talk_stakeholders',
          name: 'Talk to Stakeholders',
          description: 'Meet with key stakeholders to understand their perspectives',
          choices: [
            { id: 'talk-all', label: 'Meet all stakeholders', description: '1:1s with CEO, CFO, VP Sales, VP CS, CTO', risk: 2, timeCost: 1 },
            { id: 'talk-ceo-cs', label: 'Focus on CEO and VP CS', description: 'Leadership + customer-facing teams', risk: 3, timeCost: 1 },
            { id: 'talk-sales', label: 'Start with VP Sales', description: 'Sales perspective on product gaps', risk: 4, timeCost: 0.5 },
          ],
        },
        {
          id: 'analyze_churn',
          name: 'Analyze Churn Data',
          description: 'Deep dive into why customers are leaving',
          choices: [
            { id: 'churn-exit', label: 'Exit survey analysis', description: 'Analyze why customers left', risk: 2, timeCost: 1 },
            { id: 'churn-segment', label: 'Analyze by segment', description: 'See if churn is concentrated', risk: 3, timeCost: 1 },
            { id: 'churn-timing', label: 'Analyze timing', description: 'When do customers churn?', risk: 3, timeCost: 0.5 },
          ],
        },
      ];

  const handleActionSelect = async (actionId: string, choiceId: string) => {
    setSelectedAction(actionId);
    
    try {
      const result = await makeDecision(actionId, choiceId);
      setFeedback(result.feedback || 'Action completed successfully.');
      
      setProgress(prev => Math.min(100, prev + 10));
    } catch (error) {
      setFeedback('Failed to process action. Please try again.');
    }
    
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleAdvancePhase = async () => {
    const result = await advancePhase();
    if (result.success) {
      setProgress(0);
      setWeek(w => w + 1);
    } else {
      setFeedback(result.message);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
            <div>
              <h1 className="text-xl font-bold">PM-01: The Growth Stall</h1>
              <p className="text-sm text-slate-400">ScaleFlow - Series B SaaS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-slate-400" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-slate-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-slate-700/50 ${!notif.read ? 'bg-slate-700/50' : ''}`}>
                        <div className="flex items-start gap-2">
                          {notif.type === 'email' && <Mail className="w-4 h-4 mt-1 text-blue-400" />}
                          {notif.type === 'alert' && <AlertCircle className="w-4 h-4 mt-1 text-red-400" />}
                          {notif.type === 'deadline' && <Clock className="w-4 h-4 mt-1 text-yellow-400" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                            {notif.from && <p className="text-xs text-slate-500 mt-1">From: {notif.from}</p>}
                          </div>
                          <button onClick={() => dismissNotification(notif.id)} aria-label="Dismiss notification" className="text-slate-500 hover:text-white">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" aria-label="Settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pb-20">
        {/* Left Panel */}
        <aside className="w-80 bg-slate-800/50 border-r border-slate-700 p-4 space-y-4">
          <TimerDisplay week={week} totalWeeks={9} isHardDeadline={week >= 7} />
          
          <PhasePanel 
            phaseNumber={currentPhase.phaseNumber}
            phaseName={currentPhase.name}
            objectives={currentPhase.objective ? [currentPhase.objective] : []}
            embeddedTension={currentPhase.embeddedTension}
            progress={progress}
          />
          
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Stakeholders</h3>
            <div className="space-y-2">
              {stakeholders.map(sh => (
                <StakeholderCard key={sh.id} {...sh} onMessage={() => {}} />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="ARR" value={metrics.arr} target={9.8} unit="M" trend="stable" />
            <MetricCard label="Churn" value={metrics.monthlyChurn} target={3.0} unit="%" trend="up" />
            <MetricCard label="NPS" value={metrics.nps} target={50} unit="" trend="stable" />
            <MetricCard label="Win Rate" value={metrics.winRate} target={40} unit="%" trend="down" />
            <MetricCard label="Time to Value" value={metrics.timeToValue} target={25} unit="d" trend="up" />
            <MetricCard label="NRR" value={metrics.nrr} target={120} unit="%" trend="down" />
          </div>

          {/* Situation */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Situation Briefing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                You are the Senior PM at ScaleFlow, a Series B SaaS company. 
                Growth has stalled from 80% YoY to just 15%. The board meeting is in {9 - week} weeks.
                Your CEO is anxious, and stakeholders have conflicting theories about what's causing the problem.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Actions</h2>
            {actions.map((action: { id: string; name: string; description: string; choices: Array<{ id: string; label: string; description: string; risk: number; timeCost: number }> }) => (
              <ActionCard 
                key={action.id}
                {...action}
                onSelect={handleActionSelect}
              />
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="fixed bottom-6 right-6 max-w-md p-4 bg-blue-600/90 text-white rounded-lg shadow-lg animate-pulse">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 mt-0.5" />
                <p>{feedback}</p>
              </div>
            </div>
          )}

          {/* Advance Phase Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={advancePhase}
              disabled={progress < 15}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Advance Phase
            </Button>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-72 bg-slate-800/50 border-l border-slate-700 p-4 space-y-4">
          <ProgressDashboard 
            progress={progress} 
            quality={65} 
            decisions={12} 
            artifacts={3} 
          />
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Artifacts Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ArtifactCard id="metrics-summary" name="Metrics Dashboard" isRequired qualityScore={75} />
              <ArtifactCard id="stakeholder-list" name="Stakeholder Concerns" isRequired />
              <ArtifactCard id="hypothesis-doc" name="Hypothesis Document" isRequired={false} />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Quality Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Min Progress</span>
                <span className="text-white">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Risk</span>
                <span className="text-white">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min Trust</span>
                <span className="text-white">40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Artifact Quality</span>
                <span className="text-white">50%</span>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Panel */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded">
                  <button onClick={() => completeTask(task.id)} className="flex-shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <CheckSquare className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{task.description}</p>
                  </div>
                  {task.priority === 'critical' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  {task.priority === 'high' && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Active Event Alert */}
      {activeEvent && (
        <div className="fixed bottom-6 left-6 max-w-md p-4 bg-red-900/90 border border-red-500 rounded-lg shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-red-400" />
            <div className="flex-1">
              <p className="font-semibold text-red-200">{activeEvent.name}</p>
              <p className="text-sm text-red-300 mt-1">{activeEvent.description}</p>
              <Button 
                size="sm" 
                className="mt-3 bg-red-600 hover:bg-red-700"
                onClick={() => resolveEvent(activeEvent.id)}
              >
                Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {pm01State.isCompleted && pm01State.endingState && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <Card className="bg-slate-800 border-slate-700 max-w-lg w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {pm01State.endingState === 'successful_turnaround' && 'Successful Turnaround!'}
                {pm01State.endingState === 'partial_recovery' && 'Partial Recovery'}
                {pm01State.endingState === 'failure_collapse' && 'Simulation Complete'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-slate-300">
                {pm01State.endingState === 'successful_turnaround' && 'You successfully identified the root cause and led ScaleFlow back to growth!'}
                {pm01State.endingState === 'partial_recovery' && 'You stabilized the company but challenges remain. More work needed.'}
                {pm01State.endingState === 'failure_collapse' && 'The growth stall continued. The board lost confidence in the strategy.'}
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-400">Final Score</p>
                  <p className="text-2xl font-bold text-white">{calculateFinalScore().toFixed(0)}/100</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phases Completed</p>
                  <p className="text-2xl font-bold text-white">{pm01State.currentPhaseNumber}/8</p>
                </div>
              </div>

              <div className="text-sm text-slate-400">
                <p className="font-medium text-slate-300 mb-2">Key Metrics:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span>ARR: ${metrics.arr}M</span>
                  <span>Churn: {metrics.monthlyChurn}%</span>
                  <span>NPS: {metrics.nps}</span>
                  <span>Win Rate: {metrics.winRate}%</span>
                </div>
              </div>
              
              <Button className="w-full mt-4">View Detailed Report</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Timer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-3 z-40">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Week</p>
                <p className="text-lg font-bold text-white">{week} / 9</p>
              </div>
            </div>
            
            <div className="w-px h-10 bg-slate-700" />
            
            <div>
              <p className="text-xs text-slate-400">Time Remaining</p>
              <p className={`text-lg font-bold ${week >= 7 ? 'text-red-400' : week >= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                {week >= 7 ? 'CRITICAL' : week >= 5 ? `${9 - week} weeks` : `${(9 - week) * 7} days`}
              </p>
            </div>

            <div className="w-px h-10 bg-slate-700" />
            
            <div>
              <p className="text-xs text-slate-400">Progress</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">{progress}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Budget</p>
              <p className={`text-lg font-bold ${pm01State.budget < 50000 ? 'text-red-400' : 'text-green-400'}`}>
                ${pm01State.budget.toLocaleString()}
              </p>
            </div>
            
            <div className="w-px h-10 bg-slate-700" />
            
            <div className="text-right">
              <p className="text-xs text-slate-400">Risk Level</p>
              <p className={`text-lg font-bold ${pm01State.riskLevel > 60 ? 'text-red-400' : pm01State.riskLevel > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                {pm01State.riskLevel}%
              </p>
            </div>
            
            <div className="w-px h-10 bg-slate-700" />
            
            <div className="text-right">
              <p className="text-xs text-slate-400">Team Morale</p>
              <p className={`text-lg font-bold ${pm01State.teamMorale < 40 ? 'text-red-400' : pm01State.teamMorale < 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                {pm01State.teamMorale}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}