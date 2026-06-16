import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingSupabaseMessage =
  'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabaseConfigError = missingSupabaseMessage

function createMissingSupabaseClient(): SupabaseClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(missingSupabaseMessage)
      },
    },
  ) as SupabaseClient
}

export const supabase =
  isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMissingSupabaseClient()

export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export type Program = {
  id: string
  title: string
  description: string
  start_date: string
  duration_weeks: number
  track_type: 'technical' | 'product'
  status: 'upcoming' | 'active' | 'completed'
  created_at: string
}

export type Enrollment = {
  id: string
  user_id: string
  program_id: string
  status: 'pending' | 'accepted' | 'rejected'
  enrolled_at: string
}

export type PortfolioArtifact = {
  id: string
  user_id: string
  title: string
  description: string
  artifact_type: 'mvp' | 'prd' | 'case_study' | 'brand_identity' | 'campaign'
  url?: string
  created_at: string
  updated_at: string
}

export type Instructor = {
  id: string
  name: string
  title: string
  company?: string
  bio?: string
  avatar_url?: string
  rating?: number
}
