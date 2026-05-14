import type { AuthResponse, OAuthResponse, Session, User } from '@supabase/supabase-js'
import { profiles, supabase, type Profile } from './supabase'

export type UserRole = 'USER' | 'RECRUITER' | 'COMPANY' | 'MENTOR' | 'ADMIN'
export type AuthPortal = 'individual' | 'organization' | 'admin'

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
  ORG_SIGN_IN: '/organization/login',
  ADMIN_SIGN_IN: '/admin/login',
  SIGN_UP: '/sign-up',
  CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  COMPANY: '/company',
  ADMIN: '/admin',
} as const

const AUTH_PORTAL_STORAGE_KEY = 'turnve_auth_portal'
const USER_ROLES: readonly UserRole[] = ['USER', 'RECRUITER', 'COMPANY', 'MENTOR', 'ADMIN']

export type OAuthProvider = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS]

export interface PortalValidationResult {
  error: string | null
  redirectPath: string
}

export function getAuthRedirectUrl(path = AUTH_ROUTES.CALLBACK) {
  return `${window.location.origin}${path}`
}

export function normalizeRole(role?: string | null): UserRole {
  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : 'USER'
}

export function getPostAuthRedirectPath(role: UserRole, portal?: AuthPortal) {
  if (portal === 'admin' && role === 'ADMIN') return AUTH_ROUTES.ADMIN
  if (role === 'COMPANY') return AUTH_ROUTES.COMPANY
  return AUTH_ROUTES.DASHBOARD
}

export function getPortalLoginPath(portal: AuthPortal) {
  if (portal === 'organization') return AUTH_ROUTES.ORG_SIGN_IN
  if (portal === 'admin') return AUTH_ROUTES.ADMIN_SIGN_IN
  return AUTH_ROUTES.SIGN_IN
}

export function rememberAuthPortal(portal: AuthPortal) {
  window.localStorage.setItem(AUTH_PORTAL_STORAGE_KEY, portal)
}

export function consumeAuthPortal(): AuthPortal {
  const portal = window.localStorage.getItem(AUTH_PORTAL_STORAGE_KEY)
  window.localStorage.removeItem(AUTH_PORTAL_STORAGE_KEY)
  return portal === 'organization' || portal === 'admin' ? portal : 'individual'
}

export async function getProfileForUser(userId: string) {
  const { profile, error } = await profiles.getProfile(userId)
  return { profile, error }
}

export async function getCurrentProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { profile: null, error: userError ?? new Error(AUTH_ERRORS.NOT_AUTHENTICATED) }
  }

  return getProfileForUser(user.id)
}

export function validatePortalAccess(profile: Profile | null, portal: AuthPortal): PortalValidationResult {
  const role = normalizeRole(profile?.role)

  if (portal === 'organization' && role !== 'COMPANY') {
    return {
      error: 'This account is not an organization account. Use the individual sign in page.',
      redirectPath: AUTH_ROUTES.ORG_SIGN_IN,
    }
  }

  if (portal === 'individual' && role === 'COMPANY') {
    return {
      error: 'Organization accounts must sign in from the organization portal.',
      redirectPath: AUTH_ROUTES.SIGN_IN,
    }
  }

  if (portal === 'admin' && role !== 'ADMIN') {
    return {
      error: 'You do not have permission to access the admin panel.',
      redirectPath: AUTH_ROUTES.ADMIN_SIGN_IN,
    }
  }

  return {
    error: null,
    redirectPath: getPostAuthRedirectPath(role, portal),
  }
}

export type { AuthResponse, OAuthResponse, Session, User }
