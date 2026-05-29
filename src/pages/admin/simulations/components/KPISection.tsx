import { useSimulationForm } from '../context/SimulationFormContext'
import { Button } from '@/components/ui/button'
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
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: 'good', label: 'Good', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'warning', label: 'Warning', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'critical', label: 'Critical', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
] as const

const TREND_DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'stable', label: 'Stable' },
] as const

const getTrendIcon = (direction: string) => {
  return direction === 'up' ? TrendingUp : TrendingDown
}

const getTrendColor = (direction: string) => {
  switch (direction) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    default:
      return 'text-yellow-500'
  }
}

export function KPISection() {
  const { formData, updateBriefingField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['kpis'] ?? []
  const kpis = formData.briefing.kpis ?? []

  const addKPI = () => {
    const newKPI = {
      id: `kpi-${Date.now()}`,
      label: 'New KPI',
      value: 50,
      maxValue: 100,
      status: 'warning' as const,
      goal: '',
      progress: 50,
    }
    updateBriefingField('kpis', [...kpis, newKPI])
  }

  const updateKPI = (index: number, field: keyof typeof kpis[0], value: unknown) => {
    const updated = [...kpis]
    updated[index] = { ...updated[index], [field]: value }
    updateBriefingField('kpis', updated)
  }

  const updateTrend = (index: number, field: string, value: string) => {
    const updated = [...kpis]
    const currentTrend = updated[index].trend ?? { 
      direction: 'stable' as const, 
      value: '', 
      color: 'green' as const 
    }
    updated[index] = {
      ...updated[index],
      trend: { ...currentTrend, [field]: value },
    }
    updateBriefingField('kpis', updated)
  }

  const removeKPI = (index: number) => {
    updateBriefingField('kpis', kpis.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (kpis.length > 0) {
      markSectionComplete('kpis')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.className ?? 'border-[#23252a] text-[#8a8f98]'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Key Performance Indicators"
        description="Define metrics that players must manage during the simulation"
        buttonLabel="Add KPI"
        onAdd={addKPI}
      />

      {kpis.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No KPIs defined"
          description="Add KPIs to track player progress and success"
          buttonLabel="Add First KPI"
          onAdd={addKPI}
        />
      ) : (
        <div className="space-y-4">
          {kpis.map((kpi, index) => (
            <ItemCard
              key={kpi.id}
              badges={[{ label: kpi.status, className: getStatusBadgeClass(kpi.status) }]}
              onRemove={() => removeKPI(index)}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormFieldLabel>KPI Label</FormFieldLabel>
                  <Input
                    value={kpi.label}
                    onChange={(e) => updateKPI(index, 'label', e.target.value)}
                    placeholder="e.g., Team Morale"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Current Value</FormFieldLabel>
                  <Input
                    type="number"
                    value={kpi.value}
                    onChange={(e) => updateKPI(index, 'value', parseFloat(e.target.value))}
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Max Value</FormFieldLabel>
                  <Input
                    type="number"
                    value={kpi.maxValue}
                    onChange={(e) => updateKPI(index, 'maxValue', parseFloat(e.target.value))}
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Status</FormFieldLabel>
                  <SelectButtonGroup
                    options={[...STATUS_OPTIONS]}
                    value={kpi.status}
                    onChange={(value) => updateKPI(index, 'status', value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FormFieldLabel>Goal Description</FormFieldLabel>
                  <Input
                    value={kpi.goal}
                    onChange={(e) => updateKPI(index, 'goal', e.target.value)}
                    placeholder="e.g., Keep above 60%"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Progress %</FormFieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={kpi.progress}
                    onChange={(e) => updateKPI(index, 'progress', parseFloat(e.target.value))}
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Trend Direction</FormFieldLabel>
                  <div className="flex gap-2">
                    {TREND_DIRECTION_OPTIONS.map((option) => {
                      const Icon = getTrendIcon(option.value)
                      const currentDirection = kpi.trend?.direction ?? 'stable'
                      return (
                        <button
                          key={option.value}
                          onClick={() => updateTrend(index, 'direction', option.value)}
                          className={cn(
                            'flex-1 px-3 py-2 rounded-md text-xs font-medium border transition-colors flex items-center justify-center gap-1',
                            currentDirection === option.value
                              ? 'bg-[#5e6ad2]/10 border-[#5e6ad2] text-[#7170ff]'
                              : 'bg-[#111418] border-[#23252a] text-[#8a8f98] hover:bg-[#23252a]'
                          )}
                        >
                          <Icon className={cn('w-3 h-3', getTrendColor(option.value))} />
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      {kpis.length > 0 && <SectionCompleteButton onComplete={handleComplete} />}
    </div>
  )
}
