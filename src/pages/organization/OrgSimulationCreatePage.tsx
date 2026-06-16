import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  FileText,
  GripVertical,
  Image,
  MessageSquare,
  Paintbrush,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { useOrganization, useSimulations } from '../../hooks/organization';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/organization/utils';
import type {
  OrganizationRole,
  OrganizationSimulation,
  SimulationCategory,
  SimulationChoice,
  SimulationConfig,
  SimulationMetricConfig,
  SimulationPhase,
  SimulationScenario,
  SimulationStakeholder,
} from '../../lib/organization/types';
import { pm01PhaseStructure } from '../../simulation/content/pm-01';

type BuilderTab = 'overview' | 'environment' | 'phases' | 'people' | 'metrics' | 'review';
type ScenarioType = SimulationScenario['type'];

interface EditableChoice extends SimulationChoice {
  isCorrect?: boolean;
}

interface EditableScenario extends Omit<SimulationScenario, 'choices'> {
  choices: EditableChoice[];
}

interface EditablePhase extends Omit<SimulationPhase, 'scenarios'> {
  scenarios: EditableScenario[];
}

interface CollaboratorDraft {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer';
}

interface BuilderState {
  title: string;
  description: string;
  category: SimulationCategory;
  difficulty: OrganizationSimulation['difficulty'];
  targetRoles: OrganizationRole[];
  templateId?: string;
  branding: {
    companyName: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    coverImageUrl: string;
    tone: 'professional' | 'startup' | 'enterprise' | 'playful';
  };
  environment: {
    workspaceMode: 'solo' | 'team';
    allowTeamChat: boolean;
    allowArtifacts: boolean;
    allowPeerReview: boolean;
    defaultQuestionTimeLimit: number;
    totalTimeLimit: number;
    passingScore: number;
  };
  collaborators: CollaboratorDraft[];
  collaborationInstructions: string;
  phases: EditablePhase[];
  stakeholders: SimulationStakeholder[];
  metrics: SimulationMetricConfig[];
}

const tabs: { id: BuilderTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'environment', label: 'Environment', icon: Paintbrush },
  { id: 'phases', label: 'Phases & questions', icon: MessageSquare },
  { id: 'people', label: 'Stakeholders', icon: Users },
  { id: 'metrics', label: 'Scoring', icon: BarChart3 },
  { id: 'review', label: 'Review', icon: CheckCircle2 },
];

const categories: { value: SimulationCategory; label: string }[] = [
  { value: 'project-management', label: 'Project management' },
  { value: 'crisis-management', label: 'Crisis management' },
  { value: 'team-building', label: 'Team building' },
  { value: 'strategic-planning', label: 'Strategic planning' },
  { value: 'stakeholder-management', label: 'Stakeholder management' },
  { value: 'product-launch', label: 'Product launch' },
  { value: 'custom', label: 'Custom' },
];

const targetRoles: { value: OrganizationRole; label: string }[] = [
  { value: 'owner', label: 'Owners' },
  { value: 'admin', label: 'Admins' },
  { value: 'editor', label: 'Editors' },
  { value: 'viewer', label: 'Viewers' },
];

const templates = [
  {
    id: 'pm-01',
    title: 'PM growth-stall structure',
    description: 'Starts from the same phase structure as the existing PM-01 simulation.',
  },
  {
    id: 'blank',
    title: 'Blank collaborative simulation',
    description: 'Start with a compact team workspace, one phase, and one decision question.',
  },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32);
}

function createChoice(label = 'Option'): EditableChoice {
  return {
    id: uid('choice'),
    label,
    description: '',
    risk: 25,
    timeCost: 10,
    stakeholderImpact: {},
    metricImpact: {},
    isCorrect: false,
  };
}

function createScenario(index = 1): EditableScenario {
  return {
    id: uid('scenario'),
    title: `Question ${index}`,
    description: 'Describe what the participant sees in the simulation workspace.',
    prompt: 'What should the participant decide or submit?',
    type: 'decision',
    timeLimit: 10,
    points: 10,
    choices: [createChoice('Recommended option'), createChoice('Risky option')],
    outcomes: [],
  };
}

