import { supabase, type Profile, type SimulationScenario, type SimulationSession } from './supabase'
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

export interface AdminDashboardStats {
  totalSimulations: number
  activeSimulations: number
  totalUsers: number
  activeUsers: number
  totalSessions: number
  completionRate: number
}

export interface AdminRecentSimulation {
  id: string
  name: string
  companyName: string
  industry: string
  difficulty: AdminSimulationDifficulty
  isActive: boolean
  createdAt: string
}

export interface AdminRecentActivity {
  id: string
  type: 'simulation_created' | 'simulation_updated' | 'user_registered' | 'session_completed'
  description: string
  timestamp: string
}

export interface AdminDashboardData {
  stats: AdminDashboardStats
  recentSimulations: AdminRecentSimulation[]
  recentActivity: AdminRecentActivity[]
}

export type AdminAnalyticsTimeRange = '7d' | '30d' | '90d' | '1y'

export interface AdminAnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalSimulations: number
    activeSimulations: number
    totalSessions: number
    avgCompletionRate: number
    avgSessionDuration: number
  }
  dailyStats: Array<{
    date: string
    newUsers: number
    activeUsers: number
    sessions: number
    completions: number
  }>
  topSimulations: Array<{
    id: string
    name: string
    starts: number
    completions: number
    avgScore: number
  }>
  userEngagement: {
    daily: number
    weekly: number
    monthly: number
  }
}

const emptyDashboardStats: AdminDashboardStats = {
  totalSimulations: 0,
  activeSimulations: 0,
  totalUsers: 0,
  activeUsers: 0,
  totalSessions: 0,
  completionRate: 0,
}

const emptyAnalyticsData: AdminAnalyticsData = {
  overview: {
    totalUsers: 0,
    activeUsers: 0,
    totalSimulations: 0,
    activeSimulations: 0,
    totalSessions: 0,
    avgCompletionRate: 0,
    avgSessionDuration: 0,
  },
  dailyStats: [],
  topSimulations: [],
  userEngagement: {
    daily: 0,
    weekly: 0,
    monthly: 0,
  },
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

const scenarioToRecentSimulation = (scenario: SimulationScenario): AdminRecentSimulation => {
  const initialState = (scenario.initial_state ?? {}) as Record<string, unknown>

  return {
    id: scenario.id,
    name: scenario.name,
    companyName: String(initialState.companyName ?? ''),
    industry: scenario.industry ?? '',
    difficulty: fromDatabaseDifficulty(scenario.difficulty),
    isActive: scenario.is_active,
    createdAt: scenario.created_at,
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

const emptyDashboard = (): AdminDashboardData => ({
  stats: { ...emptyDashboardStats },
  recentSimulations: [],
  recentActivity: [],
})

const emptyAnalytics = (): AdminAnalyticsData => ({
  ...emptyAnalyticsData,
  overview: { ...emptyAnalyticsData.overview },
  dailyStats: [],
  topSimulations: [],
  userEngagement: { ...emptyAnalyticsData.userEngagement },
})

const safeCount = async (query: PromiseLike<unknown>, label: string): Promise<number> => {
  const response = (await query) as {
    count?: number | null
    error?: { message?: string } | null
  }

  if (response.error) {
    console.warn(`Unable to load admin ${label}; using fallback value.`, response.error)
    return 0
  }

  return response.count ?? 0
}

const safeRows = async <T>(query: PromiseLike<unknown>, label: string): Promise<T[]> => {
  const response = (await query) as {
    data?: T[] | null
    error?: { message?: string } | null
  }

  if (response.error) {
    console.warn(`Unable to load admin ${label}; using fallback value.`, response.error)
    return []
  }

  return response.data ?? []
}

const percentOf = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 1000) / 10 : 0

const daysForRange = (timeRange: AdminAnalyticsTimeRange) =>
  timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : timeRange === '1y' ? 365 : 30

const startOfDayIso = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

const dateKey = (value: string) => new Date(value).toISOString().split('T')[0]

const buildDailyStats = (
  timeRange: AdminAnalyticsTimeRange,
  profiles: Profile[],
  activeProfiles: Profile[],
  sessions: SimulationSession[]
): AdminAnalyticsData['dailyStats'] => {
  const days = daysForRange(timeRange)
  const firstDay = new Date(startOfDayIso(days - 1))
  const dailyStats = Array.from({ length: days }, (_, index) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + index)
    return { date: dateKey(date.toISOString()), newUsers: 0, activeUsers: 0, sessions: 0, completions: 0 }
  })
  const byDate = new Map(dailyStats.map((day) => [day.date, day]))

  profiles.forEach((profile) => {
    const day = byDate.get(dateKey(profile.created_at))
    if (day) day.newUsers++
  })

  activeProfiles.forEach((profile) => {
    if (!profile.last_login) return
    const day = byDate.get(dateKey(profile.last_login))
    if (day) day.activeUsers++
  })

  sessions.forEach((session) => {
    const startedDay = byDate.get(dateKey(session.started_at))
    if (startedDay) startedDay.sessions++

    if (!session.completed_at) return
    const completedDay = byDate.get(dateKey(session.completed_at))
    if (completedDay) completedDay.completions++
  })

  return dailyStats
}

