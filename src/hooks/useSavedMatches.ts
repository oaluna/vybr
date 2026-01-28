import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SavedMatch {
  id: string;
  user_id: string;
  profile_id: string;
  liked: boolean;
  created_at: string;
}

export const useSavedMatches = (userId: string | undefined) => {
  const [savedMatches, setSavedMatches] = useState<SavedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedMatches = useCallback(async () => {
    if (!userId) {
      setSavedMatches([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('saved_matches')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching saved matches:', error);
    } else {
      setSavedMatches(data || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSavedMatches();
  }, [fetchSavedMatches]);

  const saveMatch = async (profileId: string) => {
    if (!userId) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('saved_matches')
      .insert({
        user_id: userId,
        profile_id: profileId,
        liked: true,
      })
      .select()
      .single();

    if (!error && data) {
      setSavedMatches(prev => [...prev, data]);
    }

    return { data, error };
  };

  const unsaveMatch = async (profileId: string) => {
    if (!userId) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('saved_matches')
      .delete()
      .eq('user_id', userId)
      .eq('profile_id', profileId);

    if (!error) {
      setSavedMatches(prev => prev.filter(m => m.profile_id !== profileId));
    }

    return { error };
  };

  const isMatchSaved = (profileId: string) => {
    return savedMatches.some(m => m.profile_id === profileId);
  };

  return {
    savedMatches,
    loading,
    saveMatch,
    unsaveMatch,
    isMatchSaved,
    refresh: fetchSavedMatches,
  };
};
