import { useEffect, useState } from 'react'
import { ChevronDown, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AUTH_ERRORS, AUTH_ROUTES } from '../../contexts/AuthContext'
import { rememberAuthPortal } from '../../lib/auth'

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#FFC107" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#FF3D00" d="M5.26 10.59l2.88 2.11C8.87 10.62 10.72 9 13.5 9c1.45 0 2.77.52 3.8 1.38l2.84-2.84C18.24 5.72 16.03 4.5 13.5 4.5c-3.62 0-6.75 2.08-8.24 5.09z" />
    <path fill="#4CAF50" d="M13.5 19.5c-2.17 0-4.14-.81-5.65-2.15l-2.92 2.26C6.55 21.47 9.79 23 13.5 23c2.85 0 5.56-1.04 7.66-2.92l-3.31-2.55c-1.17.79-2.68 1.97-4.35 1.97z" />
    <path fill="#1976D2" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  </svg>
)

export const SignUpPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signUp, signInWithOAuth, checkEmailExists } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [roleInterest, setRoleInterest] = useState('product-manager')
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('type') === 'organization') {
      navigate(AUTH_ROUTES.ORG_SIGN_UP, { replace: true })
    }
  }, [navigate, searchParams])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const emailExists = await checkEmailExists(email)
      if (emailExists) {
        setError('User already exists. Please log in with your details.')
        return
      }

      const { data, error: signUpError } = await signUp(email.trim(), password, {
        data: {
          full_name: fullName.trim(),
          role: 'USER',
          role_interest: roleInterest,
        },
      })

      if (signUpError) {
        setError(signUpError.message || AUTH_ERRORS.SIGN_UP_FAILED)
        return
      }

      if (data.user) {
        setError('Please check your email to verify your account.')
        setTimeout(() => navigate(AUTH_ROUTES.SIGN_IN), 3000)
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsOAuthLoading(true)
    setError(null)

    try {
      rememberAuthPortal('individual')
      const { error: oauthError } = await signInWithOAuth('google')
      if (oauthError) {
        setError(oauthError.message || AUTH_ERRORS.OAUTH_FAILED)
        setIsOAuthLoading(false)
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC)
      setIsOAuthLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f1011] via-[#191a1b] to-[#08090a] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-[#5e6ad2]/20 blur-3xl" />
          <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-[#7170ff]/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#7170ff]">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">Turnve</span>
          </div>

          <div className="max-w-md">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              Build career proof through practice.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-text-secondary">
              Create an individual account to access career simulations, build a portfolio, and benchmark your professional growth.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-text-tertiary">© 2026 Turnve Career Simulator. All rights reserved.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-foreground">Create your profile</h2>
            <p className="text-text-secondary">Start your professional journey today.</p>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5e6ad2] text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Individual account</p>
                <p className="text-xs text-text-tertiary">For career growth and personal simulations</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isOAuthLoading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-[6px] border border-border px-4 py-3 transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-text-secondary">{isOAuthLoading ? 'Loading...' : 'Sign up with Google'}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-text-tertiary">or continue with</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-[6px] border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-text-quaternary" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-[6px] border border-border bg-input px-4 py-3 pl-11 text-foreground transition-shadow placeholder:text-text-quaternary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Professional Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-text-quaternary" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.r@company.com"
                  className="w-full rounded-[6px] border border-border bg-input px-4 py-3 pl-11 text-foreground transition-shadow placeholder:text-text-quaternary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Create Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-text-quaternary" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-[6px] border border-border bg-input px-4 py-3 pl-11 pr-12 text-foreground transition-shadow placeholder:text-text-quaternary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="roleInterest" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Role Interest
              </label>
              <div className="relative">
                <select
                  id="roleInterest"
                  value={roleInterest}
                  onChange={(e) => setRoleInterest(e.target.value)}
                  className="w-full appearance-none rounded-[6px] border border-border bg-input px-4 py-3 pr-11 text-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  required
                >
                  <option value="product-manager">Product Manager</option>
                  <option value="engineering-manager">Engineering Manager</option>
                  <option value="data-analytics">Data & Analytics</option>
                  <option value="operations">Operations Manager</option>
                  <option value="consulting">Consulting</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-[6px] bg-[#5e6ad2] py-3.5 font-semibold text-white transition-colors hover:bg-[#828fff] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-text-secondary">
            Already have an account?{' '}
            <a href={AUTH_ROUTES.SIGN_IN} className="font-medium text-[#7170ff] hover:text-[#828fff]">
              Log in
            </a>
          </p>

          <p className="mt-4 text-center text-sm text-text-secondary">
            Joining as a company?{' '}
            <a href={AUTH_ROUTES.ORG_SIGN_UP} className="font-medium text-[#7170ff] hover:text-[#828fff]">
              Create an organization account
            </a>
          </p>

          <p className="mt-8 text-center text-xs leading-relaxed text-text-tertiary">
            By signing up, you agree to our <a href="#" className="text-[#7170ff] hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-[#7170ff] hover:underline">Privacy Policy</a>. Turnve is a professional simulator platform for career benchmarking.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
