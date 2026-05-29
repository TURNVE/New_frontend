import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Info,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { simulationTemplates } from '@/config/simulationTemplates'
import {
  SimulationFormProvider,
  useSimulationForm,
} from './context/SimulationFormContext'
import { BasicInfoSection } from './components/BasicInfoSection'
import { CompanyBrandingSection } from './components/CompanyBrandingSection'
import { ChallengeConfigSection } from './components/ChallengeConfigSection'
import { FinancialConfigSection } from './components/FinancialConfigSection'
import { KPISection } from './components/KPISection'
import { StakeholdersSection } from './components/StakeholdersSection'
import { SuccessCriteriaSection } from './components/SuccessCriteriaSection'
import { TimelinePhasesSection } from './components/TimelinePhasesSection'
import { RisksSection } from './components/RisksSection'
import { TasksSection } from './components/TasksSection'
import { WeeklyContentSection } from './components/WeeklyContentSection'
import { EvaluationSection } from './components/EvaluationSection'

interface FormSection {
  id: string
  label: string
  description: string
  component: React.ComponentType
}

const FORM_SECTIONS: FormSection[] = [
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
]

function EditSimulationContent() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    formData,
    currentSection,
    setCurrentSection,
    completedSections,
    isDirty,
    validationErrors,
    setFormData,
    setIsEditMode,
    validateSection,
  } = useSimulationForm()

  const currentSectionData = FORM_SECTIONS[currentSection]
  const CurrentComponent = currentSectionData.component

  // Load simulation data
  useEffect(() => {
    const loadSimulation = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // First check if it's a built-in template
        const template = simulationTemplates[id || '']
        
        if (template) {
          setFormData(template)
          setIsEditMode(true)
        } else {
          // TODO: Fetch from API for custom simulations
          setError('Simulation not found')
        }
      } catch (err) {
        console.error('Failed to load simulation:', err)
        setError('Failed to load simulation')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadSimulation()
    }
  }, [id, setFormData, setIsEditMode])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Validate all sections
      let allValid = true
      for (const section of FORM_SECTIONS) {
        const isValid = validateSection(section.id)
        if (!isValid) allValid = false
      }

      if (!allValid) {
        // Find first invalid section
        const firstInvalid = FORM_SECTIONS.find(
          (s) => validationErrors[s.id]?.length > 0
        )
        if (firstInvalid) {
          setCurrentSection(FORM_SECTIONS.findIndex((s) => s.id === firstInvalid.id))
        }
        return
      }

      // TODO: Call API to save simulation
      console.log('Saving simulation:', formData)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      navigate('/admin/simulations')
    } catch (err) {
      console.error('Failed to save simulation:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = () => {
    // Validate current section before proceeding
    const isValid = validateSection(currentSectionData.id)
    
    if (isValid && currentSection < FORM_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleExit = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
        navigate('/admin/simulations')
      }
    } else {
      navigate('/admin/simulations')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8a8f98]">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading simulation...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center">
        <Card className="bg-[#111418] border-[#23252a] p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-[#f7f8f8] mb-2">Error</h2>
          <p className="text-[#8a8f98] mb-4">{error}</p>
          <Button
            onClick={() => navigate('/admin/simulations')}
            className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
          >
            Back to Simulations
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f11]">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#f7f8f8]">Edit Simulation</h1>
            <p className="text-[#8a8f98] mt-1">
              Step {currentSection + 1} of {FORM_SECTIONS.length}: {currentSectionData.label}
              {isDirty && <span className="ml-2 text-yellow-500">• Unsaved changes</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExit}
              className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Header */}
        <Card className="bg-[#111418] border-[#23252a] mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-[#f7f8f8]">
                  Step {currentSection + 1} of {FORM_SECTIONS.length}
                </h2>
                <p className="text-sm text-[#8a8f98] mt-1">
                  {currentSectionData.description}
                </p>
              </div>
              <Badge variant="outline" className="border-green-500/20 text-green-500">
                {completedSections.length}/{FORM_SECTIONS.length} Complete
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-2 bg-[#1a1d21] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#7170ff] rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / FORM_SECTIONS.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {FORM_SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={cn(
                      'w-3 h-3 rounded-full transition-all duration-200',
                      index === currentSection
                        ? 'bg-[#7170ff] ring-2 ring-[#7170ff]/50'
                        : completedSections.includes(section.id)
                          ? 'bg-green-500'
                          : validationErrors[section.id]?.length > 0
                            ? 'bg-red-500'
                            : 'bg-[#23252a]'
                    )}
                    title={section.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-[#111418] border-[#23252a] sticky top-8">
              <div className="p-4">
                <h3 className="text-sm font-medium text-[#f7f8f8] mb-4">Sections</h3>
                <nav className="space-y-1">
                  {FORM_SECTIONS.map((section, index) => {
                    const isActive = index === currentSection
                    const isCompleted = completedSections.includes(section.id)
                    const hasErrors = validationErrors[section.id]?.length > 0

                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(index)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left',
                          isActive
                            ? 'bg-[#5e6ad2]/10 text-[#7170ff] border border-[#5e6ad2]/20'
                            : isCompleted
                              ? 'text-green-500 hover:bg-[rgba(255,255,255,0.02)]'
                              : hasErrors
                                ? 'text-red-500 hover:bg-red-500/5'
                                : 'text-[#8a8f98] hover:bg-[rgba(255,255,255,0.02)] hover:text-[#d0d6e0]'
                        )}
                      >
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                            isActive
                              ? 'bg-[#7170ff] text-white'
                              : isCompleted
                                ? 'bg-green-500/10 text-green-500'
                                : hasErrors
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-[#23252a] text-[#8a8f98]'
                          )}
                        >
                          {isCompleted ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="flex-1 truncate">{section.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <Card className="bg-[#111418] border-[#23252a] min-h-[500px]">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-[#7170ff]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#f7f8f8]">
                      {currentSectionData.label}
                    </h3>
                    <p className="text-sm text-[#8a8f98] mt-1">
                      {currentSectionData.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#23252a] pt-8">
                  <CurrentComponent />
                </div>
              </div>
            </Card>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleExit}
                className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentSection === FORM_SECTIONS.length - 1}
                  className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
                >
                  {currentSection === FORM_SECTIONS.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EditSimulationPage() {
  return (
    <SimulationFormProvider>
      <EditSimulationContent />
    </SimulationFormProvider>
  )
}

export default EditSimulationPage
