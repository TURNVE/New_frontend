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
import { AlertTriangle } from 'lucide-react'

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'medium', label: 'Medium', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'high', label: 'High', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'critical', label: 'Critical', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
] as const

const LIKELIHOOD_OPTIONS = [
  { value: 'low', label: 'Low', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'medium', label: 'Medium', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'high', label: 'High', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'certain', label: 'Certain', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
] as const

export function RisksSection() {
  const { formData, updateBriefingField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['risks'] ?? []
  const risks = formData.briefing.currentRisks ?? []

  const addRisk = () => {
    const newRisk = {
      id: `risk-${Date.now()}`,
      title: '',
      severity: 'medium' as const,
      likelihood: 'medium' as const,
    }
    updateBriefingField('currentRisks', [...risks, newRisk])
  }

  const updateRisk = (index: number, field: keyof typeof risks[0], value: unknown) => {
    const updated = [...risks]
    updated[index] = { ...updated[index], [field]: value }
    updateBriefingField('currentRisks', updated)
  }

  const removeRisk = (index: number) => {
    updateBriefingField('currentRisks', risks.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    markSectionComplete('risks')
  }

  const getSeverityBadgeClass = (severity: string) => {
    return SEVERITY_OPTIONS.find(s => s.value === severity)?.className ?? 'border-[#23252a] text-[#8a8f98]'
  }

  const getLikelihoodBadgeClass = (likelihood: string) => {
    return LIKELIHOOD_OPTIONS.find(l => l.value === likelihood)?.className ?? 'border-[#23252a] text-[#8a8f98]'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Project Risks"
        description="Define potential risks that players must manage"
        buttonLabel="Add Risk"
        onAdd={addRisk}
      />

      {risks.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No risks defined"
          description="Risks are optional but recommended for realistic simulations"
          buttonLabel="Add First Risk"
          onAdd={addRisk}
        />
      ) : (
        <div className="space-y-4">
          {risks.map((risk, index) => (
            <ItemCard
              key={risk.id}
              badges={[
                { label: risk.severity, className: getSeverityBadgeClass(risk.severity) },
                { label: risk.likelihood, className: getLikelihoodBadgeClass(risk.likelihood) },
              ]}
              onRemove={() => removeRisk(index)}
            >
              <div className="mb-4">
                <FormFieldLabel>Risk Title</FormFieldLabel>
                <Input
                  value={risk.title}
                  onChange={(e) => updateRisk(index, 'title', e.target.value)}
                  placeholder="e.g., Compliance issues not resolved"
                  className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel>Severity</FormFieldLabel>
                  <SelectButtonGroup
                    options={[...SEVERITY_OPTIONS]}
                    value={risk.severity}
                    onChange={(value) => updateRisk(index, 'severity', value)}
                    columns={2}
                  />
                </div>
                <div>
                  <FormFieldLabel>Likelihood</FormFieldLabel>
                  <SelectButtonGroup
                    options={[...LIKELIHOOD_OPTIONS]}
                    value={risk.likelihood}
                    onChange={(value) => updateRisk(index, 'likelihood', value)}
                    columns={2}
                  />
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      <SectionCompleteButton onComplete={handleComplete} />
    </div>
  )
}
