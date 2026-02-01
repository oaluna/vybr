import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  gender: string;
  interests: string[];
  orientation: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as UserProfile | null;
  }, []);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        let profile = null;

        if (user) {
          profile = await fetchProfile(user.id);
        }

        setAuthState({
          user,
          session,
          profile,
          loading: false,
        });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      let profile = null;

      if (user) {
        profile = await fetchProfile(user.id);
      }

      setAuthState({
        user,
        session,
        profile,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false,
      });
    }
    return { error };
  };

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'user_id'>) => {
    if (!authState.user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authState.user.id,
        ...profileData,
      })
      .select()
      .single();

    if (data && !error) {
      setAuthState(prev => ({ ...prev, profile: data as UserProfile }));
    }

    return { data, error };
  };

  const updateProfile = async (profileData: Partial<Omit<UserProfile, 'id' | 'user_id'>>) => {
    if (!authState.user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('user_id', authState.user.id)
      .select()
      .single();

    if (data && !error) {
      setAuthState(prev => ({ ...prev, profile: data as UserProfile }));
    }

    return { data, error };
  };

  const refreshProfile = async () => {
    if (authState.user) {
      const profile = await fetchProfile(authState.user.id);
      setAuthState(prev => ({ ...prev, profile }));
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    createProfile,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!authState.user,
    hasProfile: !!authState.profile,
  };
};
