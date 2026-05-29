import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, UserRound } from 'lucide-react';
import { SignInPage } from '../../components/ui/sign-in';
import { AUTH_ERRORS, AUTH_ROUTES } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthRedirectPath, getProfileForUser, normalizeRole, rememberAuthPortal, validatePortalAccess } from '../../lib/auth';

function OrganizationLoginPage() {
  const navigate = useNavigate();
  const { user, isLoading, role, signIn, signInWithOAuth, signOut, resetPassword } = useAuth();
  const [individualAccountEmail, setIndividualAccountEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user && role === 'COMPANY') {
      navigate(getPostAuthRedirectPath(role, 'organization'), { replace: true });
    }
  }, [isLoading, navigate, role, user]);

  const handleEmailSignIn = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error || !data.user) {
      return { error: { message: error?.message || AUTH_ERRORS.SIGN_IN_FAILED } };
    }

    const { profile } = await getProfileForUser(data.user.id);
    if (normalizeRole(profile?.role) !== 'COMPANY') {
      setIndividualAccountEmail(email);
      return { error: null };
    }

    const access = validatePortalAccess(profile, 'organization');
    if (access.error) {
      await signOut();
      return { error: { message: access.error } };
    }

    navigate(access.redirectPath, { replace: true });
    return { error: null };
  };

  const handleGoogleSignIn = async () => {
    rememberAuthPortal('organization');
    const { error } = await signInWithOAuth('google');
    if (error) {
      console.error('Organization Google sign-in error:', error);
    }
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await resetPassword(email);
    if (error) {
      return { error: { message: error.message || 'Failed to send reset link' } };
    }
    return { error: null };
  };

  return (
    <div className="relative min-h-screen bg-background">
      {individualAccountEmail && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="individual-account-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-2xl shadow-black/30">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-7 w-7 text-primary" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Individual account detected
            </p>
            <h2 id="individual-account-title" className="text-3xl font-bold text-foreground">
              This email is signed up as an individual account.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-text-secondary">
              To access the organization dashboard, add your company details and convert this
              account into a company workspace.
            </p>
            <div className="mt-5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-text-secondary">
              {individualAccountEmail}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate(`${AUTH_ROUTES.ORG_SIGN_UP}?upgrade=1`)}
                className="inline-flex items-center justify-center rounded-[6px] bg-[#5e6ad2] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#828fff]"
              >
                Create company account
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIndividualAccountEmail(null);
                  await signOut();
                  navigate(AUTH_ROUTES.SIGN_IN);
                }}
                className="inline-flex items-center justify-center rounded-[6px] border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Individual sign in
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-8 left-8 z-10">
        <a href="/company/start" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">Turnve Organizations</span>
        </a>
      </div>

      <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Organization sign in</span>}
        description="Access your organization dashboard to create simulations, publish live links, and manage team experiences."
        heroImageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop"
        testimonials={[]}
        onEmailSignIn={handleEmailSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={() => navigate(AUTH_ROUTES.ORG_SIGN_UP)}
        onResetPassword={handleResetPassword}
      />

      <a
        href={AUTH_ROUTES.SIGN_IN}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-[#7170ff] hover:text-[#828fff]"
      >
        Individual account sign in
      </a>
    </div>
  );
}

export default OrganizationLoginPage;
