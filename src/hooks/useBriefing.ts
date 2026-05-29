import { useState, useEffect, useCallback } from 'react';
import type { KPI } from '../components/simulation/KPICard';
import type { SuccessCriterion } from '../components/simulation/SuccessCriteriaList';
import type { TimelinePhase } from '../components/simulation/TimelineDisplay';
import type { ProjectBriefingData } from '../components/simulation/ProjectReferencePanel';
import { getBriefingForSimulation } from '../config/simulationTemplates';

interface UseBriefingOptions {
  scenarioId?: string;
  initialWeek?: number;
}

interface GameStateMetrics {
  teamMorale: number;
  budget: number;
  timeline: number;
  stakeholderSatisfaction: number;
  riskLevel: number;
  quality: number;
}

export const useBriefing = (options: UseBriefingOptions = {}) => {
  const { scenarioId, initialWeek = 1 } = options;
  const [currentWeek, setCurrentWeek] = useState(initialWeek);
  const [briefing, setBriefing] = useState<ProjectBriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load briefing data from simulation templates
  useEffect(() => {
    setIsLoading(true);
    
    if (scenarioId) {
      // Try to get briefing from simulation templates
      const templateBriefing = getBriefingForSimulation(scenarioId);
      
      if (templateBriefing) {
        setBriefing(templateBriefing);
      } else {
        // Fallback to default
        const defaultBriefing: ProjectBriefingData = {
          id: scenarioId || 'default',
          title: 'PM Simulation Project',
          description: 'Manage a software development project to successful completion',
          totalWeeks: 12,
          kpis: [
            {
              id: 'team-morale',
              label: 'Team Morale',
              value: 45,
              maxValue: 100,
              trend: { direction: 'up', value: '+5%', color: 'green' },
              status: 'warning',
              goal: 'Keep above 60%',
              progress: 45,
            },
            {
              id: 'budget',
              label: 'Budget',
              value: 78,
              maxValue: 100,
              trend: { direction: 'down', value: '-3%', color: 'red' },
              status: 'good',
              goal: 'Stay under 100%',
              progress: 78,
            },
            {
              id: 'timeline',
              label: 'Timeline',
              value: 32,
              maxValue: 100,
              status: 'critical',
              goal: 'Meet all deadlines',
              progress: 32,
            },
            {
              id: 'stakeholder',
              label: 'Stakeholder Sat.',
              value: 55,
              maxValue: 100,
              trend: { direction: 'up', value: '+10%', color: 'green' },
              status: 'warning',
              goal: 'Keep above 70%',
              progress: 55,
            },
            {
              id: 'quality',
              label: 'Quality',
              value: 82,
              maxValue: 100,
              status: 'good',
              goal: 'Maintain above 80%',
              progress: 82,
            },
            {
              id: 'risk',
              label: 'Risk Level',
              value: 25,
              maxValue: 100,
              trend: { direction: 'down', value: '-5%', color: 'green' },
              status: 'good',
              goal: 'Keep below 30%',
              progress: 25,
            },
          ],
          successCriteria: [
            { id: '1', description: 'Deliver PRD by Week 4', completed: false, weekDue: 4, priority: 'high' },
            { id: '2', description: 'Complete MVP by Week 8', completed: false, weekDue: 8, priority: 'high' },
            { id: '3', description: 'Stay under budget', completed: true, priority: 'high' },
            { id: '4', description: 'Achieve 80% team morale', completed: false, priority: 'medium' },
            { id: '5', description: 'Complete user testing', completed: false, weekDue: 10, priority: 'medium' },
            { id: '6', description: 'Launch on schedule', completed: false, weekDue: 12, priority: 'high' },
            { id: '7', description: 'Get stakeholder sign-off', completed: false, weekDue: 12, priority: 'medium' },
          ],
          timeline: [
            {
              id: 'planning',
              name: 'Planning',
              weekStart: 1,
              weekEnd: 4,
              description: 'Project setup and requirements',
              milestones: [
                { week: 1, title: 'Kickoff' },
                { week: 2, title: 'Requirements' },
                { week: 4, title: 'PRD Review' },
              ],
            },
            {
              id: 'development',
              name: 'Development',
              weekStart: 5,
              weekEnd: 8,
              description: 'Core development sprints',
              milestones: [
                { week: 5, title: 'Sprint 1 Start' },
                { week: 6, title: 'Alpha Release' },
                { week: 8, title: 'MVP Complete' },
              ],
            },
            {
              id: 'testing',
              name: 'Testing & Launch',
              weekStart: 9,
              weekEnd: 12,
              description: 'Testing and final deployment',
              milestones: [
                { week: 9, title: 'Beta Launch' },
                { week: 10, title: 'User Testing' },
                { week: 12, title: 'Go Live' },
              ],
            },
          ],
        };
        setBriefing(defaultBriefing);
      }
    }
    
    setIsLoading(false);
  }, [scenarioId]);

  // Update KPIs based on game state
  const updateKPIs = useCallback((metrics: GameStateMetrics) => {
    if (!briefing) return;

    const updatedKpis: KPI[] = [
      {
        id: 'team-morale',
        label: 'Team Morale',
        value: metrics.teamMorale,
        maxValue: 100,
        status: metrics.teamMorale > 60 ? 'good' : metrics.teamMorale > 30 ? 'warning' : 'critical',
        goal: 'Keep above 60%',
        progress: metrics.teamMorale,
      },
      {
        id: 'budget',
        label: 'Budget',
        value: metrics.budget,
        maxValue: 100,
        status: metrics.budget <= 100 ? 'good' : metrics.budget > 120 ? 'critical' : 'warning',
        goal: 'Stay under 100%',
        progress: metrics.budget,
      },
      {
        id: 'timeline',
        label: 'Timeline',
        value: metrics.timeline,
        maxValue: 100,
        status: metrics.timeline > 70 ? 'good' : metrics.timeline > 40 ? 'warning' : 'critical',
        goal: 'Meet all deadlines',
        progress: metrics.timeline,
      },
      {
        id: 'stakeholder',
        label: 'Stakeholder Sat.',
        value: metrics.stakeholderSatisfaction,
        maxValue: 100,
        status: metrics.stakeholderSatisfaction > 70 ? 'good' : metrics.stakeholderSatisfaction > 40 ? 'warning' : 'critical',
        goal: 'Keep above 70%',
        progress: metrics.stakeholderSatisfaction,
      },
    ];

    setBriefing(prev => prev ? { ...prev, kpis: updatedKpis } : null);
  }, [briefing]);

  // Mark criterion as completed
  const completeCriterion = useCallback((criterionId: string) => {
    setBriefing(prev => {
      if (!prev) return null;
      return {
        ...prev,
        successCriteria: prev.successCriteria.map(c =>
          c.id === criterionId ? { ...c, completed: true } : c
        ),
      };
    });
  }, []);

  // Advance week
  const advanceWeek = useCallback(() => {
    setCurrentWeek(prev => Math.min(prev + 1, briefing?.totalWeeks || 12));
  }, [briefing?.totalWeeks]);

  return {
    briefing,
    currentWeek,
    isLoading,
    updateKPIs,
    completeCriterion,
    advanceWeek,
    setCurrentWeek,
  };
};

export default useBriefing;