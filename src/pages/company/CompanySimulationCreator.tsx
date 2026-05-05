import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import {
  SimulationFormProvider,
  useSimulationForm,
} from '../admin/simulations/context/SimulationFormContext';
import { BasicInfoSection } from '../admin/simulations/components/BasicInfoSection';
import { CompanyBrandingSection } from '../admin/simulations/components/CompanyBrandingSection';
import { ChallengeConfigSection } from '../admin/simulations/components/ChallengeConfigSection';
import { FinancialConfigSection } from '../admin/simulations/components/FinancialConfigSection';
import { KPISection } from '../admin/simulations/components/KPISection';
import { StakeholdersSection } from '../admin/simulations/components/StakeholdersSection';
import { SuccessCriteriaSection } from '../admin/simulations/components/SuccessCriteriaSection';
import { TimelinePhasesSection } from '../admin/simulations/components/TimelinePhasesSection';
import { RisksSection } from '../admin/simulations/components/RisksSection';
import { TasksSection } from '../admin/simulations/components/TasksSection';
import { WeeklyContentSection } from '../admin/simulations/components/WeeklyContentSection';
import { EvaluationSection } from '../admin/simulations/components/EvaluationSection';

const FORM_SECTIONS: { id: string; label: string; description: string; component: React.ComponentType<any> }[] = [
  { id: 'basic', label: 'Basic Info', description: 'Simulation key, name, and configuration', component: BasicInfoSection },
  { id: 'branding', label: 'Company Branding', description: 'Company details and visual identity', component: CompanyBrandingSection },
  { id: 'challenge', label: 'Challenge & Context', description: 'Simulation scenario and context', component: ChallengeConfigSection },
  { id: 'financial', label: 'Financial Config', description: 'Budget and thresholds', component: FinancialConfigSection },
  { id: 'kpis', label: 'KPIs', description: 'Key performance indicators', component: KPISection },
  { id: 'stakeholders', label: 'Stakeholders', description: 'Character configurations', component: StakeholdersSection },
  { id: 'success', label: 'Success Criteria', description: 'Win conditions', component: SuccessCriteriaSection },
  { id: 'timeline', label: 'Timeline Phases', description: 'Project phases and milestones', component: TimelinePhasesSection },
  { id: 'risks', label: 'Risks', description: 'Potential project risks', component: RisksSection },
  { id: 'tasks', label: 'Tasks', description: 'Simulation tasks', component: TasksSection },
  { id: 'weekly', label: 'Weekly Content', description: 'Per-week signals, events, actions', component: WeeklyContentSection },
  { id: 'evaluation', label: 'Evaluation', description: 'Rubrics and scoring', component: EvaluationSection },
];

function CompanySimulationCreatorContent() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    currentSection,
    setCurrentSection,
    completedSections,
    isDirty,
    validationErrors,
    validateSection,
    resetForm,
  } = useSimulationForm();

  const currentSectionData = FORM_SECTIONS[currentSection];
  const CurrentComponent = currentSectionData.component;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    const isValid = validateSection(currentSectionData.id);
    if (isValid && currentSection < FORM_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleExit = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
        resetForm();
        navigate('/company/simulations');
      }
    } else {
      navigate('/company/simulations');
    }
  };

  const handleFinish = async () => {
    let allValid = true;
    for (const section of FORM_SECTIONS) {
      const isValid = validateSection(section.id);
      if (!isValid) allValid = false;
    }

    if (allValid) {
      navigate('/company/simulations');
    } else {
      const firstInvalid = FORM_SECTIONS.find(
        (s) => validationErrors[s.id]?.length > 0
      );
      if (firstInvalid) {
        setCurrentSection(FORM_SECTIONS.findIndex((s) => s.id === firstInvalid.id));
      }
    }
  };

  const progress = completedSections.length;
  const total = FORM_SECTIONS.length;
  const progressPercent = Math.round((progress / total) * 100);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Simulation</h1>
          <p className="text-[#8a8f98] mt-1">
            Step {currentSection + 1} of {total} - {currentSectionData.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-[#8a8f98]">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={handleExit}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#8a8f98]">Progress</span>
          <span className="text-sm text-[#8a8f98]">{progress}/{total} sections</span>
        </div>
        <div className="w-full bg-[#23252a] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#5e6ad2] to-[#7170ff] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4 sticky top-8">
            <h3 className="text-sm font-semibold text-white mb-3">Sections</h3>
            <div className="space-y-1">
              {FORM_SECTIONS.map((section, index) => {
                const isCurrent = index === currentSection;
                const isCompleted = completedSections.includes(section.id);
                const hasErrors = validationErrors[section.id]?.length > 0;

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      if (isCurrent) return;
                      if (isCompleted) {
                        setCurrentSection(index);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left',
                      isCurrent
                        ? 'bg-[#5e6ad2]/10 text-[#7170ff] border border-[#5e6ad2]/20'
                        : isCompleted
                        ? 'text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]'
                        : 'text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs',
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#5e6ad2] text-white'
                          : 'bg-[#23252a] text-[#8a8f98]'
                      )}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className="flex-1">{section.label}</span>
                    {hasErrors && <span className="text-[10px] text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-500/20">!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-1">{currentSectionData.label}</h2>
            <p className="text-sm text-[#8a8f98] mb-6">{currentSectionData.description}</p>
            <CurrentComponent />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-2">
              {currentSection === FORM_SECTIONS.length - 1 ? (
                <Button size="sm" onClick={handleFinish}>
                  Finish
                </Button>
              ) : (
                <Button size="sm" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanySimulationCreator() {
  return (
    <SimulationFormProvider>
      <CompanySimulationCreatorContent />
    </SimulationFormProvider>
  );
}

export default CompanySimulationCreator;