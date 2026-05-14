import { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Mail, Lock, User, Building2, Briefcase, Globe, Users, ListChecks } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { AUTH_ROUTES, AUTH_ERRORS } from '../../contexts/AuthContext';
import { rememberAuthPortal } from '../../lib/auth';

type AccountType = 'individual' | 'organization';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#FFC107" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#FF3D00" d="M5.26 10.59l2.88 2.11C8.87 10.62 10.72 9 13.5 9c1.45 0 2.77.52 3.8 1.38l2.84-2.84C18.24 5.72 16.03 4.5 13.5 4.5c-3.62 0-6.75 2.08-8.24 5.09z" />
    <path fill="#4CAF50" d="M13.5 19.5c-2.17 0-4.14-.81-5.65-2.15l-2.92 2.26C6.55 21.47 9.79 23 13.5 23c2.85 0 5.56-1.04 7.66-2.92l-3.31-2.55c-1.17.79-2.68 1.97-4.35 1.97z" />
    <path fill="#1976D2" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  </svg>
);

export const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>(() => {
    return searchParams.get('type') === 'organization' ? 'organization' : 'individual';
  });
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgIndustry, setOrgIndustry] = useState('');
  const [orgSize, setOrgSize] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithOAuth, checkEmailExists } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError('User already exists. Please log in with your details.');
        setIsLoading(false);
        return;
      }

      const role = accountType === 'organization' ? 'COMPANY' : 'USER';
      const { data, error: signUpError } = await signUp(email, password, {
        data: { 
          full_name: accountType === 'organization' ? orgName : fullName, 
          role,
          org_website: orgWebsite || undefined,
          org_industry: orgIndustry || undefined,
          org_size: orgSize || undefined
        },
      });

      if (signUpError) {
        setError(signUpError.message || AUTH_ERRORS.SIGN_UP_FAILED);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile role:', profileError);
        }

        setError('Please check your email to verify your account.');
        const loginPath = accountType === 'organization' ? AUTH_ROUTES.ORG_SIGN_IN : AUTH_ROUTES.SIGN_IN;
        setTimeout(() => navigate(loginPath), 3000);
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsOAuthLoading(true);
    setError(null);

    try {
      rememberAuthPortal(accountType === 'organization' ? 'organization' : 'individual');
      const { error: oauthError } = await signInWithOAuth('google');

      if (oauthError) {
        setError(oauthError.message || AUTH_ERRORS.OAUTH_FAILED);
        setIsOAuthLoading(false);
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC);
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f1011] via-[#191a1b] to-[#08090a] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#5e6ad2]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#7170ff]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">Turnve</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Simulate your career growth.
            </h1>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Step into real-world professional scenarios, make high-stakes decisions, and accelerate your path to leadership with Turnve.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[rgba(94,106,210,0.2)] border border-[rgba(94,106,210,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#7170ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real-world Project Scenarios</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Experience 12-week simulations modeled after top-tier enterprise environments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[rgba(94,106,210,0.2)] border border-[rgba(94,106,210,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#7170ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Behavioral Data Insights</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Gain deep visibility into your decision-making patterns and resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-text-tertiary">© 2026 Turnve Career Simulator. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {accountType === 'organization' ? 'Create your organization' : 'Create your profile'}
            </h2>
            <p className="text-text-secondary">
              {accountType === 'organization'
                ? 'Create simulations, manage team training, and track progress.'
                : 'Start your professional journey today.'}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-text-secondary mb-2">I am signing up as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  accountType === 'individual'
                    ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 shadow-sm'
                    : 'border-border hover:border-[#5e6ad2]/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  accountType === 'individual'
                    ? 'bg-[#5e6ad2] text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${
                    accountType === 'individual' ? 'text-[#5e6ad2]' : 'text-foreground'
                  }`}>Individual</p>
                  <p className="text-xs text-text-tertiary">Career growth</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('organization')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  accountType === 'organization'
                    ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 shadow-sm'
                    : 'border-border hover:border-[#5e6ad2]/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  accountType === 'organization'
                    ? 'bg-[#5e6ad2] text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${
                    accountType === 'organization' ? 'text-[#5e6ad2]' : 'text-foreground'
                  }`}>Organization</p>
                  <p className="text-xs text-text-tertiary">Create & manage simulations</p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isOAuthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-[6px] hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span className="text-sm font-medium text-text-secondary">{isOAuthLoading ? 'Loading...' : 'Sign up with Google'}</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-text-tertiary">or continue with</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[6px]">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor={accountType === 'organization' ? 'orgName' : 'fullName'} className="block text-sm font-medium text-text-secondary mb-1.5">
                {accountType === 'organization' ? 'Organization Name' : 'Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {accountType === 'organization' ? (
                    <Building2 className="h-5 w-5 text-text-quaternary" />
                  ) : (
                    <User className="h-5 w-5 text-text-quaternary" />
                  )}
                </div>
                <input
                  type="text"
                  id={accountType === 'organization' ? 'orgName' : 'fullName'}
                  value={accountType === 'organization' ? orgName : fullName}
                  onChange={(e) => accountType === 'organization' ? setOrgName(e.target.value) : setFullName(e.target.value)}
                  placeholder={accountType === 'organization' ? 'Acme Corp' : 'Alex Rivera'}
                  className="w-full pl-11 px-4 py-3 border border-border rounded-[6px] bg-input text-foreground placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                {accountType === 'organization' ? 'Work Email' : 'Professional Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-quaternary" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.r@company.com"
                  className="w-full pl-11 px-4 py-3 border border-border rounded-[6px] bg-input text-foreground placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-quaternary" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 px-4 py-3 border border-border rounded-[6px] bg-input text-foreground placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {accountType === 'individual' && (
              <div>
                <label htmlFor="roleInterest" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Role Interest
                </label>
                <div className="relative">
                  <select
                    id="roleInterest"
                    className="w-full px-4 py-3 pr-11 border border-border rounded-[6px] bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow appearance-none"
                    required
                  >
                    <option value="" disabled>Select your target track</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="engineering-manager">Engineering Manager</option>
                    <option value="data-analytics">Data & Analytics</option>
                    <option value="operations">Operations Manager</option>
                    <option value="consulting">Consulting</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
                </div>
              </div>
            )}

            {accountType === 'organization' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="orgWebsite" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Company Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-text-quaternary" />
                    </div>
                    <input
                      type="url"
                      id="orgWebsite"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-11 px-4 py-3 border border-border rounded-[6px] bg-input text-foreground placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="orgIndustry" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-text-quaternary" />
                    </div>
                    <select
                      id="orgIndustry"
                      value={orgIndustry}
                      onChange={(e) => setOrgIndustry(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 border border-border rounded-[6px] bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow appearance-none"
                    >
                      <option value="" disabled>Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="consulting">Consulting</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="government">Government & Public Sector</option>
                      <option value="nonprofit">Nonprofit</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
                  </div>
                </div>

                <div>
                  <label htmlFor="orgSize" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Company Size
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-text-quaternary" />
                    </div>
                    <select
                      id="orgSize"
                      value={orgSize}
                      onChange={(e) => setOrgSize(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 border border-border rounded-[6px] bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:border-transparent transition-shadow appearance-none"
                    >
                      <option value="" disabled>Select team size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-quaternary" />
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-[6px]">
                  <p className="text-xs text-blue-300 flex items-start gap-2">
                    <ListChecks className="h-4 w-4 shrink-0 mt-0.5" />
                    Organization accounts can create and manage simulations for their teams, 
                    track progress, and generate analytics reports.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (accountType === 'organization' && !orgName.trim())}
              className="w-full py-3.5 bg-[#5e6ad2] text-white font-semibold rounded-[6px] hover:bg-[#828fff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7170ff] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : `Create ${accountType === 'organization' ? 'Organization' : ''} Account`}
            </button>
          </form>

          <p className="text-center mt-6 text-text-secondary">
            Already have an account?{' '}
            <a href={accountType === 'organization' ? AUTH_ROUTES.ORG_SIGN_IN : AUTH_ROUTES.SIGN_IN} className="text-[#7170ff] hover:text-[#828fff] font-medium">
              Log in
            </a>
          </p>

          <p className="text-xs text-text-tertiary text-center mt-8 leading-relaxed">
            By signing up, you agree to our{' '}
            <a href="#" className="text-[#7170ff] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#7170ff] hover:underline">Privacy Policy</a>
            . Turnve is a professional simulator platform for career benchmarking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
