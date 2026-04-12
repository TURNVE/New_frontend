import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_ROUTES } from '@/contexts/AuthContext';

/**
 * OAuthCallbackPage — handles the redirect from Google/GitHub OAuth.
 *
 * Supabase uses PKCE flow: after the user authenticates with Google,
 * they're redirected here with a `code` query param. We exchange it
 * for a session, and the AuthContext listener picks up the new session.
 */
function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { searchParams, hash } = new URL(window.location.href);
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error_description') || searchParams.get('error');

        if (errorParam) {
          setError(errorParam);
          return;
        }

        if (code) {
          // PKCE flow: exchange authorization code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }
        } else if (hash) {
          // Implicit flow fallback: Supabase auto-detects hash tokens
          // The onAuthStateChange listener in AuthContext handles this
        }

        // Give the AuthContext listener a moment to update, then navigate
        setTimeout(() => {
          navigate(AUTH_ROUTES.DASHBOARD, { replace: true });
        }, 500);
      } catch (err) {
        setError('Failed to complete authentication. Please try again.');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  // If already authenticated (AuthContext picked up the session), redirect immediately
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(AUTH_ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(AUTH_ROUTES.SIGN_IN)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
