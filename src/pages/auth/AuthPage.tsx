import React, { useCallback, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { AUTH_ERRORS } from '../../contexts/AuthContext';
import {
  isSupabaseConfigured,
  SUPABASE_CONFIG_ERROR as supabaseConfigError,
} from '../../lib/supabase';
import {
  getPostAuthRedirectPath,
  getProfileForUser,
  normalizeAuthEmail,
  normalizeRole,
  rememberAuthPortal,
} from '../../lib/auth';
import { cn } from '../../lib/utils';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthPageProps {
  mode: AuthMode;
}

const accountOptions = [
  { value: 'organization', label: 'Organization', icon: Building2 },
  { value: 'individual', label: 'Individual', icon: User },
] as const;

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.61 20.08H42V20H24v8h11.3c-1.65 4.66-6.08 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20c0-1.34-.14-2.65-.39-3.92Z"
    />
    <path
      fill="#FF3D00"
      d="m6.31 14.69 6.57 4.82C14.66 15.11 18.96 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69Z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.17 0 9.86-1.98 13.41-5.19l-6.19-5.24C29.21 35.09 26.72 36 24 36c-5.2 0-9.62-3.32-11.28-7.95l-6.52 5.03C9.5 39.56 16.23 44 24 44Z"
    />
    <path
      fill="#1976D2"
      d="M43.61 20.08H42V20H24v8h11.3a12.04 12.04 0 0 1-4.08 5.57l6.19 5.24C36.97 39.2 44 34 44 24c0-1.34-.14-2.65-.39-3.92Z"
    />
  </svg>
);

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signInWithOAuth,
    signUp,
    isAuthenticated,
    isLoading,
    profile,
    role,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('organization');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === 'sign-up';
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const destination = useMemo(() => {
    if (from && from !== '/') return from;
    if (isAuthenticated) return getPostAuthRedirectPath(role);
    return getPostAuthRedirectPath(accountType === 'organization' ? 'COMPANY' : 'USER');
  }, [accountType, from, isAuthenticated, role]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const normalizedEmail = normalizeAuthEmail(form.email);

      if (isSignUp) {
        const nextRole = accountType === 'organization' ? 'COMPANY' : 'USER';
        const { data, error: signUpError } = await signUp(normalizedEmail, form.password, {
          data: {
            full_name: form.fullName.trim(),
            role: nextRole,
            organization_name: form.organizationName.trim(),
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          navigate(getPostAuthRedirectPath(nextRole), { replace: true });
          return;
        }

        if (data.user) {
          setNotice('Account created. Check your email to confirm your account, then sign in.');
        }
      } else {
        const { data, error: signInError } = await signIn(normalizedEmail, form.password);
        if (signInError || !data.user) {
          throw signInError ?? new Error(AUTH_ERRORS.SIGN_IN_FAILED);
        }

        const { profile: signedInProfile } = await getProfileForUser(data.user.id);
        const signedInRole = normalizeRole(signedInProfile?.role ?? profile?.role);
        navigate(from || getPostAuthRedirectPath(signedInRole), { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    accountType,
    form.email,
    form.fullName,
    form.organizationName,
    form.password,
    from,
    isSignUp,
    navigate,
    profile?.role,
    signIn,
    signUp,
  ]);

  const handleGoogleSignIn = useCallback(async () => {
    setOauthLoading(true);
    setError(null);
    setNotice(null);

    try {
      rememberAuthPortal(isSignUp && accountType === 'organization' ? 'organization' : 'individual');
      const { error: oauthError } = await signInWithOAuth('google');
      if (oauthError) {
        setError(oauthError.message || AUTH_ERRORS.OAUTH_FAILED);
        setOauthLoading(false);
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC);
      setOauthLoading(false);
    }
  }, [accountType, isSignUp, signInWithOAuth]);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#0a142f]">
      <div className="grid min-h-screen lg:grid-cols-[0.94fr_1.06fr]">
        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <ScrollReveal className="w-full max-w-[430px]">
            <Link to="/" className="mb-10 inline-flex items-center">
              <img src="/turnve-logo-original.jpg" alt="TURNVE" className="h-10 w-auto" />
            </Link>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-56px_rgba(10,20,47,0.5)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  {isSignUp ? 'Create account' : 'Welcome back'}
                </p>
                <h1 className="mt-3 text-[32px] font-black leading-tight tracking-[-0.035em] text-[#0a142f]">
                  {isSignUp ? 'Start building career proof.' : 'Sign in to TURNVE.'}
                </h1>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {isSignUp
                    ? 'Use simulations, AI feedback, and portfolio records to show what you can do.'
                    : 'Continue your simulations, portfolio work, and organization dashboard.'}
                </p>
              </div>

              {!isSupabaseConfigured && (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                  Auth is not connected locally. Add `VITE_SUPABASE_URL` and
                  `VITE_SUPABASE_ANON_KEY` to enable sign in.
                </div>
              )}

              {isSignUp && (
                <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  {accountOptions.map((item) => {
                    const Icon = item.icon;
                    const selected = accountType === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setAccountType(item.value)}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-colors',
                          selected ? 'bg-[#0a142f] text-white shadow-sm' : 'text-slate-600 hover:bg-white',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={oauthLoading || submitting || !isSupabaseConfigured}
                title={!isSupabaseConfigured ? supabaseConfigError : undefined}
                className="mb-5 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <GoogleIcon />
                {oauthLoading
                  ? 'Opening Google...'
                  : isSignUp
                    ? 'Sign up with Google'
                    : 'Continue with Google'}
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 font-semibold tracking-[0.12em] text-slate-400">
                    or use email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <AuthField
                    icon={User}
                    label="Full name"
                    placeholder="Ada Johnson"
                    value={form.fullName}
                    onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
                    required
                  />
                )}

                {isSignUp && accountType === 'organization' && (
                  <AuthField
                    icon={Building2}
                    label="Organization name"
                    placeholder="Acme Learning Group"
                    value={form.organizationName}
                    onChange={(value) => setForm((prev) => ({ ...prev, organizationName: value }))}
                    required
                  />
                )}

                <AuthField
                  icon={Mail}
                  label="Email"
                  placeholder="you@company.com"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                  required
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Password</span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      minLength={8}
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
                {notice && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p>}

                <button
                  type="submit"
                  disabled={submitting || !isSupabaseConfigured}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-55"
                  title={!isSupabaseConfigured ? supabaseConfigError : undefined}
                >
                  {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm font-medium text-slate-600">
                {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
                <Link to={isSignUp ? '/sign-in' : '/sign-up'} className="font-bold text-blue-600 hover:text-blue-700">
                  {isSignUp ? 'Sign in' : 'Create one'}
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="hidden bg-[#061225] p-6 text-white lg:flex">
          <ScrollReveal direction="left" className="relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[#071225] p-10">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1300&q=82"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-42"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#061225]/94 via-[#061225]/70 to-blue-950/50" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Practical proof for real roles
              </div>
              <h2 className="mt-8 max-w-xl text-[46px] font-black leading-[1.02] tracking-[-0.04em]">
                Practise work. Get feedback. Show proof.
              </h2>
              <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white/70">
                TURNVE helps early-career talent and organizations move past CV claims with
                inspectable work records.
              </p>
            </div>
            <div className="relative grid gap-3">
              {[
                'AI-guided simulations',
                'Portfolio-ready outputs',
                'Organization-ready workspaces',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.09] px-4 py-3 text-sm font-bold text-slate-100 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      </div>
    </main>
  );
}

interface AuthFieldProps {
  icon: typeof Mail;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function AuthField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}
