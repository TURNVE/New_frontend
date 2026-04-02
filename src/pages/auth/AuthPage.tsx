import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SignInPage } from '../../components/ui/sign-in';

function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading, signIn, signInWithOAuth } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithOAuth('google');
  };

  const handleCreateAccount = () => {
    navigate('/sign-up');
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
    <div className="relative">
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Turnve</span>
        </a>
      </div>

      <SignInPage
        title={
          <span className="font-light text-gray-900 tracking-tighter">Welcome back</span>
        }
        description="Access your account and continue your journey with us"
        heroImageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
        testimonials={testimonials}
        onSignedIn={() => navigate('/dashboard')}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}

export default AuthPage;
