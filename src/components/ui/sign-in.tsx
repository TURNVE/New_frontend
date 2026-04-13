import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface Props {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onEmailSignIn?: (email: string, password: string) => Promise<{ error?: { message: string } | null }>;
  onGoogleSignIn?: () => Promise<void> | void;
  onCreateAccount?: () => void;
  onSignedIn?: () => void;
  onResetPassword?: (email: string) => Promise<{ error?: { message: string } | null }>;
}

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 p-5 w-64 shadow-lg`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium text-gray-900">{testimonial.name}</p>
      <p className="text-gray-500">{testimonial.handle}</p>
      <p className="mt-1 text-gray-600">{testimonial.text}</p>
    </div>
  </div>
);

export const SignInPage: React.FC<Props> = ({
  title = <span className="font-light text-gray-900 tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onEmailSignIn,
  onGoogleSignIn,
  onCreateAccount,
  onSignedIn,
  onResetPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (onEmailSignIn) {
        const result = await onEmailSignIn(email, password);
        if (result?.error) {
          setError(result.error.message || 'Failed to sign in');
          return;
        }
        onSignedIn?.();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsOAuthLoading(true);
    setError(null);

    try {
      await onGoogleSignIn?.();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsOAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setIsLoading(true);

    try {
      if (onResetPassword) {
        const result = await onResetPassword(email);
        if (result?.error) {
          setError(result.error.message || 'Failed to send reset link');
        } else {
          setResetMessage('Password reset link sent to your email.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-gray-50">
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="animate-element animate-delay-100 mb-2">{title}</div>
            <p className="animate-element animate-delay-200 text-gray-500 text-base">{description}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-element">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isResettingPassword ? (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div className="animate-element animate-delay-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-gray-50 text-gray-900 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {resetMessage && (
                <div className="animate-element p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-600">{resetMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="animate-element animate-delay-400 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center mt-4 animate-element animate-delay-500">
                <button
                  type="button"
                  onClick={() => {
                    setIsResettingPassword(false);
                    setError(null);
                    setResetMessage(null);
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          ) : (
            <>
              <form className="space-y-5" onSubmit={handleEmailSignIn}>
                <div className="animate-element animate-delay-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="animate-element animate-delay-400">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Keep me signed in</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsResettingPassword(true);
                      setError(null);
                      setResetMessage(null);
                    }}
                    className="font-medium text-primary hover:opacity-80 transition-colors"
                  >
                    Reset password
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="animate-element animate-delay-600 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="animate-element animate-delay-700 relative flex items-center justify-center my-6">
                <span className="w-full border-t border-gray-200"></span>
                <span className="px-4 text-xs font-medium text-gray-400 bg-white absolute">Or continue with</span>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isOAuthLoading}
                className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-xl py-3.5 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                {isOAuthLoading ? 'Loading...' : 'Continue with Google'}
              </button>

              <p className="animate-element animate-delay-900 text-center text-sm text-gray-500 mt-8">
                New to our platform?{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }}
                  className="font-semibold text-primary hover:opacity-80 hover:underline transition-colors"
                >
                  Create Account
                </a>
              </p>
            </>
          )}
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 bg-gray-100">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center shadow-2xl" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
