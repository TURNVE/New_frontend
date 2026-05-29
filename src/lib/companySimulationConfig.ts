import type { SimulationTemplate } from '../config/simulationTemplates';
import type {
  SimulationArchetype,
  SimulationConfig,
  WeeklyActionItem,
} from '../shared/simulation/types';

const toSimulationArchetype = (archetype: SimulationTemplate['archetype']): SimulationArchetype => {
  if (archetype === 'creative') return 'zero_to_one';
  return archetype;
};

const fallbackWeeklyActions = (template: SimulationTemplate): WeeklyActionItem[] =>
  template.tasks.map((task, index) => ({
    id: task.id || `task-${index + 1}`,
    week: Math.min(index + 1, template.briefing.totalWeeks || 1),
    title: task.title,
    description: task.description,
    category: 'task',
    actionType: 'task',
    priority: index === 0 ? 'high' : 'normal',
    dueWeek: Math.min(index + 1, template.briefing.totalWeeks || 1),
    taskChecklist: task.requirements.map((requirement, requirementIndex) => ({
      id: `${task.id || `task-${index + 1}`}-req-${requirementIndex + 1}`,
      label: requirement,
      required: true,
    })),
    learnerInstruction: task.description,
    expectedAnswerGuide: task.requirements,
  }));

export function companyTemplateToSimulationConfig(template: SimulationTemplate): SimulationConfig {
  return {
    id: template.id,
    name: template.name || 'Company Simulation',
    companyName: template.companyName || 'Organization',
    industry: template.industry || 'General',
    archetype: toSimulationArchetype(template.archetype),
    logo: template.logo || '/logo.png',
    primaryColor: template.primaryColor || '#5e6ad2',
    description: template.description || template.challengeDetails || 'Organization-created simulation.',
    founded: template.founded || '2026',
    employees: template.employees || String(template.briefing.teamSize || 1),
    headquarters: template.headquarters || 'Remote',
    budget: template.budget || template.briefing.budget || 0,
    fundingStatus: template.fundingStatus || 'Internal program',
    challenge: template.challenge || template.briefing.title || template.name || 'Company challenge',
    challengeDetails: template.challengeDetails || template.briefing.description || template.description,
    totalWeeks: template.briefing.totalWeeks || Math.max(1, Math.ceil(template.durationHours / 8)),
    teamSize: template.briefing.teamSize || 1,
    durationHours: template.durationHours || 40,
    difficulty: template.difficulty,
    passThreshold: template.passThreshold,
    strongPassThreshold: template.strongPassThreshold,
    projectType: template.briefing.projectType || 'Custom Simulation',
    marketContext: template.briefing.marketContext || `${template.industry || 'General'} company simulation`,
    technicalStack: template.briefing.technicalStack || 'Company-provided context',
    kpis: template.briefing.kpis,
    stakeholders: template.briefing.stakeholders,
    successCriteria: template.briefing.successCriteria,
    timelinePhases: template.briefing.timelinePhases,
    currentRisks: template.briefing.currentRisks,
    tasks: template.tasks,
    actions: [],
    weeklySignals: template.weeklySignals ?? [],
    weeklyEvents: template.weeklyEvents ?? [],
    weeklyActions: template.weeklyActions?.length ? template.weeklyActions : fallbackWeeklyActions(template),
    evaluationRubrics: template.evaluationRubrics as SimulationConfig['evaluationRubrics'],
  };
}
