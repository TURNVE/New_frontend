import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  AUTH_ROUTES,
  consumeAuthPortal,
  getPortalLoginPath,
  getPostAuthRedirectPath,
  getProfileForUser,
  normalizeRole,
  type AuthPortal,
} from '../../lib/auth'
import type { Session } from '../../lib/auth'

const AUTH_TIMEOUT_MS = 15000
const PROFILE_TIMEOUT_MS = 3500

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), timeoutMs)

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timer))
  })
}

function getStoredPortal(): AuthPortal {
  try {
    return consumeAuthPortal()
  } catch {
    return 'individual'
  }
}

function cacheSessionForApp(session: Session | null) {
  if (!session) return

  window.localStorage.setItem('turnve_cached_session', JSON.stringify(session))
  window.localStorage.setItem('turnve_cached_user', JSON.stringify(session.user))
}

function completeRedirect(path: string) {
  window.location.replace(path)
}

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)
  const [returnPath, setReturnPath] = useState(AUTH_ROUTES.SIGN_IN)

  useEffect(() => {
    let isMounted = true

    const handleOAuthCallback = async () => {
      const authPortal = getStoredPortal()
      setReturnPath(getPortalLoginPath(authPortal))

      try {
        const { searchParams, hash } = new URL(window.location.href)
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error_description') || searchParams.get('error')

        if (errorParam) {
          if (isMounted) setError(errorParam)
          return
        }

        let sessionUserId: string | undefined
        let metadataRole: string | undefined

        if (code) {
          const { data, error: exchangeError } = await withTimeout(
            supabase.auth.exchangeCodeForSession(code),
            AUTH_TIMEOUT_MS,
            'Authentication took too long. Please go back and try signing in again.',
          )

          if (exchangeError) {
            if (isMounted) setError(exchangeError.message)
            return
          }

          sessionUserId = data.session?.user.id
          metadataRole =
            typeof data.session?.user.user_metadata?.role === 'string'
              ? data.session.user.user_metadata.role
              : undefined
        } else if (hash) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')

          if (accessToken && refreshToken) {
            const { data, error: sessionError } = await withTimeout(
              supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              }),
              AUTH_TIMEOUT_MS,
              'Authentication took too long. Please go back and try signing in again.',
            )

            if (sessionError) {
              if (isMounted) setError(sessionError.message)
              return
            }

            sessionUserId = data.session?.user.id
            metadataRole =
              typeof data.session?.user.user_metadata?.role === 'string'
                ? data.session.user.user_metadata.role
                : undefined
          }
        }

        const {
          data: { session },
        } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS,
          'Could not confirm your session. Please try signing in again.',
        )

        cacheSessionForApp(session)

        if (!code && !hash && !session) {
          completeRedirect(getPortalLoginPath(authPortal))
          return
        }

        const userId = sessionUserId ?? session?.user.id
        let profileRole: string | undefined

        if (userId) {
          try {
            const { profile } = await withTimeout(
              getProfileForUser(userId),
              PROFILE_TIMEOUT_MS,
              'Profile lookup timed out.',
            )
            profileRole = profile?.role
          } catch (profileError) {
            console.warn('OAuth profile lookup skipped:', profileError)
            if (isMounted) setDetails('Signed in. Loading your workspace...')
          }
        }

        const nextRole = normalizeRole(profileRole ?? metadataRole ?? session?.user.user_metadata?.role)
        const redirectPath =
          authPortal === 'organization'
            ? AUTH_ROUTES.COMPANY
            : getPostAuthRedirectPath(nextRole, authPortal)

        completeRedirect(redirectPath)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to complete authentication. Please try again.')
        }
      }
    }

    handleOAuthCallback()

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(returnPath)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
        {details && <p className="mt-2 text-sm text-gray-500">{details}</p>}
      </div>
    </div>
  )
}

export default OAuthCallbackPage
