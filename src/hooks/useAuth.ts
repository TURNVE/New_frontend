import { useState, useCallback, useEffect } from 'react';
import { isSupabaseConfigured, supabase, supabaseConfigError } from '../lib/supabase';
import type { Session, User, AuthResponse } from '@supabase/supabase-js';

export type AuthUser = User & {
  full_name?: string;
  avatar_url?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  } | null;
};

export type AuthProvider = 'google' | 'github' | 'linkedin_oidc';

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  
  signUp: (email: string, password: string, full_name?: string, metadata?: Record<string, unknown>) => Promise<{ user: User | null; session: Session | null; }>;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User; session: Session; }>;
  signInWithOAuth: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => () => void;
}

export interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState({
        user: null,
        session: null,
        loading: false,
        error: new Error(supabaseConfigError),
      });
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setState(prev => ({ ...prev, loading: false, error: sessionError }));
          return;
        }

        if (session) {
          const user = session.user as AuthUser;
          setState({ user, session, loading: false, error: null });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error : new Error('Authentication initialization failed')
        }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user as AuthUser | null,
        loading: false,
        error: null
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, full_name?: string, metadata?: Record<string, unknown>) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const userMetadata = {
        ...(metadata || {}),
        ...(full_name ? { full_name } : {}),
      };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });

      if (error) {
        throw new Error('Registration failed. Please try again.');
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.message === 'Password must be at least 8 characters long') {
        throw error;
      }
      if (error instanceof Error && error.message === supabaseConfigError) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error('Invalid email or password');
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.message === supabaseConfigError) {
        throw error;
      }
      if (error instanceof Error && error.message === 'Invalid email or password') {
        throw error;
      }
      throw new Error('Invalid email or password');
    }
  }, []);

  const signInWithOAuth = useCallback(async (provider: AuthProvider) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setState(prev => ({ ...prev, user: user as AuthUser }));
    } catch (error) {
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error(supabaseConfigError);
      }

      const userId = state.user?.id;
      
      if (!userId) {
        throw new Error('No user authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      await refreshUser();
    } catch (error) {
      throw error;
    }
  }, [state.user, refreshUser]);

  const onAuthStateChange = useCallback((callback: (user: AuthUser | null) => void) => {
    if (!isSupabaseConfigured) {
      callback(null);
      return () => undefined;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser | null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.session,
    signUp,
    signInWithEmail,
    signInWithOAuth,
    signOut,
    refreshUser,
    updateUserProfile,
    onAuthStateChange
  };
}

export function useProfile(): UseProfileReturn {
  const [state, setState] = useState<{
    profile: UserProfile | null;
    loading: boolean;
    error: Error | null;
  }>({
    profile: null,
    loading: true,
    error: null
  });

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) {
          setState({ profile: null, loading: false, error: null });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setState({ profile: null, loading: false, error: null });
          } else {
            throw error;
          }
          return;
        }

        setState({ profile: data as UserProfile, loading: false, error: null });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch profile')
        }));
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      if (!user?.id) {
        throw new Error('No user authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...data } : null
      }));
    } catch (error) {
      throw error;
    }
  }, [user]);

  return {
    profile: state.profile,
    loading: state.loading || authLoading,
    error: state.error,
    updateProfile
  };
}
