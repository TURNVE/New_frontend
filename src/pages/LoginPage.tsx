import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignInPage, type Testimonial } from '../components/ui/sign-in';
import { usePageSetup } from '../hooks/usePageSetup';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    name: 'Sarah Chen',
    handle: '@sarahdigital',
    text: 'Amazing platform! The user experience is seamless and the features are exactly what I needed.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    name: 'Marcus Johnson',
    handle: '@marcustech',
    text: 'This service has transformed how I work. Clean design, powerful features, and excellent support.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    name: 'David Martinez',
    handle: '@davidcreates',
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

const LoginPage = () => {
  usePageSetup();
  const navigate = useNavigate();
  const { user, isLoading, signInWithOAuth, role } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const redirectPath = role === 'COMPANY' ? '/company' : '/dashboard';
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, role]);

  const handleGoogleSignIn = async () => {
    await signInWithOAuth('google');
  };

  const handleCreateAccount = () => {
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen bg-background">
      <SignInPage
        title={
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TURNVE" className="h-10 w-auto" />
          </div>
        }
        description="Sign in to continue your journey with TURNVE"
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignedIn={() => {
          const redirectPath = role === 'COMPANY' ? '/company' : '/dashboard';
          navigate(redirectPath);
        }}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default LoginPage;
