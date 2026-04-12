import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User, AuthResponse, OAuthResponse } from '@supabase/supabase-js'

// ── Named Constants ────────────────────────────────────────────
export const AUTH_PROVIDERS = {
    GOOGLE: 'google',
    GITHUB: 'github',
    LINKEDIN: 'linkedin_oidc',
} as const

export const AUTH_ERRORS = {
    EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in. Check your inbox for the verification link.',
    SIGN_IN_FAILED: 'Failed to sign in. Please check your credentials.',
    SIGN_UP_FAILED: 'Failed to create account. Please try again.',
    OAUTH_FAILED: 'Failed to sign in with social provider.',
    GENERIC: 'An unexpected error occurred. Please try again.',
    NOT_AUTHENTICATED: 'You must be signed in to perform this action.',
} as const

export const AUTH_ROUTES = {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    CALLBACK: '/auth/callback',
    DASHBOARD: '/dashboard',
} as const

type OAuthProvider = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS]

// ── Interface ──────────────────────────────────────────────────
export interface AuthContextValue {
    user: User | null
    session: Session | null
    isAuthenticated: boolean
    isLoading: boolean
    signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) => Promise<AuthResponse>
    signIn: (email: string, password: string) => Promise<AuthResponse>
    signInWithOAuth: (provider: OAuthProvider) => Promise<OAuthResponse>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: Error | null }>
    refreshSession: () => Promise<void>
}

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                if (currentSession) {
                    setSession(currentSession)
                    setUser(currentSession.user)
                }
            } catch (err) {
                console.error('Failed to initialize auth:', err)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        // Listen for auth state changes (single listener for entire app)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession)
                setUser(newSession?.user ?? null)
                setIsLoading(false)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const signUp = useCallback(
        async (email: string, password: string, options?: { data?: Record<string, unknown> }): Promise<AuthResponse> => {
            return await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: options?.data,
                    emailRedirectTo: window.location.origin + AUTH_ROUTES.CALLBACK,
                },
            })
        },
        []
    )

    const signIn = useCallback(
        async (email: string, password: string): Promise<AuthResponse> => {
            return await supabase.auth.signInWithPassword({ email, password })
        },
        []
    )

    const signInWithOAuth = useCallback(
        async (provider: OAuthProvider): Promise<OAuthResponse> => {
            return await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + AUTH_ROUTES.CALLBACK,
                },
            })
        },
        []
    )

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
    }, [])

    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + AUTH_ROUTES.SIGN_IN,
        })
        return { error }
    }, [])

    const refreshSession = useCallback(async () => {
        const { data: { session: refreshed } } = await supabase.auth.getSession()
        setSession(refreshed)
        setUser(refreshed?.user ?? null)
    }, [])

    const isAuthenticated = useMemo(() => !!user && !!session, [user, session])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            session,
            isAuthenticated,
            isLoading,
            signUp,
            signIn,
            signInWithOAuth,
            signOut,
            resetPassword,
            refreshSession,
        }),
        [user, session, isAuthenticated, isLoading, signUp, signIn, signInWithOAuth, signOut, resetPassword, refreshSession]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>.')
    }
    return context
}

export type { User, Session, AuthResponse, OAuthResponse }
