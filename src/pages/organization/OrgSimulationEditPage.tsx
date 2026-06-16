import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { useOrganization, useSimulations } from '../../hooks/organization';
import {
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  FileText,
  Users,
  BarChart3,
  Check,
  CheckCircle,
  Plus,
  Trash2,
  GripVertical,
  AlertTriangle,
  Save,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import type { SimulationCategory, OrganizationRole } from '../../lib/organization/types';

const steps = [
  { id: 'template', label: 'Template', icon: LayoutTemplate },
  { id: 'info', label: 'Basic Info', icon: FileText },
  { id: 'scenarios', label: 'Scenarios', icon: AlertTriangle },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

const templates = [
  {
    id: 'pm01',
    name: 'PM-01: The Growth Stall',
    description: 'Help ScaleFlow diagnose and reverse their growth slowdown in this realistic product management simulation.',
    category: 'project-management',
    difficulty: 'intermediate',
    duration: 120,
    thumbnail: '📈',
  },
  {
    id: 'blank',
    name: 'Blank Simulation',
    description: 'Start from scratch and build your own custom simulation with full control over every detail.',
    category: 'custom',
    difficulty: 'advanced',
    duration: 0,
    thumbnail: '📝',
  },
];

const difficultyColors = {
  beginner: 'text-green-600 bg-green-100',
  intermediate: 'text-blue-600 bg-blue-100',
  advanced: 'text-purple-600 bg-purple-100',
};

const targetRolesList = [
  { id: 'admin', label: 'Admin', description: 'Full access to simulation settings and analytics' },
  { id: 'editor', label: 'Editor', description: 'Can modify simulation content and scenarios' },
  { id: 'viewer', label: 'Viewer', description: 'Read-only access to simulation results' },
];

type FormData = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  templateId: string;
  targetRoles: string[];
  scenarios: { id: string; title: string; description: string; type: 'decision' | 'event' | 'task' }[];
  stakeholders: { id: string; name: string; role: string; trust: number; influence: number }[];
  metrics: { id: string; name: string; key: string; initialValue: number; targetValue: number; unit: string }[];
};

export default function OrgSimulationEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const { updateSimulation } = useSimulations(organization?.id || '');

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'project-management',
    difficulty: 'intermediate',
    duration: 120,
    templateId: '',
    targetRoles: [],
    scenarios: [
      { id: '1', title: '', description: '', type: 'decision' },
    ],
    stakeholders: [
      { id: '1', name: '', role: '', trust: 50, influence: 50 },
    ],
    metrics: [
      { id: '1', name: '', key: '', initialValue: 0, targetValue: 100, unit: '%' },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!id || !organization?.id) return;

      try {
        const { supabase } = await import('../../lib/supabase');
        const { data, error } = await supabase
          .from('organization_simulations')
          .select('*')
          .eq('id', id)
          .eq('organization_id', organization.id)
          .single();

        if (error) throw error;
        if (!data) {
          setFetchError('Simulation not found');
          return;
        }

        const config = data.config || {};
        const phases = config.phases || [];
        const scenarios: FormData['scenarios'] = [];

        phases.forEach((phase: { scenarios?: { id: string; title: string; description: string; type: string }[] }) => {
          if (phase.scenarios) {
            phase.scenarios.forEach((s) => {
              scenarios.push({
                id: s.id,
                title: s.title,
                description: s.description,
                type: (s.type as 'decision' | 'event' | 'task') || 'decision',
              });
            });
          }
        });

        const stakeholders = (config.stakeholders || []).map((s: { id: string; name: string; role: string; initialTrust: number; initialInfluence: number }) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          trust: s.initialTrust ?? 50,
          influence: s.initialInfluence ?? 50,
        }));

        const metrics = (config.metrics || []).map((m: { id: string; name: string; key: string; initialValue: number; targetValue: number; unit: string }) => ({
          id: m.id,
          name: m.name,
          key: m.key,
          initialValue: m.initialValue ?? 0,
          targetValue: m.targetValue ?? 100,
          unit: m.unit ?? '%',
        }));

        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'project-management',
          difficulty: data.difficulty || 'intermediate',
          duration: config.timeLimit ?? 120,
          templateId: data.templateId || '',
          targetRoles: data.targetRoles || [],
          scenarios: scenarios.length > 0 ? scenarios : [{ id: '1', title: '', description: '', type: 'decision' }],
          stakeholders: stakeholders.length > 0 ? stakeholders : [{ id: '1', name: '', role: '', trust: 50, influence: 50 }],
          metrics: metrics.length > 0 ? metrics : [{ id: '1', name: '', key: '', initialValue: 0, targetValue: 100, unit: '%' }],
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch simulation');
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [id, organization?.id]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateSimulation(id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as SimulationCategory,
        config: {
          phases: [{
            id: 'phase-1',
            name: 'Main Phase',
            description: formData.description,
            order: 1,
            scenarios: formData.scenarios,
            requiredArtifacts: [],
            unlockConditions: [],
          }],
          stakeholders: formData.stakeholders.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            initialTrust: s.trust,
            initialInfluence: s.influence,
            description: '',
          })),
          metrics: formData.metrics.map((m) => ({
            id: m.id,
            name: m.name,
            key: m.key,
            initialValue: m.initialValue,
            targetValue: m.targetValue,
            unit: m.unit,
            minThreshold: 0,
            maxThreshold: 100,
          })),
          timeLimit: formData.duration,
        },
        templateId: formData.templateId,
        targetRoles: formData.targetRoles as OrganizationRole[],
      });
      navigate('/org/simulations');
    } catch (err) {
      console.error('Failed to save simulation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateSimulation(id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as SimulationCategory,
        status: 'published',
        publishedAt: new Date().toISOString(),
        config: {
          phases: [{
            id: 'phase-1',
            name: 'Main Phase',
            description: formData.description,
            order: 1,
            scenarios: formData.scenarios,
            requiredArtifacts: [],
            unlockConditions: [],
          }],
          stakeholders: formData.stakeholders.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            initialTrust: s.trust,
            initialInfluence: s.influence,
            description: '',
          })),
          metrics: formData.metrics.map((m) => ({
            id: m.id,
            name: m.name,
            key: m.key,
            initialValue: m.initialValue,
            targetValue: m.targetValue,
            unit: m.unit,
            minThreshold: 0,
            maxThreshold: 100,
          })),
          timeLimit: formData.duration,
        },
        templateId: formData.templateId,
        targetRoles: formData.targetRoles as OrganizationRole[],
      });
      navigate('/org/simulations');
    } catch (err) {
      console.error('Failed to publish simulation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTargetRole = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(roleId)
        ? prev.targetRoles.filter((r) => r !== roleId)
        : [...prev.targetRoles, roleId],
    }));
  };

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  if (loading) {
    return (
      <OrgLayout sidebar={sidebar} header={header}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading simulation data...</p>
          </div>
        </div>
      </OrgLayout>
    );
  }

  if (fetchError) {
    return (
      <OrgLayout sidebar={sidebar} header={header}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Simulation</h2>
            <p className="text-gray-600 mb-6">{fetchError}</p>
            <button
              onClick={() => navigate('/org/simulations')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Simulations
            </button>
          </div>
        </div>
      </OrgLayout>
    );
  }

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/org/simulations')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Simulation</h1>
              <p className="text-gray-600">Update your simulation settings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isLast = index === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => index <= currentStep && setCurrentStep(index)}
                    disabled={index > currentStep}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      'font-medium hidden lg:block',
                      isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    )}>
                      {step.label}
                    </span>
                  </button>
                  {!isLast && (
                    <div
                      className={cn(
                        'flex-1 h-1 mx-2',
                        index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Step 1: Template Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Template</h2>
                <p className="text-gray-600">View or change the template for this simulation</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setFormData({ ...formData, templateId: template.id })}
                    className={cn(
                      'relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md',
                      formData.templateId === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {formData.templateId === template.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="text-4xl mb-4">{template.thumbnail}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        difficultyColors[template.difficulty as keyof typeof difficultyColors]
                      )}>
                        {template.difficulty}
                      </span>
                      {template.duration > 0 && (
                        <span className="text-xs text-gray-500">
                          {template.duration} min
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Update the essential details about your simulation</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Simulation Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., PM-01: The Growth Stall"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the scenario and learning objectives..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Roles
                  </label>
                  <div className="space-y-2">
                    {targetRolesList.map((role) => (
                      <label
                        key={role.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          formData.targetRoles.includes(role.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetRoles.includes(role.id)}
                          onChange={() => handleToggleTargetRole(role.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{role.label}</span>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="project-management">Project Management</option>
                      <option value="crisis-management">Crisis Management</option>
                      <option value="team-building">Team Building</option>
                      <option value="strategic-planning">Strategic Planning</option>
                      <option value="stakeholder-management">Stakeholder Management</option>
                      <option value="product-launch">Product Launch</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scenarios */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Scenarios</h2>
                <p className="text-gray-600">Edit the scenarios and decisions in your simulation</p>
              </div>
              <div className="space-y-4">
                {formData.scenarios.map((scenario, index) => (
                  <div key={scenario.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">Scenario {index + 1}</span>
                      </div>
                      {formData.scenarios.length > 1 && (
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              scenarios: formData.scenarios.filter((_, i) => i !== index),
                            });
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={scenario.title}
                        onChange={(e) => {
                          const newScenarios = [...formData.scenarios];
                          newScenarios[index].title = e.target.value;
                          setFormData({ ...formData, scenarios: newScenarios });
                        }}
                        placeholder="e.g., Analyze Metrics"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={scenario.description}
                        onChange={(e) => {
                          const newScenarios = [...formData.scenarios];
                          newScenarios[index].description = e.target.value;
                          setFormData({ ...formData, scenarios: newScenarios });
                        }}
                        placeholder="Describe the scenario..."
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      scenarios: [
                        ...formData.scenarios,
                        { id: String(Date.now()), title: '', description: '', type: 'decision' },
                      ],
                    });
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Scenario
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Stakeholders */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Stakeholders</h2>
                <p className="text-gray-600">Edit the key characters in your simulation</p>
              </div>
              <div className="space-y-4">
                {formData.stakeholders.map((stakeholder, index) => (
                  <div key={stakeholder.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">Stakeholder {index + 1}</span>
                      </div>
                      {formData.stakeholders.length > 1 && (
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              stakeholders: formData.stakeholders.filter((_, i) => i !== index),
                            });
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={stakeholder.name}
                          onChange={(e) => {
                            const newStakeholders = [...formData.stakeholders];
                            newStakeholders[index].name = e.target.value;
                            setFormData({ ...formData, stakeholders: newStakeholders });
                          }}
                          placeholder="e.g., Sarah Chen"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          value={stakeholder.role}
                          onChange={(e) => {
                            const newStakeholders = [...formData.stakeholders];
                            newStakeholders[index].role = e.target.value;
                            setFormData({ ...formData, stakeholders: newStakeholders });
                          }}
                          placeholder="e.g., CEO"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Initial Trust: {stakeholder.trust}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stakeholder.trust}
                          onChange={(e) => {
                            const newStakeholders = [...formData.stakeholders];
                            newStakeholders[index].trust = parseInt(e.target.value);
                            setFormData({ ...formData, stakeholders: newStakeholders });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Influence Level: {stakeholder.influence}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stakeholder.influence}
                          onChange={(e) => {
                            const newStakeholders = [...formData.stakeholders];
                            newStakeholders[index].influence = parseInt(e.target.value);
                            setFormData({ ...formData, stakeholders: newStakeholders });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      stakeholders: [
                        ...formData.stakeholders,
                        { id: String(Date.now()), name: '', role: '', trust: 50, influence: 50 },
                      ],
                    });
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Stakeholder
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Metrics */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Metrics</h2>
                <p className="text-gray-600">Edit the key performance indicators for your simulation</p>
              </div>
              <div className="space-y-4">
                {formData.metrics.map((metric, index) => (
                  <div key={metric.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">Metric {index + 1}</span>
                      </div>
                      {formData.metrics.length > 1 && (
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              metrics: formData.metrics.filter((_, i) => i !== index),
                            });
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={metric.name}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].name = e.target.value;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          placeholder="e.g., Customer Satisfaction"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
                        <input
                          type="text"
                          value={metric.key}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].key = e.target.value;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          placeholder="e.g., csat"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <input
                          type="text"
                          value={metric.unit}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].unit = e.target.value;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          placeholder="%, $, days"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Initial Value</label>
                        <input
                          type="number"
                          value={metric.initialValue}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].initialValue = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                        <input
                          type="number"
                          value={metric.targetValue}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].targetValue = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      metrics: [
                        ...formData.metrics,
                        { id: String(Date.now()), name: '', key: '', initialValue: 0, targetValue: 100, unit: '' },
                      ],
                    });
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Metric
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h2>
                <p className="text-gray-600">Review your simulation before saving changes</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Title</span>
                      <span className="text-gray-900">{formData.title || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="text-gray-900 capitalize">{formData.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Difficulty</span>
                      <span className="text-gray-900 capitalize">{formData.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-gray-900">{formData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Roles</span>
                      <span className="text-gray-900">
                        {formData.targetRoles.length > 0
                          ? formData.targetRoles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
                          : 'None selected'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Content Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{formData.scenarios.length}</p>
                      <p className="text-sm text-gray-500">Scenarios</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{formData.stakeholders.length}</p>
                      <p className="text-sm text-gray-500">Stakeholders</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{formData.metrics.length}</p>
                      <p className="text-sm text-gray-500">Metrics</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Publishing will update the live version of your simulation.
                  You can always edit it later.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors',
                  saving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
