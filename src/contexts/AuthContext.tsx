import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User, AuthResponse, OAuthResponse } from '@supabase/supabase-js'
import type { Profile } from '../lib/supabase'

export type UserRole = 'USER' | 'RECRUITER' | 'COMPANY' | 'MENTOR' | 'ADMIN'

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
    COMPANY: '/company',
} as const

type OAuthProvider = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS]

export interface AuthContextValue {
    user: User | null
    session: Session | null
    profile: Profile | null
    role: UserRole
    isAuthenticated: boolean
    isLoading: boolean
    signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) => Promise<AuthResponse>
    signIn: (email: string, password: string) => Promise<AuthResponse>
    signInWithOAuth: (provider: OAuthProvider) => Promise<OAuthResponse>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: Error | null }>
    refreshSession: () => Promise<void>
    checkEmailExists: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchProfile = useCallback(async (userId: string) => {
        const { profile: data } = await (await import('../lib/supabase')).profiles.getProfile(userId)
        setProfile(data)
        return data
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                if (currentSession) {
                    setSession(currentSession)
                    setUser(currentSession.user)
                    await fetchProfile(currentSession.user.id)
                }
            } catch (err) {
                console.error('Failed to initialize auth:', err)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setSession(newSession)
                setUser(newSession?.user ?? null)
                if (newSession?.user) {
                    await fetchProfile(newSession.user.id)
                } else {
                    setProfile(null)
                }
                setIsLoading(false)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [fetchProfile])

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
        setProfile(null)
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
        if (refreshed?.user) {
            await fetchProfile(refreshed.user.id)
        }
    }, [fetchProfile])

    const checkEmailExists = useCallback(async (email: string) => {
        const { data, error } = await supabase.rpc('is_email_registered', { email_address: email })
        if (error) {
            console.error('Error checking email:', error)
            return false
        }
        return !!data
    }, [])

    const isAuthenticated = useMemo(() => !!user && !!session, [user, session])
    const role = useMemo<UserRole>(() => (profile?.role as UserRole) || 'USER', [profile?.role])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            session,
            profile,
            role,
            isAuthenticated,
            isLoading,
            signUp,
            signIn,
            signInWithOAuth,
            signOut,
            resetPassword,
            refreshSession,
            checkEmailExists,
        }),
        [user, session, profile, role, isAuthenticated, isLoading, signUp, signIn, signInWithOAuth, signOut, resetPassword, refreshSession, checkEmailExists]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>.')
    }
    return context
}

export type { User, Session, AuthResponse, OAuthResponse }
