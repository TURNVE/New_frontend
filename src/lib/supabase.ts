import { createClient } from '@supabase/supabase-js'
import type { User, Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export type Profile = {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
  role: 'USER' | 'RECRUITER' | 'COMPANY' | 'MENTOR' | 'ADMIN'
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export type SimulationScenario = {
  id: string
  key: string
  name: string
  description?: string
  industry?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_weeks: number
  team_size: number
  budget: number
  is_active: boolean
  initial_state?: Record<string, unknown>
  phases_config?: unknown
  actions_config?: unknown
  timeline_events?: unknown
  stakeholders_config?: unknown
  created_at: string
  updated_at: string
}

export type SimulationSession = {
  id: string
  user_id: string
  scenario_key: string
  status: 'active' | 'completed' | 'abandoned'
  current_week: number
  total_weeks: number
  current_phase: string
  state?: Record<string, unknown>
  started_at: string
  completed_at?: string
  updated_at: string
}

export type SimulationDecision = {
  id: string
  session_id: string
  phase_id?: string
  action_id?: string
  choice_id?: string
  decision_text?: string
  state_before?: Record<string, unknown>
  state_after?: Record<string, unknown>
  score_impact?: Record<string, unknown>
  feedback_received?: string
  created_at: string
}

export type SimulationScore = {
  id: string
  session_id: string
  user_id: string
  execution_score: number
  risk_management_score: number
  stakeholder_score: number
  budget_score: number
  team_management_score: number
  overall_score: number
  grade?: string
  skill_scores?: Record<string, number>
  strengths?: string[]
  areas_for_improvement?: string[]
  completed_at: string
}

export type { User, Session }

// ── Profile helpers (kept here since they're data-layer, not auth-state) ──
export const profiles = {
  getProfile: async (userId?: string) => {
    const id = userId || (await supabase.auth.getUser()).data.user?.id
    if (!id) return { profile: null, error: new Error('No user ID') }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    return { profile: profile as Profile | null, error }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { profile: null, error: new Error('Not authenticated') }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    return { profile: profile as Profile | null, error }
  },
}

export const simulations = {
  getScenarios: async () => {
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    return { scenarios: data as SimulationScenario[], error }
  },

  getScenario: async (key: string) => {
    const { data, error } = await supabase
      .from('simulation_scenarios')
      .select('*')
      .eq('key', key)
      .single()

    return { scenario: data as SimulationScenario | null, error }
  },

  createSession: async (scenarioKey: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { session: null, error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('simulation_sessions')
      .insert({
        user_id: user.id,
        scenario_key: scenarioKey
      })
      .select()
      .single()

    return { session: data as SimulationSession | null, error }
  },

  getSession: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    return { session: data as SimulationSession | null, error }
  },

  getActiveSessions: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { sessions: [], error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('simulation_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })

    return { sessions: data as SimulationSession[], error }
  },

  updateSession: async (sessionId: string, updates: Partial<SimulationSession>) => {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()

    return { session: data as SimulationSession | null, error }
  },

  createDecision: async (decision: Omit<SimulationDecision, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('simulation_decisions')
      .insert(decision)
      .select()
      .single()

    return { decision: data as SimulationDecision | null, error }
  },

  getDecisions: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('simulation_decisions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    return { decisions: data as SimulationDecision[], error }
  },

  createScore: async (score: Omit<SimulationScore, 'id' | 'completed_at' | 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { score: null, error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('simulation_scores')
      .insert({ ...score, user_id: user.id })
      .select()
      .single()

    return { score: data as SimulationScore | null, error }
  },

  getScores: async (sessionId?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { scores: [], error: new Error('Not authenticated') }

    let query = supabase
      .from('simulation_scores')
      .select('*')
      .eq('user_id', user.id)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query.order('completed_at', { ascending: false })

    return { scores: data as SimulationScore[], error }
  }
}

export default supabase