function createPhase(index = 1): EditablePhase {
  return {
    id: uid('phase'),
    name: `Phase ${index}`,
    description: 'Define the situation, goal, and expected output for this phase.',
    order: index,
    scenarios: [createScenario(1)],
    requiredArtifacts: ['Decision memo'],
    unlockConditions: index === 1 ? [] : [{ type: 'phase_complete', targetId: `phase-${index - 1}` }],
  };
}

function createMetric(name = 'Decision quality', key = 'decision_quality'): SimulationMetricConfig {
  return {
    id: uid('metric'),
    name,
    key,
    initialValue: 0,
    targetValue: 80,
    unit: '%',
    minThreshold: 0,
    maxThreshold: 100,
  };
}

function createStakeholder(name = 'Amina Okafor', role = 'Executive sponsor'): SimulationStakeholder {
  return {
    id: uid('stakeholder'),
    name,
    role,
    initialTrust: 55,
    initialInfluence: 70,
    description: 'What this stakeholder wants, fears, and pushes for during the simulation.',
  };
}

function createPmTemplateState(orgName?: string): BuilderState {
  const phases = pm01PhaseStructure.slice(0, 5).map((phase, phaseIndex) => ({
    id: phase.id,
    name: phase.name,
    description: phase.objective,
    order: phaseIndex + 1,
    scenarios: [
      {
        id: uid('scenario'),
        title: phase.objective,
        description: phase.situationContext,
        prompt: phase.embeddedTension,
        type: 'decision' as ScenarioType,
        timeLimit: 15,
        points: phase.qualityThresholds.artifactQuality,
        choices: [
          {
            ...createChoice('Collect more evidence before deciding'),
            risk: Math.max(10, phase.qualityThresholds.maxRisk - 15),
            timeCost: 15,
          },
          {
            ...createChoice('Move quickly with the strongest current signal'),
            risk: phase.qualityThresholds.maxRisk,
            timeCost: 8,
          },
        ],
        outcomes: [],
      },
    ],
    requiredArtifacts: phase.requiredArtifacts,
    unlockConditions: phaseIndex === 0 ? [] : [{ type: 'phase_complete' as const, targetId: pm01PhaseStructure[phaseIndex - 1].id }],
  }));

  return {
    title: 'PM-01: Growth stall challenge',
    description: 'A collaborative product-management simulation where participants diagnose a growth slowdown, align stakeholders, and present a recommendation.',
    category: 'project-management',
    difficulty: 'intermediate',
    targetRoles: ['admin', 'editor'],
    templateId: 'pm-01',
    branding: {
      companyName: orgName || 'ScaleFlow',
      primaryColor: '#0f172a',
      accentColor: '#5e6ad2',
      logoUrl: '',
      coverImageUrl: '',
      tone: 'professional',
    },
    environment: {
      workspaceMode: 'team',
      allowTeamChat: true,
      allowArtifacts: true,
      allowPeerReview: true,
      defaultQuestionTimeLimit: 15,
      totalTimeLimit: 120,
      passingScore: 70,
    },
    collaborators: [],
    collaborationInstructions: 'Work as a team. Assign one owner for evidence, one for stakeholder alignment, and one for the final recommendation.',
    phases,
    stakeholders: [
      createStakeholder('Maya Chen', 'CEO'),
      createStakeholder('Daniel Wright', 'CFO'),
      createStakeholder('Priya Rao', 'CTO'),
    ],
    metrics: [
      createMetric('Evidence quality', 'evidence_quality'),
      createMetric('Stakeholder trust', 'stakeholder_trust'),
      createMetric('Execution risk', 'execution_risk'),
    ],
  };
}

