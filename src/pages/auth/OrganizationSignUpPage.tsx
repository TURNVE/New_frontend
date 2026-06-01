import { useEffect, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  ListChecks,
  Lock,
  Mail,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/layout/Header'
import { useAuth } from '../../hooks/useAuth'
import { SUPABASE_CONFIG_ERROR, isSupabaseConfigured, supabase } from '../../lib/supabase'
import { AUTH_ERRORS, AUTH_ROUTES } from '../../contexts/AuthContext'
import { normalizeAuthEmail } from '../../lib/auth'

const WEBSITE_PROTOCOL = 'https://'

const normalizeWebsiteDomain = (value: string): string =>
  value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, 'www.')
    .replace(/\/+$/, '')

const buildWebsiteUrl = (domain: string): string | undefined => {
  const normalizedDomain = normalizeWebsiteDomain(domain)

  return normalizedDomain ? `${WEBSITE_PROTOCOL}${normalizedDomain}` : undefined
}

function OrganizationSignUpPage() {
  const navigate = useNavigate()
  const { user, signUp, checkEmailExists, refreshSession } = useAuth()
  const isUpgradeFlow = !!user
  const [currentStep, setCurrentStep] = useState<'organization' | 'account'>('organization')
  const [showPassword, setShowPassword] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [orgWebsite, setOrgWebsite] = useState('')
  const [orgIndustry, setOrgIndustry] = useState('')
  const [orgSize, setOrgSize] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerificationPromptOpen, setIsVerificationPromptOpen] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  useEffect(() => {
    if (!isVerificationPromptOpen) return

    if (redirectCountdown <= 0) {
      navigate(AUTH_ROUTES.ORG_SIGN_IN)
      return
    }

    const timer = window.setTimeout(() => {
      setRedirectCountdown((currentCountdown) => currentCountdown - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [isVerificationPromptOpen, navigate, redirectCountdown])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!isUpgradeFlow && currentStep === 'organization') {
      setCurrentStep('account')
      return
    }

    setIsLoading(true)

    try {
      if (!isSupabaseConfigured) {
        setError(SUPABASE_CONFIG_ERROR)
        return
      }

      const websiteUrl = buildWebsiteUrl(orgWebsite)

      if (isUpgradeFlow && user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: orgName.trim(),
            role: 'COMPANY',
            org_website: websiteUrl || null,
            org_industry: orgIndustry || null,
            org_size: orgSize || null,
          })
          .eq('id', user.id)

        if (profileError) {
          setError(profileError.message || 'Failed to save organization details.')
          return
        }

        await refreshSession()
        navigate(AUTH_ROUTES.COMPANY, { replace: true })
        return
      }

      const normalizedEmail = normalizeAuthEmail(email)
      const emailExists = await checkEmailExists(normalizedEmail)
      if (emailExists) {
        setError('Organization user already exists. Please log in with your details.')
        return
      }

      const { data, error: signUpError } = await signUp(normalizedEmail, password, {
        data: {
            full_name: orgName.trim(),
          role: 'COMPANY',
          org_website: websiteUrl,
          org_industry: orgIndustry || undefined,
          org_size: orgSize || undefined,
        },
      })

      if (signUpError) {
        setError(signUpError.message || AUTH_ERRORS.SIGN_UP_FAILED)
        return
      }

      if (data.user) {
        if (data.session) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: data.user.id,
                full_name: orgName.trim(),
                role: 'COMPANY',
                org_website: websiteUrl || null,
                org_industry: orgIndustry || null,
                org_size: orgSize || null,
              },
              { onConflict: 'id' }
            )

          if (profileError) {
            setError(profileError.message || 'Failed to save organization details.')
            return
          }

          await refreshSession()
          navigate(AUTH_ROUTES.COMPANY, { replace: true })
          return
        }

        setRedirectCountdown(5)
        setIsVerificationPromptOpen(true)
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC)
    } finally {
      setIsLoading(false)
    }
  }

  const canContinueOrganization = Boolean(orgName.trim() && orgIndustry && orgSize)
  const isAccountStep = !isUpgradeFlow && currentStep === 'account'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      {isVerificationPromptOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="verification-title"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-8 text-center shadow-2xl shadow-black/30">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Organization account created
            </p>
            <h2 id="verification-title" className="text-3xl font-bold text-foreground">
              Check your email to verify your account.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-text-secondary">
              We sent a verification link to your work email. You can close this page after
              checking your inbox, or continue to sign in when you are ready.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-background/60 px-4 py-3">
              <p className="text-sm font-medium text-text-secondary">
                Redirecting to organization sign in in{' '}
                <span className="font-bold text-foreground">{redirectCountdown}</span>
                s
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate(AUTH_ROUTES.ORG_SIGN_IN)}
                className="inline-flex items-center justify-center rounded-[6px] bg-[#5e6ad2] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#828fff]"
              >
                Go to sign in
              </button>
              <button
                type="button"
                onClick={() => setIsVerificationPromptOpen(false)}
                className="inline-flex items-center justify-center rounded-[6px] border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Stay on this page
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-3xl items-center justify-center rounded-2xl border border-border bg-card/50 p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            {!isUpgradeFlow && (
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-[6px] border border-border bg-background/60 p-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep('organization')}
                  className={`rounded-[5px] px-4 py-2 text-sm font-semibold transition-colors ${
                    currentStep === 'organization'
                      ? 'bg-[#5e6ad2] text-white'
                      : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  Organization
                </button>
                <button
                  type="button"
                  onClick={() => canContinueOrganization && setCurrentStep('account')}
                  className={`rounded-[5px] px-4 py-2 text-sm font-semibold transition-colors ${
                    currentStep === 'account'
                      ? 'bg-[#5e6ad2] text-white'
                      : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  Account
                </button>
              </div>
            )}

            <h2 className="mb-2 text-3xl font-bold text-foreground">
              {isUpgradeFlow
                ? 'Create your organization'
                : currentStep === 'organization'
                  ? 'Tell us about your organization'
                  : 'Create your admin account'}
            </h2>
            <p className="text-text-secondary">
              {isUpgradeFlow
                ? 'Your current account will become the owner of this organization workspace.'
                : currentStep === 'organization'
                  ? 'Set up the workspace your team will use for simulations.'
                  : 'Use a work email and password to manage the organization dashboard.'}
            </p>
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

            {isAccountStep && (
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
            )}

            {isAccountStep && (
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
            )}

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
                    required
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
                    required
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
              <div className="group flex min-h-[50px] items-center overflow-hidden rounded-[6px] border border-border bg-input transition-shadow focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#7170ff]">
                <div className="flex h-full items-center gap-2 border-r border-border bg-surface/40 px-4 text-text-secondary">
                  <Globe className="h-5 w-5 text-text-quaternary" />
                  <span className="text-sm font-semibold" aria-hidden="true">
                    https://
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="url"
                  id="orgWebsite"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(normalizeWebsiteDomain(e.target.value))}
                  onBlur={(e) => setOrgWebsite(normalizeWebsiteDomain(e.target.value))}
                  placeholder="company.com"
                  aria-describedby="orgWebsiteHelp"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-text-quaternary"
                />
              </div>
              <p id="orgWebsiteHelp" className="mt-1.5 text-xs text-text-tertiary">
                Enter your domain only. We will add https:// automatically.
              </p>
            </div>

            <div className="rounded-[6px] border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="flex items-start gap-2 text-xs text-blue-300">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0" />
                Organization accounts create simulations, manage teams, and review analytics from a separate dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !canContinueOrganization ||
                (isAccountStep && (!email.trim() || password.length < 6))
              }
              className="w-full rounded-[6px] bg-[#5e6ad2] py-3.5 font-semibold text-white transition-colors hover:bg-[#828fff] focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? isUpgradeFlow ? 'Creating Organization...' : 'Creating Organization...'
                : isUpgradeFlow
                  ? 'Create Organization'
                  : currentStep === 'organization'
                    ? 'Continue to Account'
                    : 'Create Organization Account'}
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
      </main>
    </div>
  )
}

export default OrganizationSignUpPage
