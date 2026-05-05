/**
 * Simulation Form Context
 * Provides shared state management for simulation creation and editing
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { SimulationTemplate } from '@/config/simulationTemplates'

// Empty template for new simulations
export const emptySimulationTemplate: SimulationTemplate = {
  id: '',
  route: '',
  name: '',
  companyName: '',
  industry: '',
  archetype: 'crisis',
  logo: '',
  primaryColor: '#5e6ad2',
  description: '',
  founded: '',
  employees: '',
  headquarters: '',
  budget: 0,
  fundingStatus: '',
  challenge: '',
  challengeDetails: '',
  briefing: {
    id: '',
    title: '',
    description: '',
    totalWeeks: 12,
    clientName: '',
    projectType: '',
    budget: 0,
    teamSize: 0,
    kpis: [],
    successCriteria: [],
    timelinePhases: [],
    stakeholders: [],
    keyDecisions: [],
    currentRisks: [],
    marketContext: '',
    technicalStack: '',
  },
  tasks: [],
  difficulty: 'intermediate',
  durationHours: 40,
  passThreshold: 60,
  strongPassThreshold: 80,
}

interface SimulationFormContextType {
  // Form data
  formData: SimulationTemplate
  setFormData: (data: SimulationTemplate | ((prev: SimulationTemplate) => SimulationTemplate)) => void
  
  // Form state
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  validationErrors: Record<string, string[]>
  setValidationErrors: (errors: Record<string, string[]>) => void
  
  // Navigation
  currentSection: number
  setCurrentSection: (section: number) => void
  completedSections: string[]
  markSectionComplete: (sectionId: string) => void
  markSectionIncomplete: (sectionId: string) => void
  
  // Actions
  updateField: <K extends keyof SimulationTemplate>(field: K, value: SimulationTemplate[K]) => void
  updateBriefingField: <K extends keyof SimulationTemplate['briefing']>(
    field: K,
    value: SimulationTemplate['briefing'][K]
  ) => void
  validateSection: (sectionId: string) => boolean
  resetForm: () => void
  
  // Mode
  isEditMode: boolean
  setIsEditMode: (isEdit: boolean) => void
}

const SimulationFormContext = createContext<SimulationFormContextType | undefined>(undefined)

interface SimulationFormProviderProps {
  children: ReactNode
  initialData?: SimulationTemplate
}

const FORM_SECTIONS = [
  'basic',
  'branding',
  'challenge',
  'financial',
  'kpis',
  'stakeholders',
  'success',
  'timeline',
  'risks',
  'tasks',
  'weekly',
  'evaluation',
]

export function SimulationFormProvider({ children, initialData }: SimulationFormProviderProps) {
  const [formData, setFormData] = useState<SimulationTemplate>(
    initialData || emptySimulationTemplate
  )
  const [isDirty, setIsDirty] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [isEditMode, setIsEditMode] = useState(!!initialData?.id)

  const updateField = useCallback(<K extends keyof SimulationTemplate>(
    field: K,
    value: SimulationTemplate[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsDirty(true)
  }, [])

  const updateBriefingField = useCallback(<K extends keyof SimulationTemplate['briefing']>(
    field: K,
    value: SimulationTemplate['briefing'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      briefing: {
        ...prev.briefing,
        [field]: value,
      },
    }))
    setIsDirty(true)
  }, [])

  const markSectionComplete = useCallback((sectionId: string) => {
    setCompletedSections((prev) => {
      if (prev.includes(sectionId)) return prev
      return [...prev, sectionId]
    })
  }, [])

  const markSectionIncomplete = useCallback((sectionId: string) => {
    setCompletedSections((prev) => prev.filter((id) => id !== sectionId))
  }, [])

  const validateSection = useCallback((sectionId: string): boolean => {
    const errors: string[] = []

    switch (sectionId) {
      case 'basic':
        if (!formData.id?.trim()) errors.push('Simulation ID is required')
        if (!formData.name?.trim()) errors.push('Simulation name is required')
        if (!formData.route?.trim()) errors.push('Route is required')
        if (!formData.archetype) errors.push('Archetype is required')
        if (!formData.difficulty) errors.push('Difficulty is required')
        break
      case 'branding':
        if (!formData.companyName?.trim()) errors.push('Company name is required')
        if (!formData.description?.trim()) errors.push('Description is required')
        if (!formData.industry?.trim()) errors.push('Industry is required')
        if (!formData.founded?.trim()) errors.push('Founded year is required')
        if (!formData.employees?.trim()) errors.push('Employee count is required')
        if (!formData.headquarters?.trim()) errors.push('Headquarters is required')
        break
      case 'challenge':
        if (!formData.challenge?.trim()) errors.push('Challenge title is required')
        if (!formData.challengeDetails?.trim()) errors.push('Challenge details are required')
        break
      case 'financial':
        if (formData.budget <= 0) errors.push('Budget must be greater than 0')
        if (!formData.fundingStatus?.trim()) errors.push('Funding status is required')
        if (formData.durationHours <= 0) errors.push('Duration must be greater than 0')
        if (formData.passThreshold <= 0 || formData.passThreshold > 100) {
          errors.push('Pass threshold must be between 1 and 100')
        }
        break
      case 'kpis':
        if (formData.briefing.kpis.length === 0) errors.push('At least one KPI is required')
        break
      case 'stakeholders':
        if (formData.briefing.stakeholders.length === 0) errors.push('At least one stakeholder is required')
        break
      case 'success':
        if (formData.briefing.successCriteria.length === 0) errors.push('At least one success criterion is required')
        break
      case 'timeline':
        if (formData.briefing.timelinePhases.length === 0) errors.push('At least one timeline phase is required')
        break
      case 'tasks':
        if (formData.tasks.length === 0) errors.push('At least one task is required')
        break
    }

    setValidationErrors((prev) => ({
      ...prev,
      [sectionId]: errors,
    }))

    if (errors.length === 0) {
      markSectionComplete(sectionId)
      return true
    } else {
      markSectionIncomplete(sectionId)
      return false
    }
  }, [formData, markSectionComplete, markSectionIncomplete])

  const resetForm = useCallback(() => {
    setFormData(emptySimulationTemplate)
    setIsDirty(false)
    setValidationErrors({})
    setCurrentSection(0)
    setCompletedSections([])
    setIsEditMode(false)
  }, [])

  return (
    <SimulationFormContext.Provider
      value={{
        formData,
        setFormData,
        isDirty,
        setIsDirty,
        validationErrors,
        setValidationErrors,
        currentSection,
        setCurrentSection,
        completedSections,
        markSectionComplete,
        markSectionIncomplete,
        updateField,
        updateBriefingField,
        validateSection,
        resetForm,
        isEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </SimulationFormContext.Provider>
  )
}

export function useSimulationForm() {
  const context = useContext(SimulationFormContext)
  if (context === undefined) {
    throw new Error('useSimulationForm must be used within a SimulationFormProvider')
  }
  return context
}

export { FORM_SECTIONS }
