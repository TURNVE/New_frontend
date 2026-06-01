/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { SUPABASE_CONFIG_ERROR, isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Profile } from '../lib/supabase'
import {
    AUTH_ERRORS,
    AUTH_PROVIDERS,
    AUTH_ROUTES,
    getAuthRedirectUrl,
    getAuthProviderScopes,
    getProfileForUser,
    normalizeAuthEmail,
    normalizeRole,
    type AuthResponse,
    type OAuthProvider,
    type OAuthResponse,
    type Session,
    type User,
    type UserRole,
} from '../lib/auth'

export interface AuthContextValue {
    user: User | null
    session: Session | null
    profile: Profile | null
    profileError: Error | null
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
    const [profileError, setProfileError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const authRequestIdRef = useRef(0)

    const applySession = useCallback(async (nextSession: Session | null) => {
        const requestId = ++authRequestIdRef.current
        setSession(nextSession)
        setUser(nextSession?.user ?? null)

        if (!nextSession?.user) {
            setProfile(null)
            setProfileError(null)
            return null
        }

        const { profile: nextProfile, error } = await getProfileForUser(nextSession.user.id)
        if (requestId !== authRequestIdRef.current) return nextProfile

        setProfile(nextProfile)
        setProfileError(error ?? null)
        return nextProfile
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                await applySession(currentSession)
            } catch (err) {
                console.error('Failed to initialize auth:', err)
                setProfileError(err instanceof Error ? err : new Error(AUTH_ERRORS.GENERIC))
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setIsLoading(true)
                await applySession(newSession)
                setIsLoading(false)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [applySession])

    const signUp = useCallback(
        async (email: string, password: string, options?: { data?: Record<string, unknown> }): Promise<AuthResponse> => {
            if (!isSupabaseConfigured) {
                return {
                    data: { user: null, session: null },
                    error: new Error(SUPABASE_CONFIG_ERROR),
                } as AuthResponse
            }

            const response = await supabase.auth.signUp({
                email: normalizeAuthEmail(email),
                password,
                options: {
                    data: options?.data,
                    emailRedirectTo: getAuthRedirectUrl(),
                },
            })

            if (!response.error && response.data.session?.user) {
                const metadata = options?.data ?? {}
                const { error: profileUpsertError } = await supabase
                    .from('profiles')
                    .upsert(
                        {
                            id: response.data.session.user.id,
                            full_name: typeof metadata.full_name === 'string' ? metadata.full_name : null,
                            role: typeof metadata.role === 'string' ? metadata.role : 'USER',
                            org_website: typeof metadata.org_website === 'string' ? metadata.org_website : null,
                            org_industry: typeof metadata.org_industry === 'string' ? metadata.org_industry : null,
                            org_size: typeof metadata.org_size === 'string' ? metadata.org_size : null,
                        },
                        { onConflict: 'id' }
                    )

                if (profileUpsertError) {
                    return {
                        ...response,
                        error: profileUpsertError,
                    } as AuthResponse
                }

                await applySession(response.data.session)
            }

            return response
        },
        [applySession]
    )

    const signIn = useCallback(
        async (email: string, password: string): Promise<AuthResponse> => {
            if (!isSupabaseConfigured) {
                return {
                    data: { user: null, session: null },
                    error: new Error(SUPABASE_CONFIG_ERROR),
                } as AuthResponse
            }

            return await supabase.auth.signInWithPassword({ email: normalizeAuthEmail(email), password })
        },
        []
    )

    const signInWithOAuth = useCallback(
        async (provider: OAuthProvider): Promise<OAuthResponse> => {
            if (!isSupabaseConfigured) {
                return {
                    data: { provider, url: null },
                    error: new Error(SUPABASE_CONFIG_ERROR),
                } as OAuthResponse
            }

            return await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: getAuthRedirectUrl(),
                    scopes: getAuthProviderScopes(provider),
                    queryParams: {
                        prompt: 'select_account',
                    },
                },
            })
        },
        []
    )

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
        setProfile(null)
        setProfileError(null)
    }, [])

    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: getAuthRedirectUrl(AUTH_ROUTES.SIGN_IN),
        })
        return { error }
    }, [])

    const refreshSession = useCallback(async () => {
        const { data: { session: refreshed } } = await supabase.auth.refreshSession()
        await applySession(refreshed)
    }, [applySession])

    const checkEmailExists = useCallback(async (email: string) => {
        if (!isSupabaseConfigured) return false

        try {
            const { data, error } = await supabase.rpc('is_email_registered', { email_address: email })
            if (error) {
                console.warn('Email precheck unavailable; continuing with Supabase Auth signup.', error)
                return false
            }
            return !!data
        } catch (error) {
            console.warn('Email precheck failed; continuing with Supabase Auth signup.', error)
            return false
        }
    }, [])

    const isAuthenticated = useMemo(() => !!user && !!session, [user, session])
    const role = useMemo<UserRole>(() => normalizeRole(profile?.role), [profile?.role])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            session,
            profile,
            profileError,
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
        [user, session, profile, profileError, role, isAuthenticated, isLoading, signUp, signIn, signInWithOAuth, signOut, resetPassword, refreshSession, checkEmailExists]
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

export { AUTH_ERRORS, AUTH_PROVIDERS, AUTH_ROUTES }
export type { User, Session, AuthResponse, OAuthResponse, UserRole }