function createBlankState(orgName?: string): BuilderState {
  return {
    title: '',
    description: '',
    category: 'custom',
    difficulty: 'intermediate',
    targetRoles: ['admin', 'editor'],
    templateId: 'blank',
    branding: {
      companyName: orgName || '',
      primaryColor: '#0f172a',
      accentColor: '#5e6ad2',
      logoUrl: '',
      coverImageUrl: '',
      tone: 'professional',
    },
    environment: {
      workspaceMode: 'team',
      allowTeamChat: true,
      allowArtifacts: true,
      allowPeerReview: false,
      defaultQuestionTimeLimit: 10,
      totalTimeLimit: 60,
      passingScore: 70,
    },
    collaborators: [],
    collaborationInstructions: '',
    phases: [createPhase(1)],
    stakeholders: [createStakeholder()],
    metrics: [createMetric()],
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-semibold text-slate-700">{children}</label>;
}

function SortableCard({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={className}
    >
      <button
        type="button"
        className="absolute left-3 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export default function OrgSimulationCreatePage() {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const { user } = useAuth();
  const { createSimulation } = useSimulations(organization?.id || '');
  const [activeTab, setActiveTab] = useState<BuilderTab>('overview');
  const [state, setState] = useState<BuilderState>(() => createPmTemplateState(organization?.name));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const completion = useMemo(() => {
    const checks = [
      Boolean(state.title.trim()),
      Boolean(state.description.trim()),
      state.phases.length > 0,
      state.phases.every((phase) => phase.name.trim() && phase.scenarios.length > 0),
      state.stakeholders.length > 0,
      state.metrics.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [state]);

  const totalQuestions = state.phases.reduce((sum, phase) => sum + phase.scenarios.length, 0);
  const totalArtifacts = state.phases.reduce((sum, phase) => sum + phase.requiredArtifacts.length, 0);

  const patchState = (patch: Partial<BuilderState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  const updatePhase = (phaseId: string, patch: Partial<EditablePhase>) => {
    patchState({
      phases: state.phases.map((phase) => (phase.id === phaseId ? { ...phase, ...patch } : phase)),
    });
  };

  const updateScenario = (phaseId: string, scenarioId: string, patch: Partial<EditableScenario>) => {
    patchState({
      phases: state.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              scenarios: phase.scenarios.map((scenario) =>
                scenario.id === scenarioId ? { ...scenario, ...patch } : scenario
              ),
            }
          : phase
      ),
    });
  };

  const updateChoice = (phaseId: string, scenarioId: string, choiceId: string, patch: Partial<EditableChoice>) => {
    patchState({
      phases: state.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              scenarios: phase.scenarios.map((scenario) =>
                scenario.id === scenarioId
                  ? {
                      ...scenario,
                      choices: scenario.choices.map((choice) =>
                        choice.id === choiceId ? { ...choice, ...patch } : choice
                      ),
                    }
                  : scenario
              ),
            }
          : phase
      ),
    });
  };

  const reorderPhases = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = state.phases.findIndex((phase) => phase.id === active.id);
    const newIndex = state.phases.findIndex((phase) => phase.id === over.id);
    patchState({
      phases: arrayMove(state.phases, oldIndex, newIndex).map((phase, index) => ({ ...phase, order: index + 1 })),
    });
  };

  const reorderScenarios = (phaseId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const phase = state.phases.find((item) => item.id === phaseId);
    if (!phase) return;
    const oldIndex = phase.scenarios.findIndex((scenario) => scenario.id === active.id);
    const newIndex = phase.scenarios.findIndex((scenario) => scenario.id === over.id);
    updatePhase(phaseId, { scenarios: arrayMove(phase.scenarios, oldIndex, newIndex) });
  };

  const buildConfig = (): SimulationConfig => ({
    phases: state.phases.map((phase, phaseIndex) => ({
      id: phase.id,
      name: phase.name.trim(),
      description: phase.description.trim(),
      order: phaseIndex + 1,
      scenarios: phase.scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.title.trim(),
        description: scenario.description.trim(),
        prompt: scenario.prompt?.trim(),
        type: scenario.type,
        timeLimit: scenario.timeLimit,
        points: scenario.points,
        choices: scenario.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          description: choice.description,
          risk: choice.risk,
          timeCost: choice.timeCost,
          stakeholderImpact: choice.stakeholderImpact,
          metricImpact: choice.metricImpact,
        })),
        outcomes: scenario.outcomes,
      })),
      requiredArtifacts: phase.requiredArtifacts.filter(Boolean),
      unlockConditions: phase.unlockConditions,
    })),
    stakeholders: state.stakeholders,
    metrics: state.metrics.map((metric) => ({
      ...metric,
      key: metric.key || slugify(metric.name),
    })),
    timeLimit: state.environment.totalTimeLimit,
    passingScore: state.environment.passingScore,
    branding: state.branding,
    environment: {
      workspaceMode: state.environment.workspaceMode,
      allowTeamChat: state.environment.allowTeamChat,
      allowArtifacts: state.environment.allowArtifacts,
      allowPeerReview: state.environment.allowPeerReview,
      defaultQuestionTimeLimit: state.environment.defaultQuestionTimeLimit,
      totalTimeLimit: state.environment.totalTimeLimit,
    },
    collaboration: {
      collaborators: state.collaborators,
      instructions: state.collaborationInstructions,
    },
  });

  const validate = () => {
    if (!state.title.trim()) return 'Add a simulation title before saving.';
    if (!state.description.trim()) return 'Add a simulation description before saving.';
    if (!state.phases.length) return 'Add at least one phase.';
    if (state.phases.some((phase) => !phase.name.trim())) return 'Every phase needs a name.';
    if (state.phases.some((phase) => phase.scenarios.length === 0)) return 'Every phase needs at least one question or task.';
    if (state.phases.some((phase) => phase.scenarios.some((scenario) => !scenario.title.trim()))) {
      return 'Every question needs a title.';
    }
    return null;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    const validationMessage = validate();
    if (validationMessage) {
      setSaveError(validationMessage);
      setActiveTab('review');
      return;
    }
    if (!organization?.id || !user?.id) {
      setSaveError('You must belong to an organization before creating simulations.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const now = new Date().toISOString();
      const simulation: Omit<OrganizationSimulation, 'id' | 'createdAt' | 'updatedAt'> = {
        organizationId: organization.id,
        title: state.title.trim(),
        description: state.description.trim(),
        category: state.category,
        templateId: state.templateId,
        config: buildConfig(),
        status,
        targetRoles: state.targetRoles,
        difficulty: state.difficulty,
        duration: state.environment.totalTimeLimit,
        createdBy: user.id,
        publishedAt: status === 'published' ? now : undefined,
        metrics: {
          totalAssignments: 0,
          activeAssignments: 0,
          completedCount: 0,
          averageScore: 0,
          averageCompletionTime: 0,
        },
      };

      await createSimulation(simulation);
      setSaveSuccess(status === 'published' ? 'Simulation published.' : 'Draft saved.');
      setTimeout(() => navigate('/org/simulations'), 700);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save simulation.');
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    setState(templateId === 'pm-01' ? createPmTemplateState(organization?.name) : createBlankState(organization?.name));
  };

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate('/org/simulations')}
              className="mt-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Back to simulations"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5e6ad2]">Simulation studio</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Create a company simulation</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Build a branded simulation environment with phases, drag-and-drop questions, stakeholders, scoring,
                timing, and team collaboration.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e293b] disabled:opacity-50"
            >
              {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <ArrowRight className="h-4 w-4" />}
              Publish
            </button>
          </div>
        </div>

        {(saveError || saveSuccess) && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
              saveError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            )}
          >
            {saveError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {saveError || saveSuccess}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                      active ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">Build readiness</span>
                <span className="font-bold text-[#5e6ad2]">{completion}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#5e6ad2]" style={{ width: `${completion}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span>{state.phases.length} phases</span>
                <span>{totalQuestions} questions</span>
                <span>{state.stakeholders.length} people</span>
                <span>{totalArtifacts} artifacts</span>
              </div>
            </div>
          </aside>

          <main className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            {activeTab === 'overview' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Start from your existing simulation structure</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Use the PM-01 phase model as a base, or start blank and build the environment yourself.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className={cn(
                        'rounded-xl border p-4 text-left transition-all',
                        state.templateId === template.id
                          ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-950">{template.title}</h3>
                          <p className="mt-1 text-sm leading-5 text-slate-600">{template.description}</p>
                        </div>
                        {state.templateId === template.id && <CheckCircle2 className="h-5 w-5 text-[#5e6ad2]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FieldLabel>Simulation title</FieldLabel>
                    <input
                      value={state.title}
                      onChange={(event) => patchState({ title: event.target.value })}
                      placeholder="Example: Product launch decision room"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2] focus:ring-2 focus:ring-[#5e6ad2]/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      value={state.description}
                      onChange={(event) => patchState({ description: event.target.value })}
                      rows={4}
                      placeholder="Describe the business context, learner goal, and expected outcome."
                      className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#5e6ad2] focus:ring-2 focus:ring-[#5e6ad2]/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <select
                      value={state.category}
                      onChange={(event) => patchState({ category: event.target.value as SimulationCategory })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Difficulty</FieldLabel>
                    <select
                      value={state.difficulty}
                      onChange={(event) => patchState({ difficulty: event.target.value as OrganizationSimulation['difficulty'] })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <FieldLabel>Who can edit or run this simulation?</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {targetRoles.map((role) => {
                      const selected = state.targetRoles.includes(role.value);
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() =>
                            patchState({
                              targetRoles: selected
                                ? state.targetRoles.filter((item) => item !== role.value)
                                : [...state.targetRoles, role.value],
                            })
                          }
                          className={cn(
                            'rounded-lg border px-4 py-3 text-left text-sm font-semibold',
                            selected ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 text-[#5e6ad2]' : 'border-slate-200 text-slate-700'
                          )}
                        >
                          {role.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'environment' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Branding, timing, and collaboration environment</h2>
                  <p className="mt-1 text-sm text-slate-600">This metadata travels in `config` and defines how the simulation workspace should render.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Company or scenario brand</FieldLabel>
                    <input
                      value={state.branding.companyName}
                      onChange={(event) => patchState({ branding: { ...state.branding, companyName: event.target.value } })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                  <div>
                    <FieldLabel>Tone</FieldLabel>
                    <select
                      value={state.branding.tone}
                      onChange={(event) => patchState({ branding: { ...state.branding, tone: event.target.value as BuilderState['branding']['tone'] } })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    >
                      <option value="professional">Professional</option>
                      <option value="startup">Startup</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="playful">Playful</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Primary color</FieldLabel>
                    <input
                      type="color"
                      value={state.branding.primaryColor}
                      onChange={(event) => patchState({ branding: { ...state.branding, primaryColor: event.target.value } })}
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white p-1"
                    />
                  </div>
                  <div>
                    <FieldLabel>Accent color</FieldLabel>
                    <input
                      type="color"
                      value={state.branding.accentColor}
                      onChange={(event) => patchState({ branding: { ...state.branding, accentColor: event.target.value } })}
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white p-1"
                    />
                  </div>
                  <div>
                    <FieldLabel>Logo URL</FieldLabel>
                    <input
                      value={state.branding.logoUrl}
                      onChange={(event) => patchState({ branding: { ...state.branding, logoUrl: event.target.value } })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                  <div>
                    <FieldLabel>Cover image URL</FieldLabel>
                    <input
                      value={state.branding.coverImageUrl}
                      onChange={(event) => patchState({ branding: { ...state.branding, coverImageUrl: event.target.value } })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Total time limit</FieldLabel>
                    <input
                      type="number"
                      min={5}
                      value={state.environment.totalTimeLimit}
                      onChange={(event) => patchState({ environment: { ...state.environment, totalTimeLimit: Number(event.target.value) } })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                  <div>
                    <FieldLabel>Default question time</FieldLabel>
                    <input
                      type="number"
                      min={1}
                      value={state.environment.defaultQuestionTimeLimit}
                      onChange={(event) => patchState({ environment: { ...state.environment, defaultQuestionTimeLimit: Number(event.target.value) } })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                  <div>
                    <FieldLabel>Passing score</FieldLabel>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={state.environment.passingScore}
                      onChange={(event) => patchState({ environment: { ...state.environment, passingScore: Number(event.target.value) } })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['allowTeamChat', 'Team chat'],
                    ['allowArtifacts', 'Artifact submissions'],
                    ['allowPeerReview', 'Peer review'],
                  ].map(([key, label]) => {
                    const value = state.environment[key as keyof BuilderState['environment']] as boolean;
                    return (
                      <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                        {label}
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(event) => patchState({ environment: { ...state.environment, [key]: event.target.checked } })}
                          className="h-4 w-4 accent-[#5e6ad2]"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-950">Collaborators</h3>
                      <p className="text-sm text-slate-600">Add draft collaborators for the simulation authoring workflow.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        patchState({
                          collaborators: [...state.collaborators, { id: uid('collab'), name: '', email: '', role: 'editor' }],
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {state.collaborators.map((collaborator, index) => (
                      <div key={collaborator.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[1fr_1fr_130px_36px]">
                        <input
                          value={collaborator.name}
                          onChange={(event) => {
                            const collaborators = [...state.collaborators];
                            collaborators[index] = { ...collaborator, name: event.target.value };
                            patchState({ collaborators });
                          }}
                          placeholder="Name"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          value={collaborator.email}
                          onChange={(event) => {
                            const collaborators = [...state.collaborators];
                            collaborators[index] = { ...collaborator, email: event.target.value };
                            patchState({ collaborators });
                          }}
                          placeholder="email@company.com"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <select
                          value={collaborator.role}
                          onChange={(event) => {
                            const collaborators = [...state.collaborators];
                            collaborators[index] = { ...collaborator, role: event.target.value as CollaboratorDraft['role'] };
                            patchState({ collaborators });
                          }}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                          <option value="owner">Owner</option>
                          <option value="editor">Editor</option>
                          <option value="reviewer">Reviewer</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => patchState({ collaborators: state.collaborators.filter((item) => item.id !== collaborator.id) })}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove collaborator"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={state.collaborationInstructions}
                    onChange={(event) => patchState({ collaborationInstructions: event.target.value })}
                    rows={3}
                    placeholder="Instructions for how authors should work together on this simulation."
                    className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>
              </section>
            )}

            {activeTab === 'phases' && (
              <section className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Drag phases and build questions</h2>
                    <p className="mt-1 text-sm text-slate-600">Each phase can include tasks, events, decision questions, choices, and required artifacts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => patchState({ phases: [...state.phases, createPhase(state.phases.length + 1)] })}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add phase
                  </button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderPhases}>
                  <SortableContext items={state.phases.map((phase) => phase.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {state.phases.map((phase, phaseIndex) => (
                        <SortableCard key={phase.id} id={phase.id} className="relative rounded-xl border border-slate-200 bg-white p-4 pl-11 shadow-sm">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 lg:flex-row">
                              <input
                                value={phase.name}
                                onChange={(event) => updatePhase(phase.id, { name: event.target.value })}
                                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-[#5e6ad2]"
                              />
                              <button
                                type="button"
                                onClick={() => patchState({ phases: state.phases.filter((item) => item.id !== phase.id) })}
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <textarea
                              value={phase.description}
                              onChange={(event) => updatePhase(phase.id, { description: event.target.value })}
                              rows={2}
                              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#5e6ad2]"
                            />

                            <div>
                              <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Questions and tasks</h3>
                                <button
                                  type="button"
                                  onClick={() => updatePhase(phase.id, { scenarios: [...phase.scenarios, createScenario(phase.scenarios.length + 1)] })}
                                  className="text-sm font-semibold text-[#5e6ad2] hover:text-[#4f5bc4]"
                                >
                                  Add question
                                </button>
                              </div>
                              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => reorderScenarios(phase.id, event)}>
                                <SortableContext items={phase.scenarios.map((scenario) => scenario.id)} strategy={verticalListSortingStrategy}>
                                  <div className="space-y-3">
                                    {phase.scenarios.map((scenario) => (
                                      <SortableCard key={scenario.id} id={scenario.id} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4 pl-11">
                                        <div className="grid gap-3">
                                          <div className="grid gap-3 md:grid-cols-[1fr_150px_110px]">
                                            <input
                                              value={scenario.title}
                                              onChange={(event) => updateScenario(phase.id, scenario.id, { title: event.target.value })}
                                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                                            />
                                            <select
                                              value={scenario.type}
                                              onChange={(event) => updateScenario(phase.id, scenario.id, { type: event.target.value as ScenarioType })}
                                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            >
                                              <option value="decision">Decision</option>
                                              <option value="task">Task</option>
                                              <option value="event">Event</option>
                                            </select>
                                            <input
                                              type="number"
                                              min={1}
                                              value={scenario.timeLimit ?? state.environment.defaultQuestionTimeLimit}
                                              onChange={(event) => updateScenario(phase.id, scenario.id, { timeLimit: Number(event.target.value) })}
                                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                              aria-label="Question time limit"
                                            />
                                          </div>
                                          <textarea
                                            value={scenario.prompt || ''}
                                            onChange={(event) => updateScenario(phase.id, scenario.id, { prompt: event.target.value })}
                                            rows={2}
                                            placeholder="Question prompt shown to the participant."
                                            className="resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                          />
                                          <textarea
                                            value={scenario.description}
                                            onChange={(event) => updateScenario(phase.id, scenario.id, { description: event.target.value })}
                                            rows={2}
                                            placeholder="Context, constraints, and evidence for this question."
                                            className="resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                          />

                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Decision choices</span>
                                              <button
                                                type="button"
                                                onClick={() => updateScenario(phase.id, scenario.id, { choices: [...scenario.choices, createChoice(`Option ${scenario.choices.length + 1}`)] })}
                                                className="text-xs font-semibold text-[#5e6ad2]"
                                              >
                                                Add choice
                                              </button>
                                            </div>
                                            {scenario.choices.map((choice) => (
                                              <div key={choice.id} className="grid gap-2 rounded-lg bg-white p-3 md:grid-cols-[1fr_72px_72px_36px]">
                                                <input
                                                  value={choice.label}
                                                  onChange={(event) => updateChoice(phase.id, scenario.id, choice.id, { label: event.target.value })}
                                                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                                />
                                                <input
                                                  type="number"
                                                  min={0}
                                                  max={100}
                                                  value={choice.risk}
                                                  onChange={(event) => updateChoice(phase.id, scenario.id, choice.id, { risk: Number(event.target.value) })}
                                                  className="rounded-md border border-slate-300 px-2 py-2 text-sm"
                                                  aria-label="Risk"
                                                />
                                                <input
                                                  type="number"
                                                  min={0}
                                                  value={choice.timeCost}
                                                  onChange={(event) => updateChoice(phase.id, scenario.id, choice.id, { timeCost: Number(event.target.value) })}
                                                  className="rounded-md border border-slate-300 px-2 py-2 text-sm"
                                                  aria-label="Time cost"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => updateScenario(phase.id, scenario.id, { choices: scenario.choices.filter((item) => item.id !== choice.id) })}
                                                  className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                  aria-label="Remove choice"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </SortableCard>
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                            </div>

                            <div>
                              <FieldLabel>Required artifacts</FieldLabel>
                              <input
                                value={phase.requiredArtifacts.join(', ')}
                                onChange={(event) =>
                                  updatePhase(phase.id, {
                                    requiredArtifacts: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                                  })
                                }
                                placeholder="Decision memo, roadmap, stakeholder note"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                              />
                            </div>
                          </div>
                          <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                            Phase {phaseIndex + 1}
                          </span>
                        </SortableCard>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </section>
            )}

            {activeTab === 'people' && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Stakeholders</h2>
                    <p className="mt-1 text-sm text-slate-600">These become the characters and influence model inside the simulation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => patchState({ stakeholders: [...state.stakeholders, createStakeholder('', '')] })}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {state.stakeholders.map((stakeholder, index) => (
                    <div key={stakeholder.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={stakeholder.name}
                          onChange={(event) => {
                            const stakeholders = [...state.stakeholders];
                            stakeholders[index] = { ...stakeholder, name: event.target.value };
                            patchState({ stakeholders });
                          }}
                          placeholder="Stakeholder name"
                          className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold"
                        />
                        <input
                          value={stakeholder.role}
                          onChange={(event) => {
                            const stakeholders = [...state.stakeholders];
                            stakeholders[index] = { ...stakeholder, role: event.target.value };
                            patchState({ stakeholders });
                          }}
                          placeholder="Role"
                          className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
                        />
                      </div>
                      <textarea
                        value={stakeholder.description}
                        onChange={(event) => {
                          const stakeholders = [...state.stakeholders];
                          stakeholders[index] = { ...stakeholder, description: event.target.value };
                          patchState({ stakeholders });
                        }}
                        rows={2}
                        placeholder="Motivation, constraints, objections."
                        className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm"
                      />
                      <div className="mt-3 grid gap-4 md:grid-cols-[1fr_1fr_40px]">
                        <label className="text-sm font-semibold text-slate-700">
                          Trust {stakeholder.initialTrust}
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={stakeholder.initialTrust}
                            onChange={(event) => {
                              const stakeholders = [...state.stakeholders];
                              stakeholders[index] = { ...stakeholder, initialTrust: Number(event.target.value) };
                              patchState({ stakeholders });
                            }}
                            className="mt-2 w-full accent-[#5e6ad2]"
                          />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                          Influence {stakeholder.initialInfluence}
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={stakeholder.initialInfluence}
                            onChange={(event) => {
                              const stakeholders = [...state.stakeholders];
                              stakeholders[index] = { ...stakeholder, initialInfluence: Number(event.target.value) };
                              patchState({ stakeholders });
                            }}
                            className="mt-2 w-full accent-[#5e6ad2]"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => patchState({ stakeholders: state.stakeholders.filter((item) => item.id !== stakeholder.id) })}
                          className="self-end rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove stakeholder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'metrics' && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Scoring metrics</h2>
                    <p className="mt-1 text-sm text-slate-600">Metrics are stored in `config.metrics` and can be impacted by choices.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => patchState({ metrics: [...state.metrics, createMetric('', '')] })}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {state.metrics.map((metric, index) => (
                    <div key={metric.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_1fr_90px_90px_90px_36px]">
                      <input
                        value={metric.name}
                        onChange={(event) => {
                          const metrics = [...state.metrics];
                          metrics[index] = { ...metric, name: event.target.value, key: metric.key || slugify(event.target.value) };
                          patchState({ metrics });
                        }}
                        placeholder="Metric name"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                      />
                      <input
                        value={metric.key}
                        onChange={(event) => {
                          const metrics = [...state.metrics];
                          metrics[index] = { ...metric, key: slugify(event.target.value) };
                          patchState({ metrics });
                        }}
                        placeholder="metric_key"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={metric.unit}
                        onChange={(event) => {
                          const metrics = [...state.metrics];
                          metrics[index] = { ...metric, unit: event.target.value };
                          patchState({ metrics });
                        }}
                        placeholder="%"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        value={metric.initialValue}
                        onChange={(event) => {
                          const metrics = [...state.metrics];
                          metrics[index] = { ...metric, initialValue: Number(event.target.value) };
                          patchState({ metrics });
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        value={metric.targetValue}
                        onChange={(event) => {
                          const metrics = [...state.metrics];
                          metrics[index] = { ...metric, targetValue: Number(event.target.value) };
                          patchState({ metrics });
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => patchState({ metrics: state.metrics.filter((item) => item.id !== metric.id) })}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove metric"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'review' && (
              <section className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Review simulation package</h2>
                  <p className="mt-1 text-sm text-slate-600">Confirm the environment is ready before saving or publishing.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Phases', state.phases.length],
                    ['Questions', totalQuestions],
                    ['Stakeholders', state.stakeholders.length],
                    ['Metrics', state.metrics.length],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-950">{state.title || 'Untitled simulation'}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{state.description || 'No description yet.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{state.category.replace('-', ' ')}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{state.difficulty}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{state.environment.totalTimeLimit} min</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{state.environment.workspaceMode}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950 p-5 text-white">
                  <p className="text-sm font-semibold text-white/70">Saved config shape</p>
                  <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-black/30 p-4 text-xs leading-5 text-white/80">
                    {JSON.stringify(buildConfig(), null, 2)}
                  </pre>
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div
                className="h-28"
                style={{
                  background: `linear-gradient(135deg, ${state.branding.primaryColor}, ${state.branding.accentColor})`,
                }}
              />
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
                    {state.branding.companyName?.charAt(0) || state.title.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{state.branding.companyName || 'Company brand'}</p>
                    <p className="text-xs text-slate-500">{state.branding.tone} workspace</p>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{state.title || 'Untitled simulation'}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{state.description || 'Your learners will see this introduction when the simulation starts.'}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <Clock3 className="mb-2 h-4 w-4 text-slate-500" />
                    <strong className="block text-slate-950">{state.environment.totalTimeLimit} min</strong>
                    Duration
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <Users className="mb-2 h-4 w-4 text-slate-500" />
                    <strong className="block text-slate-950">{state.environment.workspaceMode}</strong>
                    Mode
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-bold text-slate-950">Builder shortcuts</h3>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const lastPhase = state.phases[state.phases.length - 1];
                    if (lastPhase) updatePhase(lastPhase.id, { scenarios: [...lastPhase.scenarios, createScenario(lastPhase.scenarios.length + 1)] });
                    setActiveTab('phases');
                  }}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <MessageSquare className="h-4 w-4" />
                  Add question to last phase
                </button>
                <button
                  type="button"
                  onClick={() => {
                    patchState({ phases: [...state.phases, createPhase(state.phases.length + 1)] });
                    setActiveTab('phases');
                  }}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="h-4 w-4" />
                  Add another phase
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('environment')}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Image className="h-4 w-4" />
                  Update branding
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className="flex items-center gap-2 rounded-lg bg-[#5e6ad2]/10 px-3 py-2 text-sm font-semibold text-[#5e6ad2] hover:bg-[#5e6ad2]/15"
                >
                  <Sparkles className="h-4 w-4" />
                  Review config
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </OrgLayout>
  );
}
