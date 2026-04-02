import { useEffect, useCallback, useRef } from 'react';
import { useNotifications } from '../components/communications/NotificationCenter';
import type { GameState, TimelineEvent, Signal } from '../../../src/simulation/core/SimulationEngine';

interface SimulationEvent {
  type: 'crisis' | 'opportunity' | 'milestone' | 'stakeholder' | 'signal';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

// Stakeholder email templates based on event type
const stakeholderEmailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
  crisis: {
    ceo: { subject: 'URGENT: We need to talk', body: 'This situation is unacceptable. I expect a plan on my desk in 2 hours. Our investors are watching.' },
    cto: { subject: 'Technical Assessment Needed', body: 'Please evaluate the technical implications and provide a risk assessment. I need options, not problems.' },
    cfo: { subject: 'Budget Impact?', body: 'What\'s the financial exposure here? I need numbers for the board meeting.' }
  },
  opportunity: {
    ceo: { subject: 'Interesting development', body: 'This could be a game changer. Schedule a meeting to discuss how we capitalize on this.' },
    cto: { subject: 'Technical feasibility?', body: 'Can we execute on this? What resources do you need?' }
  },
  milestone: {
    ceo: { subject: 'Good progress', body: 'Nice work. Keep the momentum. What\'s the next critical path item?' },
    cfo: { subject: 'Budget update', body: 'Thanks for the update. Are we tracking to budget?' }
  }
};

export function useSimulationNotifications(
  gameState: GameState | null,
  isRunning: boolean
) {
  const { addNotification, addEmail } = useNotifications();
  const lastWeekRef = useRef<number>(0);
  const processedEventsRef = useRef<Set<string>>(new Set());
  const lastSignalCountRef = useRef<number>(0);

  const processSignal = useCallback((signal: Signal) => {
    const titles: Record<string, string> = {
      data: '📊 Data Insights',
      support: '🎫 Support Alert',
      leadership: '👔 Leadership Update',
      sales: '💰 Sales Update'
    };

    addNotification({
      type: signal.priority === 'high' ? 'warning' : 'info',
      title: titles[signal.source] || 'Update',
      message: signal.message,
    });
  }, [addNotification]);

  const processTimelineEvent = useCallback((event: TimelineEvent, stakeholders: GameState['stakeholders']) => {
    if (processedEventsRef.current.has(event.title)) return;
    processedEventsRef.current.add(event.title);

    const eventTypes: Record<string, { icon: string; type: 'error' | 'success' | 'info' | 'warning' }> = {
      crisis: { icon: '🚨', type: 'error' },
      opportunity: { icon: '✨', type: 'success' },
      milestone: { icon: '🎯', type: 'info' },
      stakeholder_change: { icon: '👥', type: 'warning' }
    };

    const config = eventTypes[event.type] || eventTypes.milestone;

    // Main notification
    addNotification({
      type: config.type,
      title: `${config.icon} ${event.title}`,
      message: event.description,
    });

    // Stakeholder reactions - send emails based on event type
    if (stakeholders && stakeholders.length > 0) {
      const templates = stakeholderEmailTemplates[event.type];
      if (templates) {
        // Pick 1-2 stakeholders to react
        const reactingStakeholders = stakeholders
          .filter(s => s.satisfaction < 70 || s.influence > 7)
          .slice(0, 2);

        reactingStakeholders.forEach((stakeholder, idx) => {
          const roleKey = stakeholder.role.toLowerCase().includes('ceo') ? 'ceo' :
                         stakeholder.role.toLowerCase().includes('cto') ? 'cto' :
                         stakeholder.role.toLowerCase().includes('cfo') ? 'cfo' : 'ceo';
          
          const template = templates[roleKey];
          if (template) {
            setTimeout(() => {
              addEmail({
                from: stakeholder.name,
                subject: template.subject,
                body: `${template.body}\n\n${stakeholder.name}\n${stakeholder.role}`,
                archived: false,
              });
              
              addNotification({
                type: 'info',
                title: `📧 Email from ${stakeholder.name}`,
                message: template.subject,
              });
            }, 1500 + idx * 1000);
          }
        });
      }
    }
  }, [addNotification, addEmail]);

  useEffect(() => {
    if (!gameState || !isRunning) return;

    // Week change notification
    if (gameState.week > lastWeekRef.current) {
      addNotification({
        type: 'info',
        title: `📅 Week ${gameState.week}`,
        message: `Progress: ${Math.round(gameState.progress)}% | Budget: $${gameState.budget}K | Risk: ${Math.round(gameState.riskLevel * 100)}%`,
      });
      lastWeekRef.current = gameState.week;
    }

    // Process new signals
    if (gameState.signals && gameState.signals.length > lastSignalCountRef.current) {
      const newSignals = gameState.signals.slice(lastSignalCountRef.current);
      newSignals.forEach(signal => {
        processSignal(signal);
        processedEventsRef.current.add(signal.id);
      });
    }
    lastSignalCountRef.current = gameState.signals?.length || 0;

    // Check budget/morale warnings
    if (gameState.budget < gameState.initialBudget * 0.3 && !processedEventsRef.current.has('budget-warning')) {
      processedEventsRef.current.add('budget-warning');
      addNotification({
        type: 'warning',
        title: '⚠️ Budget Alert',
        message: `Only $${gameState.budget}K remaining (${Math.round((gameState.budget / gameState.initialBudget) * 100)}% of initial budget)`,
      });
    }

    if (gameState.teamMorale < 40 && !processedEventsRef.current.has('morale-warning')) {
      processedEventsRef.current.add('morale-warning');
      addNotification({
        type: 'warning',
        title: '😓 Team Morale Critical',
        message: `Team morale at ${Math.round(gameState.teamMorale)}%. Consider team-building or addressing concerns.`,
      });
    }

    if (gameState.riskLevel > 0.7 && !processedEventsRef.current.has('risk-warning')) {
      processedEventsRef.current.add('risk-warning');
      addNotification({
        type: 'error',
        title: '🚨 High Risk Level',
        message: `Project risk at ${Math.round(gameState.riskLevel * 100)}%. Immediate mitigation required.`,
      });
    }
  }, [gameState, isRunning, addNotification, processSignal]);

  // Reset on new simulation
  useEffect(() => {
    if (!gameState) {
      lastWeekRef.current = 0;
      lastSignalCountRef.current = 0;
      processedEventsRef.current.clear();
    }
  }, [gameState]);

  return {
    processTimelineEvent,
    clearProcessed: () => processedEventsRef.current.clear()
  };
}