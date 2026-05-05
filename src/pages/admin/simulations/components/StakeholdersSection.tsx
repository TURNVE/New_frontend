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
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const COMMUNICATION_STYLES = [
  { value: 'direct', label: 'Direct' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'formal', label: 'Formal' },
  { value: 'collaborative', label: 'Collaborative' },
  { value: 'visionary', label: 'Visionary' },
] as const

export function StakeholdersSection() {
  const { formData, updateBriefingField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['stakeholders'] ?? []
  const stakeholders = formData.briefing.stakeholders ?? []

  const addStakeholder = () => {
    const newStakeholder = {
      id: `stakeholder-${Date.now()}`,
      name: '',
      role: '',
      department: '',
      influence: 5,
      satisfaction: 50,
      communicationStyle: 'direct' as const,
      concerns: [] as string[],
      priorities: [] as string[],
    }
    updateBriefingField('stakeholders', [...stakeholders, newStakeholder])
  }

  const updateStakeholder = (index: number, field: keyof typeof stakeholders[0], value: unknown) => {
    const updated = [...stakeholders]
    updated[index] = { ...updated[index], [field]: value }
    updateBriefingField('stakeholders', updated)
  }

  const updateArrayField = (index: number, field: 'concerns' | 'priorities', value: string) => {
    const updated = [...stakeholders]
    updated[index] = { 
      ...updated[index], 
      [field]: value.split(',').map(s => s.trim()).filter(Boolean) 
    }
    updateBriefingField('stakeholders', updated)
  }

  const removeStakeholder = (index: number) => {
    updateBriefingField('stakeholders', stakeholders.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (stakeholders.length > 0 && stakeholders.every(s => s.name && s.role)) {
      markSectionComplete('stakeholders')
    }
  }

  const getSatisfactionColor = (value: number) => {
    if (value > 70) return 'text-green-500'
    if (value > 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Stakeholders"
        description="Define characters players must interact with and manage"
        buttonLabel="Add Stakeholder"
        onAdd={addStakeholder}
      />

      {stakeholders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No stakeholders defined"
          description="Add stakeholders that players will need to manage"
          buttonLabel="Add First Stakeholder"
          onAdd={addStakeholder}
        />
      ) : (
        <div className="space-y-4">
          {stakeholders.map((stakeholder, index) => (
            <ItemCard
              key={stakeholder.id}
              badges={[
                ...(stakeholder.name ? [{ label: stakeholder.name, className: 'border-[#23252a] text-[#8a8f98]' }] : []),
                ...(stakeholder.role ? [{ label: stakeholder.role, className: 'border-[#23252a] text-[#8a8f98]' }] : []),
              ]}
              onRemove={() => removeStakeholder(index)}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormFieldLabel>Name</FormFieldLabel>
                  <Input
                    value={stakeholder.name}
                    onChange={(e) => updateStakeholder(index, 'name', e.target.value)}
                    placeholder="e.g., Sarah Chen"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Role</FormFieldLabel>
                  <Input
                    value={stakeholder.role}
                    onChange={(e) => updateStakeholder(index, 'role', e.target.value)}
                    placeholder="e.g., CTO"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Department</FormFieldLabel>
                  <Input
                    value={stakeholder.department}
                    onChange={(e) => updateStakeholder(index, 'department', e.target.value)}
                    placeholder="e.g., Engineering"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Communication Style</FormFieldLabel>
                  <select
                    value={stakeholder.communicationStyle}
                    onChange={(e) => updateStakeholder(index, 'communicationStyle', e.target.value)}
                    className="w-full h-10 px-3 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  >
                    {COMMUNICATION_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormFieldLabel>Influence (1-10)</FormFieldLabel>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={stakeholder.influence}
                    onChange={(e) => updateStakeholder(index, 'influence', parseInt(e.target.value))}
                    className="w-full accent-[#5e6ad2]"
                  />
                  <div className="flex justify-between text-xs text-[#8a8f98] mt-1">
                    <span>Low</span>
                    <span className="text-[#7170ff] font-medium">{stakeholder.influence}</span>
                    <span>High</span>
                  </div>
                </div>
                <div>
                  <FormFieldLabel>Satisfaction (0-100)</FormFieldLabel>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stakeholder.satisfaction}
                    onChange={(e) => updateStakeholder(index, 'satisfaction', parseInt(e.target.value))}
                    className="w-full accent-[#5e6ad2]"
                  />
                  <div className="flex justify-between text-xs text-[#8a8f98] mt-1">
                    <span>Unhappy</span>
                    <span className={cn('font-medium', getSatisfactionColor(stakeholder.satisfaction))}>
                      {stakeholder.satisfaction}%
                    </span>
                    <span>Happy</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel>Concerns (comma-separated)</FormFieldLabel>
                  <Input
                    value={stakeholder.concerns?.join(', ') || ''}
                    onChange={(e) => updateArrayField(index, 'concerns', e.target.value)}
                    placeholder="e.g., timeline, budget, quality"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Priorities (comma-separated)</FormFieldLabel>
                  <Input
                    value={stakeholder.priorities?.join(', ') || ''}
                    onChange={(e) => updateArrayField(index, 'priorities', e.target.value)}
                    placeholder="e.g., speed, reliability, cost"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      {stakeholders.length > 0 && <SectionCompleteButton onComplete={handleComplete} />}
    </div>
  )
}
