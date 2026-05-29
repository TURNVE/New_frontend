import { useSimulationForm } from '../context/SimulationFormContext'
import { Input } from '@/components/ui/input'
import {
  ValidationErrors,
  SectionHeader,
  EmptyState,
  ItemCard,
  SectionCompleteButton,
  FormFieldLabel,
  SelectButtonGroup,
} from './shared/FormComponents'
import { CheckCircle2 } from 'lucide-react'

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { value: 'medium', label: 'Medium', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'low', label: 'Low', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
] as const

export function SuccessCriteriaSection() {
  const { formData, updateBriefingField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['success'] ?? []
  const criteria = formData.briefing.successCriteria ?? []

  const addCriterion = () => {
    const newCriterion = {
      id: `criterion-${Date.now()}`,
      description: '',
      completed: false,
      weekDue: 1,
      priority: 'high' as const,
    }
    updateBriefingField('successCriteria', [...criteria, newCriterion])
  }

  const updateCriterion = (index: number, field: keyof typeof criteria[0], value: unknown) => {
    const updated = [...criteria]
    updated[index] = { ...updated[index], [field]: value }
    updateBriefingField('successCriteria', updated)
  }

  const removeCriterion = (index: number) => {
    updateBriefingField('successCriteria', criteria.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (criteria.length > 0 && criteria.every(c => c.description)) {
      markSectionComplete('success')
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority)?.className ?? 'border-[#23252a] text-[#8a8f98]'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Success Criteria"
        description="Define what players must accomplish to succeed"
        buttonLabel="Add Criterion"
        onAdd={addCriterion}
      />

      {criteria.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No success criteria defined"
          description="Add criteria that define how players will be evaluated"
          buttonLabel="Add First Criterion"
          onAdd={addCriterion}
        />
      ) : (
        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <ItemCard
              key={criterion.id}
              badges={[
                { label: criterion.priority, className: getPriorityBadgeClass(criterion.priority) },
                { label: `Week ${criterion.weekDue}`, className: 'border-[#23252a] text-[#8a8f98]' },
              ]}
              onRemove={() => removeCriterion(index)}
            >
              <div className="mb-4">
                <FormFieldLabel>Description</FormFieldLabel>
                <Input
                  value={criterion.description}
                  onChange={(e) => updateCriterion(index, 'description', e.target.value)}
                  placeholder="e.g., Complete crisis assessment within 6 hours"
                  className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel>Due Week</FormFieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={formData.briefing.totalWeeks}
                    value={criterion.weekDue}
                    onChange={(e) => updateCriterion(index, 'weekDue', parseInt(e.target.value))}
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Priority</FormFieldLabel>
                  <SelectButtonGroup
                    options={[...PRIORITY_OPTIONS]}
                    value={criterion.priority}
                    onChange={(value) => updateCriterion(index, 'priority', value)}
                  />
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      {criteria.length > 0 && <SectionCompleteButton onComplete={handleComplete} />}
    </div>
  )
}
