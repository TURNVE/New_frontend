import { useSimulationForm } from '../context/SimulationFormContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Calendar } from 'lucide-react'
import {
  ValidationErrors,
  SectionHeader,
  EmptyState,
  SectionCompleteButton,
  FormFieldLabel,
} from './shared/FormComponents'

const SIGNAL_SEVERITY_OPTIONS = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
  { value: 'success', label: 'Success' },
] as const

const EVENT_TYPES = [
  { value: 'signal', label: 'Signal' },
  { value: 'notification', label: 'Notification' },
  { value: 'request', label: 'Request' },
  { value: 'meeting', label: 'Meeting' },
] as const

const ACTION_TYPES = [
  { value: 'choice', label: 'Multiple Choice' },
  { value: 'decision_text', label: 'Text Decision' },
  { value: 'submit_prd', label: 'PRD Submission' },
  { value: 'acknowledge', label: 'Acknowledge' },
  { value: 'approval', label: 'Approval' },
  { value: 'task', label: 'Task' },
] as const

export function WeeklyContentSection() {
  const { formData, updateField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['weekly'] ?? []
  
  const weeklySignals = formData.weeklySignals ?? []
  const weeklyEvents = formData.weeklyEvents ?? []
  const weeklyActions = formData.weeklyActions ?? []

  const totalWeeks = formData.briefing.totalWeeks

  const addSignal = () => {
    const newSignal = {
      id: `signal-${Date.now()}`,
      week: 1,
      source: '',
      sourceInitials: '',
      sourceColor: 'bg-blue-500/20 text-blue-400',
      message: '',
      severity: 'info' as const,
      tags: [] as string[],
    }
    updateField('weeklySignals', [...weeklySignals, newSignal])
  }

  const updateSignal = (index: number, field: keyof typeof weeklySignals[0], value: unknown) => {
    const updated = [...weeklySignals]
    updated[index] = { ...updated[index], [field]: value }
    updateField('weeklySignals', updated)
  }

  const removeSignal = (index: number) => {
    updateField('weeklySignals', weeklySignals.filter((_, i) => i !== index))
  }

  const addEvent = () => {
    const newEvent = {
      id: `event-${Date.now()}`,
      week: 1,
      type: 'notification' as const,
      title: '',
      description: '',
      from: '',
      fromInitials: '',
      fromColor: 'bg-blue-500/20 text-blue-400',
      priority: 'normal' as const,
      requiresAction: false,
    }
    updateField('weeklyEvents', [...weeklyEvents, newEvent])
  }

  const updateEvent = (index: number, field: keyof typeof weeklyEvents[0], value: unknown) => {
    const updated = [...weeklyEvents]
    updated[index] = { ...updated[index], [field]: value }
    updateField('weeklyEvents', updated)
  }

  const removeEvent = (index: number) => {
    updateField('weeklyEvents', weeklyEvents.filter((_, i) => i !== index))
  }

  const addAction = () => {
    const newAction = {
      id: `action-${Date.now()}`,
      week: 1,
      title: '',
      description: '',
      category: 'task' as const,
      actionType: 'choice' as const,
      priority: 'normal' as const,
    }
    updateField('weeklyActions', [...weeklyActions, newAction])
  }

  const updateAction = (index: number, field: keyof typeof weeklyActions[0], value: unknown) => {
    const updated = [...weeklyActions]
    updated[index] = { ...updated[index], [field]: value }
    updateField('weeklyActions', updated)
  }

  const removeAction = (index: number) => {
    updateField('weeklyActions', weeklyActions.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    markSectionComplete('weekly')
  }

  const renderItemCard = (title: string, onAdd: () => void, items: unknown[], renderItem: (item: unknown, index: number) => React.ReactNode, emptyText: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-[#f7f8f8]">{title}</h4>
        <Button onClick={onAdd} variant="outline" className="border-[#23252a] text-[#d0d6e0]" size="sm">
          Add
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#8a8f98] text-center py-4">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Weekly Content"
        description="Define per-week signals, events, and actions"
        buttonLabel="Add Content"
        onAdd={() => {}}
        showButton={false}
      />

      {/* Weekly Signals */}
      <Card className="bg-[#1a1d21] border-[#23252a] p-4">
        {renderItemCard(
          'Weekly Signals',
          addSignal,
          weeklySignals,
          (signal: typeof weeklySignals[0], index) => (
            <div key={signal.id} className="bg-[#111418] border border-[#23252a] rounded-lg p-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <FormFieldLabel>Week</FormFieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={signal.week}
                    onChange={(e) => updateSignal(index, 'week', parseInt(e.target.value))}
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
                <div>
                  <FormFieldLabel>Source</FormFieldLabel>
                  <Input
                    value={signal.source}
                    onChange={(e) => updateSignal(index, 'source', e.target.value)}
                    placeholder="e.g., Sarah Chen"
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
                <div>
                  <FormFieldLabel>Severity</FormFieldLabel>
                  <select
                    value={signal.severity}
                    onChange={(e) => updateSignal(index, 'severity', e.target.value)}
                    className="w-full h-8 px-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm"
                  >
                    {SIGNAL_SEVERITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={signal.message}
                onChange={(e) => updateSignal(index, 'message', e.target.value)}
                placeholder="Message content..."
                rows={2}
                className="w-full px-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm mb-3 resize-none"
              />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => removeSignal(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ),
          'No signals defined'
        )}
      </Card>

      {/* Weekly Events */}
      <Card className="bg-[#1a1d21] border-[#23252a] p-4">
        {renderItemCard(
          'Weekly Events',
          addEvent,
          weeklyEvents,
          (event: typeof weeklyEvents[0], index) => (
            <div key={event.id} className="bg-[#111418] border border-[#23252a] rounded-lg p-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <FormFieldLabel>Week</FormFieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={event.week}
                    onChange={(e) => updateEvent(index, 'week', parseInt(e.target.value))}
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
                <div>
                  <FormFieldLabel>Type</FormFieldLabel>
                  <select
                    value={event.type}
                    onChange={(e) => updateEvent(index, 'type', e.target.value)}
                    className="w-full h-8 px-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm"
                  >
                    {EVENT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormFieldLabel>From</FormFieldLabel>
                  <Input
                    value={event.from}
                    onChange={(e) => updateEvent(index, 'from', e.target.value)}
                    placeholder="e.g., CEO"
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
              </div>
              <Input
                value={event.title}
                onChange={(e) => updateEvent(index, 'title', e.target.value)}
                placeholder="Event title..."
                className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] mb-2"
              />
              <textarea
                value={event.description}
                onChange={(e) => updateEvent(index, 'description', e.target.value)}
                placeholder="Event description..."
                rows={2}
                className="w-full px-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm mb-3 resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#8a8f98]">
                  <input
                    type="checkbox"
                    checked={event.requiresAction}
                    onChange={(e) => updateEvent(index, 'requiresAction', e.target.checked)}
                    className="rounded border-[#23252a]"
                  />
                  Requires Action
                </label>
                <Button variant="ghost" size="sm" onClick={() => removeEvent(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ),
          'No events defined'
        )}
      </Card>

      {/* Weekly Actions */}
      <Card className="bg-[#1a1d21] border-[#23252a] p-4">
        {renderItemCard(
          'Weekly Actions',
          addAction,
          weeklyActions,
          (action: typeof weeklyActions[0], index) => (
            <div key={action.id} className="bg-[#111418] border border-[#23252a] rounded-lg p-4">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <FormFieldLabel>Week</FormFieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={action.week}
                    onChange={(e) => updateAction(index, 'week', parseInt(e.target.value))}
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
                <div className="col-span-2">
                  <FormFieldLabel>Title</FormFieldLabel>
                  <Input
                    value={action.title}
                    onChange={(e) => updateAction(index, 'title', e.target.value)}
                    placeholder="e.g., Submit Root Cause Analysis"
                    className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] h-8"
                  />
                </div>
                <div>
                  <FormFieldLabel>Type</FormFieldLabel>
                  <select
                    value={action.actionType}
                    onChange={(e) => updateAction(index, 'actionType', e.target.value)}
                    className="w-full h-8 px-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm"
                  >
                    {ACTION_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={action.description}
                onChange={(e) => updateAction(index, 'description', e.target.value)}
                placeholder="Action description..."
                rows={2}
                className="w-full px-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm mb-3 resize-none"
              />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => removeAction(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ),
          'No actions defined'
        )}
      </Card>

      <SectionCompleteButton onComplete={handleComplete} />
    </div>
  )
}
