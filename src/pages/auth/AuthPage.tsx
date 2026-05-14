import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AUTH_ROUTES, AUTH_ERRORS } from '../../contexts/AuthContext';
import { SignInPage } from '../../components/ui/sign-in';
import { getPostAuthRedirectPath, getProfileForUser, rememberAuthPortal, validatePortalAccess } from '../../lib/auth';

function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading, signIn, signInWithOAuth, signOut, resetPassword, role } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(getPostAuthRedirectPath(role), { replace: true });
    }
  }, [user, isLoading, navigate, role]);

  const handleEmailSignIn = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error || !data.user) {
      return { error: { message: error?.message || AUTH_ERRORS.SIGN_IN_FAILED } };
    }

    const { profile } = await getProfileForUser(data.user.id);
    const access = validatePortalAccess(profile, 'individual');
    if (access.error) {
      await signOut();
      return { error: { message: access.error } };
    }

    navigate(access.redirectPath, { replace: true });
    return { error: null };
  };

  const handleGoogleSignIn = async () => {
    rememberAuthPortal('individual');
    const { error } = await signInWithOAuth('google');
    if (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleCreateAccount = () => {
    navigate(AUTH_ROUTES.SIGN_UP);
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await resetPassword(email);
    if (error) {
      return { error: { message: error.message || 'Failed to send reset link' } };
    }
    return { error: null };
  };

  const testimonials = [
    {
      avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      name: 'Sarah Chen',
      handle: '@sarahc',
      text: 'This platform transformed my career trajectory.',
    },
    {
      avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      name: 'Marcus Johnson',
      handle: '@marcusj',
      text: 'The simulations prepared me for real leadership roles.',
    },
    {
      avatarSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      name: 'Emily Rodriguez',
      handle: '@emilyr',
      text: 'Best investment I made in my professional development.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Turnve</span>
        </a>
      </div>

      <SignInPage
        title={
          <span className="font-light text-foreground tracking-tighter">Welcome back</span>
        }
        description="Access your account and continue your journey with us"
        heroImageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
        testimonials={testimonials}
        onEmailSignIn={handleEmailSignIn}
        onSignedIn={() => {
          navigate(getPostAuthRedirectPath(role), { replace: true });
        }}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={handleCreateAccount}
        onResetPassword={handleResetPassword}
      />
      <a
        href={AUTH_ROUTES.ORG_SIGN_IN}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-[#7170ff] hover:text-[#828fff]"
      >
        Organization sign in
      </a>
    </div>
  );
}

export default AuthPage;
