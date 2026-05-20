import { useState } from 'react'
import { Building2, ChevronDown, Eye, EyeOff, Globe, ListChecks, Lock, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
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

function OrganizationSignUpPage() {
  const navigate = useNavigate()
  const { signUp, signInWithOAuth, checkEmailExists } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [orgWebsite, setOrgWebsite] = useState('')
  const [orgIndustry, setOrgIndustry] = useState('')
  const [orgSize, setOrgSize] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const emailExists = await checkEmailExists(email)
      if (emailExists) {
        setError('Organization user already exists. Please log in with your details.')
        return
      }

      const { data, error: signUpError } = await signUp(email.trim(), password, {
        data: {
          full_name: orgName.trim(),
          role: 'COMPANY',
          org_website: orgWebsite || undefined,
          org_industry: orgIndustry || undefined,
          org_size: orgSize || undefined,
        },
      })

      if (signUpError) {
        setError(signUpError.message || AUTH_ERRORS.SIGN_UP_FAILED)
        return
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'COMPANY' })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Error updating organization profile role:', profileError)
        }

        setError('Please check your email to verify your organization account.')
        setTimeout(() => navigate(AUTH_ROUTES.ORG_SIGN_IN), 3000)
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
      rememberAuthPortal('organization')
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
          <a href="/organization" className="mb-12 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#7170ff]">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Turnve Organizations</span>
          </a>

          <div className="max-w-md">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              Build simulations for your team.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-text-secondary">
              Create an organization workspace to design simulations, manage training cohorts, and track team performance.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-text-tertiary">© 2026 Turnve Organizations. All rights reserved.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-foreground">Create your organization</h2>
            <p className="text-text-secondary">Set up a dedicated workspace for team simulations.</p>
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
              <label htmlFor="orgName" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Organization Name
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-quaternary" />
                <input
                  type="text"
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-[6px] border border-border bg-input px-4 py-3 pl-11 text-foreground transition-shadow placeholder:text-text-quaternary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Work Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-quaternary" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
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
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-quaternary" />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="orgIndustry" className="block text-sm font-medium text-text-secondary">
                  Industry
                </label>
                <div className="relative">
                  <select
                    id="orgIndustry"
                    value={orgIndustry}
                    onChange={(e) => setOrgIndustry(e.target.value)}
                    className="w-full appearance-none rounded-[6px] border border-border bg-input px-4 py-3 pr-10 text-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  >
                    <option value="" disabled>Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="orgSize" className="block text-sm font-medium text-text-secondary">
                  Team Size
                </label>
                <div className="relative">
                  <select
                    id="orgSize"
                    value={orgSize}
                    onChange={(e) => setOrgSize(e.target.value)}
                    className="w-full appearance-none rounded-[6px] border border-border bg-input px-4 py-3 pr-10 text-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                  >
                    <option value="" disabled>Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501+">501+</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="orgWebsite" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Company Website
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-quaternary" />
                <input
                  type="url"
                  id="orgWebsite"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full rounded-[6px] border border-border bg-input px-4 py-3 pl-11 text-foreground transition-shadow placeholder:text-text-quaternary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
                />
              </div>
            </div>

            <div className="rounded-[6px] border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="flex items-start gap-2 text-xs text-blue-300">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0" />
                Organization accounts create simulations, manage teams, and review analytics from a separate dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !orgName.trim()}
              className="w-full rounded-[6px] bg-[#5e6ad2] py-3.5 font-semibold text-white transition-colors hover:bg-[#828fff] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating Organization...' : 'Create Organization Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-text-secondary">
            Already have an organization account?{' '}
            <a href={AUTH_ROUTES.ORG_SIGN_IN} className="font-medium text-[#7170ff] hover:text-[#828fff]">
              Log in
            </a>
          </p>

          <p className="mt-4 text-center text-sm text-text-secondary">
            Creating a personal account?{' '}
            <a href={AUTH_ROUTES.SIGN_UP} className="font-medium text-[#7170ff] hover:text-[#828fff]">
              Individual sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrganizationSignUpPage
