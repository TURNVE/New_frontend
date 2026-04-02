import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User, AuthResponse, OAuthResponse } from '@supabase/supabase-js'

export interface UseAuthReturn {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signInWithOAuth: (provider: 'google' | 'github' | 'linkedin_oidc') => Promise<OAuthResponse>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setSession(session)
        setUser(session.user)
      }
      
      setIsLoading(false)
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, options?: { data?: Record<string, unknown> }): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email,
      password,
      options: options ? { data: options.data } : undefined
    })
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'linkedin_oidc'): Promise<OAuthResponse> => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    })
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user ?? null)
  }, [])

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session])

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshSession
  }
}

export type { User, Session, AuthResponse, OAuthResponse }
