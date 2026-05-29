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
import { Clock } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'pending', label: 'Pending', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'completed', label: 'Completed', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
] as const

export function TimelinePhasesSection() {
  const { formData, updateBriefingField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['timeline'] ?? []
  const phases = formData.briefing.timelinePhases ?? []

  const addPhase = () => {
    const newPhase = {
      id: `phase-${Date.now()}`,
      name: '',
      status: 'pending' as const,
      description: '',
    }
    updateBriefingField('timelinePhases', [...phases, newPhase])
  }

  const updatePhase = (index: number, field: keyof typeof phases[0], value: unknown) => {
    const updated = [...phases]
    updated[index] = { ...updated[index], [field]: value }
    updateBriefingField('timelinePhases', updated)
  }

  const removePhase = (index: number) => {
    updateBriefingField('timelinePhases', phases.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (phases.length > 0 && phases.every(p => p.name && p.description)) {
      markSectionComplete('timeline')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.className ?? 'border-[#23252a] text-[#8a8f98]'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Timeline Phases"
        description="Define the project phases and milestones"
        buttonLabel="Add Phase"
        onAdd={addPhase}
      />

      {phases.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No timeline phases defined"
          description="Add phases that structure the simulation timeline"
          buttonLabel="Add First Phase"
          onAdd={addPhase}
        />
      ) : (
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <ItemCard
              key={phase.id}
              badges={[{ label: phase.status, className: getStatusBadgeClass(phase.status) }]}
              onRemove={() => removePhase(index)}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormFieldLabel>Phase Name</FormFieldLabel>
                  <Input
                    value={phase.name}
                    onChange={(e) => updatePhase(index, 'name', e.target.value)}
                    placeholder="e.g., Crisis Assessment"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Status</FormFieldLabel>
                  <SelectButtonGroup
                    options={[...STATUS_OPTIONS]}
                    value={phase.status}
                    onChange={(value) => updatePhase(index, 'status', value)}
                  />
                </div>
              </div>

              <div>
                <FormFieldLabel>Description</FormFieldLabel>
                <textarea
                  value={phase.description}
                  onChange={(e) => updatePhase(index, 'description', e.target.value)}
                  placeholder="Describe what happens in this phase..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:ring-2 focus:ring-[#7170ff] resize-none"
                />
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      {phases.length > 0 && <SectionCompleteButton onComplete={handleComplete} />}
    </div>
  )
}
