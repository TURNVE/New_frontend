import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Lock, LogOut, Mail, Shield } from 'lucide-react'
import { useAuth, AUTH_ERRORS } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getAdminRedirectPath, getProfileForUser, rememberAuthPortal, validatePortalAccess } from '@/lib/auth'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, isAuthenticated, role, signIn, signInWithOAuth, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const requestedPath = getAdminRedirectPath((location.state as { from?: string })?.from)

  useEffect(() => {
    if (!isLoading && isAuthenticated && role === 'ADMIN') {
      navigate(requestedPath, { replace: true })
    }

    if (!isLoading && isAuthenticated && role !== 'ADMIN') {
      setError('You do not have permission to access the admin panel.')
    }
  }, [isLoading, isAuthenticated, role, navigate, requestedPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      rememberAuthPortal('admin')
      const { data, error: signInError } = await signIn(email.trim(), password)
      if (signInError || !data.user) {
        setError(signInError?.message || AUTH_ERRORS.SIGN_IN_FAILED)
        return
      }

      const { profile } = await getProfileForUser(data.user.id)
      const access = validatePortalAccess(profile, 'admin')
      if (access.error) {
        await signOut()
        setError(access.error)
        return
      }

      navigate(getAdminRedirectPath(access.redirectPath), { replace: true })
    } catch {
      setError(AUTH_ERRORS.GENERIC)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      rememberAuthPortal('admin')
      const { error: oauthError } = await signInWithOAuth('google')
      if (oauthError) {
        setError(oauthError.message || AUTH_ERRORS.OAUTH_FAILED)
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC)
    }
  }

  const handleSignOutCurrentUser = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      setError(null)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-[#8a8f98] transition-colors hover:text-[#d0d6e0]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to home</span>
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="hidden min-h-[560px] flex-col justify-between rounded-2xl border border-[#23252a] bg-[#111418] p-8 lg:flex">
            <div>
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#5e6ad2]/10 text-[#828fff]">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-[#f7f8f8]">
                Admin operations for Turnve content, users, and revenue.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#8a8f98]">
                Use this portal for privileged workflows only. Admin access is role-gated and non-admin accounts are signed out when they try to enter this surface.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ['Role check', 'ADMIN only'],
                ['Destination', requestedPath],
                ['Session', isAuthenticated ? role : 'Signed out'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#23252a] bg-[#0d0f11] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#5a5e66]">{label}</p>
                  <p className="mt-2 truncate text-sm font-medium text-[#d0d6e0]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-[#23252a] bg-[#111418] p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5e6ad2] to-[#7170ff]">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-[#f7f8f8]">Admin Portal</h1>
              <p className="text-sm text-[#8a8f98]">Sign in with an account assigned the ADMIN role.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <div className="text-sm text-red-500">
                    <p>{error}</p>
                    {isAuthenticated && role !== 'ADMIN' && (
                      <button
                        type="button"
                        onClick={handleSignOutCurrentUser}
                        disabled={isSigningOut}
                        className="mt-3 inline-flex items-center gap-2 text-[#ff8a8a] underline-offset-4 hover:underline disabled:opacity-60"
                      >
                        {isSigningOut ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
                        Sign out of this account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-[#d0d6e0]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8f98]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@turnve.com"
                    autoComplete="email"
                    required
                    className={cn(
                      'pl-10 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]',
                      'placeholder:text-[#5a5e66]',
                      'focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-[#d0d6e0]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8f98]" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    className={cn(
                      'pl-10 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]',
                      'placeholder:text-[#5a5e66]',
                      'focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]'
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="h-11 w-full bg-[#5e6ad2] text-white hover:bg-[#828fff]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Sign in as Admin
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#23252a]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111418] px-2 text-[#8a8f98]">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isSubmitting}
              className="h-11 w-full border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#8a8f98]">
                Not an admin?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/sign-in')}
                  className="text-[#7170ff] transition-colors hover:text-[#828fff]"
                >
                  Sign in as user
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#5a5e66]">
          Protected by Turnve Security. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
