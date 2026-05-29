import { useSimulationForm } from '../context/SimulationFormContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, BookOpen, Plus, Trash2 } from 'lucide-react'
import {
  ValidationErrors,
  SectionHeader,
  SectionCompleteButton,
  FormFieldLabel,
} from './shared/FormComponents'

export function EvaluationSection() {
  const { formData, updateField, markSectionComplete, completedSections } = useSimulationForm()
  
  const evaluationRubrics = formData.evaluationRubrics ?? {}
  const guidance = formData.guidance ?? {}
  const tasks = formData.tasks ?? []

  const addRubricForTask = (taskId: string) => {
    const newRubric = {
      criteria: [
        { id: 'completeness', label: 'Completeness', weight: 0.3, description: 'Task completed thoroughly' },
        { id: 'accuracy', label: 'Accuracy', weight: 0.3, description: 'Information is accurate' },
        { id: 'clarity', label: 'Clarity', weight: 0.2, description: 'Clear communication' },
        { id: 'timeliness', label: 'Timeliness', weight: 0.2, description: 'Completed on time' },
      ],
      examples: {
        excellent: '',
        poor: '',
      },
    }
    updateField('evaluationRubrics', { ...evaluationRubrics, [taskId]: newRubric })
  }

  const updateRubric = (taskId: string, field: string, value: unknown) => {
    updateField('evaluationRubrics', {
      ...evaluationRubrics,
      [taskId]: { ...evaluationRubrics[taskId], [field]: value },
    })
  }

  const updateCriterion = (taskId: string, index: number, field: string, value: unknown) => {
    const rubric = evaluationRubrics[taskId]
    const updatedCriteria = [...rubric.criteria]
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value }
    updateField('evaluationRubrics', {
      ...evaluationRubrics,
      [taskId]: { ...rubric, criteria: updatedCriteria },
    })
  }

  const addCriterionToRubric = (taskId: string) => {
    const rubric = evaluationRubrics[taskId]
    updateField('evaluationRubrics', {
      ...evaluationRubrics,
      [taskId]: {
        ...rubric,
        criteria: [...rubric.criteria, { id: `criterion-${Date.now()}`, label: 'New Criterion', weight: 0.25, description: '' }],
      },
    })
  }

  const removeCriterionFromRubric = (taskId: string, index: number) => {
    const rubric = evaluationRubrics[taskId]
    updateField('evaluationRubrics', {
      ...evaluationRubrics,
      [taskId]: { ...rubric, criteria: rubric.criteria.filter((_, i) => i !== index) },
    })
  }

  const updateExamples = (taskId: string, exampleType: 'excellent' | 'poor', value: string) => {
    const rubric = evaluationRubrics[taskId]
    updateField('evaluationRubrics', {
      ...evaluationRubrics,
      [taskId]: { ...rubric, examples: { ...rubric.examples, [exampleType]: value } },
    })
  }

  const addGuidanceForWeek = (week: number) => {
    updateField('guidance', { ...guidance, [`week${week}`]: { opening: '', hints: [''] } })
  }

  const updateGuidance = (week: number, field: string, value: unknown) => {
    updateField('guidance', { ...guidance, [`week${week}`]: { ...guidance[`week${week}`], [field]: value } })
  }

  const updateHint = (week: number, index: number, value: string) => {
    const weekGuidance = guidance[`week${week}`] ?? { hints: [] }
    const updatedHints = [...weekGuidance.hints]
    updatedHints[index] = value
    updateField('guidance', { ...guidance, [`week${week}`]: { ...weekGuidance, hints: updatedHints } })
  }

  const addHint = (week: number) => {
    const weekGuidance = guidance[`week${week}`] ?? { hints: [] }
    updateField('guidance', { ...guidance, [`week${week}`]: { ...weekGuidance, hints: [...weekGuidance.hints, ''] } })
  }

  const removeHint = (week: number, index: number) => {
    const weekGuidance = guidance[`week${week}`] ?? { hints: [] }
    updateField('guidance', { ...guidance, [`week${week}`]: { ...weekGuidance, hints: weekGuidance.hints.filter((_, i) => i !== index) } })
  }

  const handleComplete = () => {
    markSectionComplete('evaluation')
  }

  const totalWeeks = formData.briefing.totalWeeks
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Evaluation & Guidance"
          description="Define how player work will be evaluated and provide contextual guidance"
          buttonLabel=""
          onAdd={() => {}}
          showButton={false}
        />
        <Badge variant="outline" className="border-green-500/20 text-green-500">
          {completedSections.length}/12 Sections Complete
        </Badge>
      </div>

      {/* Evaluation Rubrics */}
      <Card className="bg-[#111418] border-[#23252a] p-6">
        <h3 className="text-md font-medium text-[#f7f8f8] flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-[#7170ff]" />
          Evaluation Rubrics
        </h3>
        <p className="text-sm text-[#8a8f98] mb-4">Define scoring criteria for each task type</p>

        {tasks.length === 0 ? (
          <p className="text-[#8a8f98] text-center py-4">Add tasks first to create evaluation rubrics</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const rubric = evaluationRubrics[task.id]
              if (!rubric) {
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-[#1a1d21] rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-[#f7f8f8]">{task.title}</h5>
                      <p className="text-xs text-[#8a8f98]">No rubric defined</p>
                    </div>
                    <Button onClick={() => addRubricForTask(task.id)} size="sm" className="bg-[#5e6ad2] hover:bg-[#828fff] text-white">
                      <Plus className="w-3 h-3 mr-1" /> Add Rubric
                    </Button>
                  </div>
                )
              }

              return (
                <Card key={task.id} className="bg-[#1a1d21] border-[#23252a] p-4">
                  <h5 className="text-sm font-medium text-[#f7f8f8] mb-4">{task.title}</h5>

                  <div className="space-y-3 mb-4">
                    {rubric.criteria.map((criterion, idx) => (
                      <div key={criterion.id} className="grid grid-cols-4 gap-2 p-3 bg-[#111418] rounded-lg">
                        <Input
                          value={criterion.label}
                          onChange={(e) => updateCriterion(task.id, idx, 'label', e.target.value)}
                          placeholder="Criterion name"
                          className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] text-sm h-8"
                        />
                        <Input
                          type="number"
                          min={0}
                          max={1}
                          step={0.05}
                          value={criterion.weight}
                          onChange={(e) => updateCriterion(task.id, idx, 'weight', parseFloat(e.target.value))}
                          placeholder="Weight"
                          className="bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] text-sm h-8"
                        />
                        <Input
                          value={criterion.description}
                          onChange={(e) => updateCriterion(task.id, idx, 'description', e.target.value)}
                          placeholder="Description"
                          className="col-span-2 bg-[#0d0f11] border-[#23252a] text-[#f7f8f8] text-sm h-8"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <FormFieldLabel>Excellent Example</FormFieldLabel>
                      <textarea
                        value={rubric.examples.excellent}
                        onChange={(e) => updateExamples(task.id, 'excellent', e.target.value)}
                        placeholder="What does excellent work look like?"
                        rows={3}
                        className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm resize-none"
                      />
                    </div>
                    <div>
                      <FormFieldLabel>Poor Example</FormFieldLabel>
                      <textarea
                        value={rubric.examples.poor}
                        onChange={(e) => updateExamples(task.id, 'poor', e.target.value)}
                        placeholder="What does poor work look like?"
                        rows={3}
                        className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm resize-none"
                      />
                    </div>
                  </div>

                  <Button onClick={() => addCriterionToRubric(task.id)} size="sm" variant="outline" className="border-[#23252a] text-[#d0d6e0]">
                    <Plus className="w-3 h-3 mr-1" /> Add Criterion
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </Card>

      {/* In-Context Guidance */}
      <Card className="bg-[#111418] border-[#23252a] p-6">
        <h3 className="text-md font-medium text-[#f7f8f8] flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-[#7170ff]" />
          In-Context Guidance
        </h3>
        <p className="text-sm text-[#8a8f98] mb-4">Provide week-by-week hints and guidance for players</p>

        <div className="grid grid-cols-2 gap-4">
          {weeks.map((week) => {
            const weekGuidance = guidance[`week${week}`]
            if (!weekGuidance) {
              return (
                <div key={week} className="flex items-center justify-between p-4 bg-[#1a1d21] rounded-lg">
                  <span className="text-sm text-[#f7f8f8]">Week {week}</span>
                  <Button onClick={() => addGuidanceForWeek(week)} size="sm" variant="outline" className="border-[#23252a] text-[#d0d6e0]">
                    <Plus className="w-3 h-3 mr-1" /> Add Guidance
                  </Button>
                </div>
              )
            }

            return (
              <Card key={week} className="bg-[#1a1d21] border-[#23252a] p-4">
                <h5 className="text-sm font-medium text-[#f7f8f8] mb-3">Week {week}</h5>
                
                <div className="mb-3">
                  <FormFieldLabel>Opening Context</FormFieldLabel>
                  <textarea
                    value={weekGuidance.opening}
                    onChange={(e) => updateGuidance(week, 'opening', e.target.value)}
                    placeholder="Set the scene for this week..."
                    rows={2}
                    className="w-full px-3 py-2 bg-[#111418] border border-[#23252a] rounded-md text-[#f7f8f8] text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <FormFieldLabel>Hints</FormFieldLabel>
                  {weekGuidance.hints?.map((hint, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={hint}
                        onChange={(e) => updateHint(week, idx, e.target.value)}
                        placeholder={`Hint ${idx + 1}`}
                        className="flex-1 bg-[#111418] border-[#23252a] text-[#f7f8f8] text-sm h-8"
                      />
                      <Button onClick={() => removeHint(week, idx)} size="sm" variant="ghost" className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button onClick={() => addHint(week)} size="sm" variant="outline" className="mt-2 border-[#23252a] text-[#d0d6e0]">
                  <Plus className="w-3 h-3 mr-1" /> Add Hint
                </Button>
              </Card>
            )
          })}
        </div>
      </Card>

      <SectionCompleteButton onComplete={handleComplete} />
    </div>
  )
}
