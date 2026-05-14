import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, AUTH_ERRORS } from '@/contexts/AuthContext';
import { Shield, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getProfileForUser, rememberAuthPortal, validatePortalAccess } from '@/lib/auth';

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated, role, signIn, signInWithOAuth, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && role === 'ADMIN') {
      const from = (location.state as { from?: string })?.from || '/admin';
      navigate(from, { replace: true });
    } else if (!isLoading && isAuthenticated && role !== 'ADMIN') {
      // User is authenticated but not an admin
      setError('You do not have permission to access the admin panel');
    }
  }, [user, isLoading, isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: signInError } = await signIn(email, password);
      if (signInError || !data.user) {
        setError(signInError?.message || AUTH_ERRORS.SIGN_IN_FAILED);
        return;
      }

      const { profile } = await getProfileForUser(data.user.id);
      const access = validatePortalAccess(profile, 'admin');
      if (access.error) {
        await signOut();
        setError(access.error);
        return;
      }

      navigate(access.redirectPath, { replace: true });
      // Successful login will trigger the useEffect above
    } catch {
      setError(AUTH_ERRORS.GENERIC);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      rememberAuthPortal('admin');
      const { error: oauthError } = await signInWithOAuth('google');
      if (oauthError) {
        setError(oauthError.message || AUTH_ERRORS.OAUTH_FAILED);
      }
    } catch {
      setError(AUTH_ERRORS.GENERIC);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#8a8f98] hover:text-[#d0d6e0] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </button>

        {/* Card */}
        <div className="bg-[#111418] border border-[#23252a] rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#f7f8f8] mb-2">
              Admin Portal
            </h1>
            <p className="text-[#8a8f98] text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#d0d6e0] text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@turnve.com"
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
              <Label htmlFor="password" className="text-[#d0d6e0] text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="w-full bg-[#5e6ad2] hover:bg-[#828fff] text-white h-11"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sign In as Admin'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#23252a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#111418] text-[#8a8f98]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] h-11"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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

          {/* Regular User Login */}
          <div className="mt-6 text-center">
            <p className="text-[#8a8f98] text-sm">
              Not an admin?{' '}
              <button
                onClick={() => navigate('/sign-in')}
                className="text-[#7170ff] hover:text-[#828fff] transition-colors"
              >
                Sign in as user
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#5a5e66] text-xs mt-8">
          Protected by Turnve Security. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
