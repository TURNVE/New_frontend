/**
 * useAuth — Thin re-export from AuthContext.
 *
 * This hook is a convenience wrapper. All auth state and methods live
 * in `AuthContext`. Consuming components call `useAuth()` exactly as before.
 */
export { useAuth } from '../contexts/AuthContext'
export type { AuthContextValue as UseAuthReturn } from '../contexts/AuthContext'
export type { User, Session, AuthResponse, OAuthResponse } from '@supabase/supabase-js'
