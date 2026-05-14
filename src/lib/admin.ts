import { supabase, type SimulationScenario } from './supabase'
import type { SimulationTemplate } from '@/config/simulationTemplates'

export type AdminSimulationDifficulty = 'intro' | 'intermediate' | 'advanced'

export interface AdminSimulation {
  id: string
  key: string
  name: string
  companyName: string
  industry: string
  archetype: string
  difficulty: AdminSimulationDifficulty
  isActive: boolean
  totalWeeks: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

const fromDatabaseDifficulty = (
  difficulty: SimulationScenario['difficulty']
): AdminSimulationDifficulty => (difficulty === 'beginner' ? 'intro' : difficulty)

const toDatabaseDifficulty = (
  difficulty: AdminSimulationDifficulty
): SimulationScenario['difficulty'] => (difficulty === 'intro' ? 'beginner' : difficulty)

const scenarioToAdminSimulation = (scenario: SimulationScenario): AdminSimulation => {
  const initialState = (scenario.initial_state ?? {}) as Record<string, unknown>
  const phasesConfig = (scenario.phases_config ?? {}) as Record<string, unknown>

  return {
    id: scenario.id,
    key: scenario.key,
    name: scenario.name,
    companyName: String(initialState.companyName ?? ''),
    industry: scenario.industry ?? '',
    archetype: String(initialState.archetype ?? 'crisis'),
    difficulty: fromDatabaseDifficulty(scenario.difficulty),
    isActive: scenario.is_active,
    totalWeeks: scenario.duration_weeks,
    createdAt: scenario.created_at,
    updatedAt: scenario.updated_at,
    createdBy: String(phasesConfig.createdBy ?? 'admin'),
  }
}

const templateToScenarioPayload = (template: SimulationTemplate) => ({
  key: template.id,
  name: template.name,
  description: template.description || template.challengeDetails,
  industry: template.industry,
  difficulty: toDatabaseDifficulty(template.difficulty),
  duration_weeks: template.briefing.totalWeeks || Math.max(1, Math.ceil(template.durationHours / 8)),
  team_size: template.briefing.teamSize || 1,
  budget: template.budget,
  is_active: true,
  initial_state: {
    route: template.route,
    companyName: template.companyName,
    archetype: template.archetype,
    logo: template.logo,
    primaryColor: template.primaryColor,
    founded: template.founded,
    employees: template.employees,
    headquarters: template.headquarters,
    fundingStatus: template.fundingStatus,
    challenge: template.challenge,
    challengeDetails: template.challengeDetails,
    durationHours: template.durationHours,
    passThreshold: template.passThreshold,
    strongPassThreshold: template.strongPassThreshold,
  },
  phases_config: {
    briefing: template.briefing,
    createdBy: 'admin',
  },
  actions_config: {
    tasks: template.tasks,
    weeklySignals: template.weeklySignals ?? [],
    weeklyActions: template.weeklyActions ?? [],
    evaluationRubrics: template.evaluationRubrics ?? {},
  },
  timeline_events: template.weeklyEvents ?? [],
  stakeholders_config: template.briefing.stakeholders ?? [],
})

const buildDuplicatedKey = (key: string) => `${key}-copy-${Date.now().toString(36)}`

export const adminSimulations = {
  list: async () => {
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .select('*')
      .order('created_at', { ascending: false })

    return {
      simulations: (data ?? []).map((scenario) =>
        scenarioToAdminSimulation(scenario as SimulationScenario)
      ),
      error,
    }
  },

  create: async (template: SimulationTemplate) => {
    const payload = templateToScenarioPayload(template)
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .upsert(payload, { onConflict: 'key' })
      .select()
      .single()

    return {
      simulation: data ? scenarioToAdminSimulation(data as SimulationScenario) : null,
      error,
    }
  },

  updateActive: async (id: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()

    return {
      simulation: data ? scenarioToAdminSimulation(data as SimulationScenario) : null,
      error,
    }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('simulation_scenarios')
      .delete()
      .eq('id', id)

    return { error }
  },

  duplicate: async (id: string) => {
    const { data: source, error: sourceError } = await supabase
      .from('simulation_scenarios')
      .select('*')
      .eq('id', id)
      .single()

    if (sourceError || !source) {
      return { simulation: null, error: sourceError }
    }

    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...copy } = source
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .insert({
        ...copy,
        key: buildDuplicatedKey(source.key),
        name: `${source.name} Copy`,
        is_active: false,
      })
      .select()
      .single()

    return {
      simulation: data ? scenarioToAdminSimulation(data as SimulationScenario) : null,
      error,
    }
  },
}