const averageCompletedSessionMinutes = (sessions: SimulationSession[]) => {
  const durations = sessions.flatMap((session) => {
    if (!session.completed_at) return []
    return [(new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 60000]
  })

  return durations.length > 0
    ? Math.round(durations.reduce((sum, duration) => sum + Math.max(0, duration), 0) / durations.length)
    : 0
}

const buildTopSimulations = (
  scenarios: SimulationScenario[],
  sessions: SimulationSession[]
): AdminAnalyticsData['topSimulations'] => {
  const scenariosByKey = new Map(scenarios.map((scenario) => [scenario.key, scenario]))
  const totals = new Map<string, { starts: number; completions: number }>()

  sessions.forEach((session) => {
    const current = totals.get(session.scenario_key) ?? { starts: 0, completions: 0 }
    current.starts++
    if (session.status === 'completed') current.completions++
    totals.set(session.scenario_key, current)
  })

  return Array.from(totals.entries())
    .map(([scenarioKey, total]) => ({
      id: scenariosByKey.get(scenarioKey)?.id ?? scenarioKey,
      name: scenariosByKey.get(scenarioKey)?.name ?? scenarioKey,
      starts: total.starts,
      completions: total.completions,
      avgScore: 0,
    }))
    .sort((a, b) => b.starts - a.starts)
    .slice(0, 5)
}

const buildRecentActivity = (
  scenarios: SimulationScenario[],
  profiles: Profile[]
): AdminRecentActivity[] =>
  [
    ...scenarios.map((scenario): AdminRecentActivity => ({
      id: `simulation-created-${scenario.id}`,
      type: 'simulation_created',
      description: `Simulation "${scenario.name}" was created`,
      timestamp: scenario.created_at,
    })),
    ...profiles.map((profile): AdminRecentActivity => ({
      id: `user-registered-${profile.id}`,
      type: 'user_registered',
      description: `${profile.full_name || profile.username || 'A user'} registered`,
      timestamp: profile.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4)

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

    const copy = { ...source }
    delete copy.id
    delete copy.created_at
    delete copy.updated_at

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

export const adminStats = {
  getDashboard: async () => {
    const [
      totalSimulations,
      activeSimulations,
      totalUsers,
      activeUsers,
      totalSessions,
      completedSessions,
      recentScenarios,
      recentProfiles,
    ] = await Promise.all([
      safeCount(
        supabase.from('simulation_scenarios').select('id', { count: 'exact', head: true }),
        'total simulations'
      ),
      safeCount(
        supabase
          .from('simulation_scenarios')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        'active simulations'
      ),
      safeCount(
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        'total users'
      ),
      safeCount(
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        'active users'
      ),
      safeCount(
        supabase.from('simulation_sessions').select('id', { count: 'exact', head: true }),
        'total sessions'
      ),
      safeCount(
        supabase
          .from('simulation_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        'completed sessions'
      ),
      safeRows<SimulationScenario>(
        supabase
          .from('simulation_scenarios')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        'recent simulations'
      ),
      safeRows<Profile>(
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        'recent users'
      ),
    ])

    const data: AdminDashboardData = {
      stats: {
        totalSimulations,
        activeSimulations,
        totalUsers,
        activeUsers,
        totalSessions,
        completionRate: percentOf(completedSessions, totalSessions),
      },
      recentSimulations: recentScenarios.slice(0, 4).map(scenarioToRecentSimulation),
      recentActivity: buildRecentActivity(recentScenarios, recentProfiles),
    }

    return { data, error: null }
  },

  getAnalytics: async (timeRange: AdminAnalyticsTimeRange) => {
    const rangeStart = startOfDayIso(daysForRange(timeRange) - 1)

    const [
      totalUsers,
      activeUsers,
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      totalSimulations,
      activeSimulations,
      totalSessions,
      completedSessions,
      scenarios,
      rangeProfiles,
      rangeActiveProfiles,
      rangeSessions,
    ] = await Promise.all([
      safeCount(
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        'analytics total users'
      ),
      safeCount(
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        'analytics active users'
      ),
      safeCount(
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_login', startOfDayIso(0)),
        'analytics daily active users'
      ),
      safeCount(
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_login', startOfDayIso(6)),
        'analytics weekly active users'
      ),
      safeCount(
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_login', startOfDayIso(29)),
        'analytics monthly active users'
      ),
      safeCount(
        supabase.from('simulation_scenarios').select('id', { count: 'exact', head: true }),
        'analytics total simulations'
      ),
      safeCount(
        supabase
          .from('simulation_scenarios')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        'analytics active simulations'
      ),
      safeCount(
        supabase.from('simulation_sessions').select('id', { count: 'exact', head: true }),
        'analytics total sessions'
      ),
      safeCount(
        supabase
          .from('simulation_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        'analytics completed sessions'
      ),
      safeRows<SimulationScenario>(
        supabase.from('simulation_scenarios').select('*').limit(1000),
        'analytics simulations'
      ),
      safeRows<Profile>(
        supabase
          .from('profiles')
          .select('*')
          .gte('created_at', rangeStart)
          .limit(1000),
        'analytics new users'
      ),
      safeRows<Profile>(
        supabase
          .from('profiles')
          .select('*')
          .gte('last_login', rangeStart)
          .limit(1000),
        'analytics active users by day'
      ),
      safeRows<SimulationSession>(
        supabase
          .from('simulation_sessions')
          .select('*')
          .gte('started_at', rangeStart)
          .limit(1000),
        'analytics sessions'
      ),
    ])

    const data: AdminAnalyticsData = {
      overview: {
        totalUsers,
        activeUsers,
        totalSimulations,
        activeSimulations,
        totalSessions,
        avgCompletionRate: percentOf(completedSessions, totalSessions),
        avgSessionDuration: averageCompletedSessionMinutes(rangeSessions),
      },
      dailyStats: buildDailyStats(timeRange, rangeProfiles, rangeActiveProfiles, rangeSessions),
      topSimulations: buildTopSimulations(scenarios, rangeSessions),
      userEngagement: {
        daily: dailyActiveUsers,
        weekly: weeklyActiveUsers,
        monthly: monthlyActiveUsers,
      },
    }

    return { data, error: null }
  },

  emptyDashboard,

  emptyAnalytics,
}
