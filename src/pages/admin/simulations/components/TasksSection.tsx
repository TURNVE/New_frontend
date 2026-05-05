import { useSimulationForm } from '../context/SimulationFormContext'
import { Input } from '@/components/ui/input'
import {
  ValidationErrors,
  SectionHeader,
  EmptyState,
  ItemCard,
  SectionCompleteButton,
  FormFieldLabel,
} from './shared/FormComponents'
import { ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const TASK_TYPES = [
  { value: 'crisis_assessment', label: 'Crisis Assessment' },
  { value: 'stakeholder_comms', label: 'Stakeholder Communications' },
  { value: 'decision_memo', label: 'Decision Memo' },
  { value: 'product_brief', label: 'Product Brief' },
  { value: 'financial_model', label: 'Financial Model' },
  { value: 'risk_assessment', label: 'Risk Assessment' },
  { value: 'architecture_proposal', label: 'Architecture Proposal' },
  { value: 'migration_plan', label: 'Migration Plan' },
  { value: 'user_research', label: 'User Research' },
  { value: 'mvp_concept', label: 'MVP Concept' },
  { value: 'gtm_plan', label: 'Go-to-Market Plan' },
  { value: 'brand_research', label: 'Brand Research' },
  { value: 'color_palette', label: 'Color Palette' },
  { value: 'moodboard', label: 'Moodboard' },
  { value: 'brand_assets', label: 'Brand Assets' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'root_cause_doc', label: 'Root Cause Document' },
  { value: 'caching_implementation', label: 'Caching Implementation' },
  { value: 'db_optimization', label: 'Database Optimization' },
  { value: 'load_testing', label: 'Load Testing' },
  { value: 'custom', label: 'Custom' },
] as const

export function TasksSection() {
  const { formData, updateField, validationErrors, markSectionComplete } = useSimulationForm()
  const errors = validationErrors['tasks'] ?? []
  const tasks = formData.tasks ?? []

  const addTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      type: 'custom',
      title: '',
      description: '',
      requirements: [] as string[],
    }
    updateField('tasks', [...tasks, newTask])
  }

  const updateTask = (index: number, field: keyof typeof tasks[0], value: unknown) => {
    const updated = [...tasks]
    updated[index] = { ...updated[index], [field]: value }
    updateField('tasks', updated)
  }

  const updateRequirements = (index: number, value: string) => {
    const updated = [...tasks]
    updated[index] = {
      ...updated[index],
      requirements: value.split('\n').map(s => s.trim()).filter(Boolean)
    }
    updateField('tasks', updated)
  }

  const removeTask = (index: number) => {
    updateField('tasks', tasks.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (tasks.length > 0 && tasks.every(t => t.title && t.description)) {
      markSectionComplete('tasks')
    }
  }

  const getTaskTypeLabel = (type: string) => {
    return TASK_TYPES.find(t => t.value === type)?.label ?? 'Custom'
  }

  return (
    <div className="space-y-6">
      <ValidationErrors errors={errors} />

      <SectionHeader
        title="Simulation Tasks"
        description="Define the tasks players must complete"
        buttonLabel="Add Task"
        onAdd={addTask}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks defined"
          description="Add tasks that players will complete during the simulation"
          buttonLabel="Add First Task"
          onAdd={addTask}
        />
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <ItemCard
              key={task.id}
              badges={[
                { label: getTaskTypeLabel(task.type), className: 'border-[#23252a] text-[#8a8f98]' },
                ...(task.requirements?.length > 0 ? [{ 
                  label: `${task.requirements.length} requirements`, 
                  className: 'border-[#23252a] text-[#8a8f98]' 
                }] : []),
              ]}
              onRemove={() => removeTask(index)}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormFieldLabel>Task Title</FormFieldLabel>
                  <Input
                    value={task.title}
                    onChange={(e) => updateTask(index, 'title', e.target.value)}
                    placeholder="e.g., Initial Crisis Assessment"
                    className="bg-[#111418] border-[#23252a] text-[#f7f8f8]"
                  />
                </div>
                <div>
                  <FormFieldLabel>Task Type</FormFieldLabel>
                  <select
                    value={task.type}
                    onChange={(e) => updateTask(index, 'type', e.target.value)}
                    className="w-full h-10 px-3 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  >
                    {TASK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <FormFieldLabel>Description</FormFieldLabel>
                <textarea
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  placeholder="Describe what players need to do..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:ring-2 focus:ring-[#7170ff] resize-none"
                />
              </div>

              <div>
                <FormFieldLabel>Requirements (one per line)</FormFieldLabel>
                <textarea
                  value={task.requirements?.join('\n') || ''}
                  onChange={(e) => updateRequirements(index, e.target.value)}
                  placeholder="e.g., List all immediate threats&#10;Assess severity of each&#10;Prioritize response"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:ring-2 focus:ring-[#7170ff] resize-none"
                />
              </div>
            </ItemCard>
          ))}
        </div>
      )}

      {tasks.length > 0 && <SectionCompleteButton onComplete={handleComplete} />}
    </div>
  )
}
