import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/appStore';
import type { Match } from '@/types';

interface UseMatchFetchingOptions {
  enabled: boolean;
  onComplete?: () => void;
}

export const useMatchFetching = ({ enabled, onComplete }: UseMatchFetchingOptions) => {
  const { orientation, setMatches, addNotification, setScreen } = useAppStore();

  useEffect(() => {
    if (!enabled) return;

    const fetchMatches = async () => {
      // Build query based on orientation
      let query = supabase
        .from('profiles')
        .select('*')
        .order('compatibility', { ascending: false })
        .limit(50);

      if (orientation === 'women') {
        query = query.eq('gender', 'female');
      } else if (orientation === 'men') {
        query = query.eq('gender', 'male');
      }
      // "everyone" - no filter needed

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      if (data && data.length > 0) {
        // Map database profiles to Match interface
        const matches: Match[] = data.map((profile) => ({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          avatar: profile.avatar,
          compatibility: profile.compatibility,
          interests: profile.interests,
          lastActive: profile.last_active,
          bio: profile.bio,
        }));

        setMatches(matches);
        addNotification({
          id: Date.now().toString(),
          type: 'match',
          matchId: matches[0].id,
          text: `You matched with ${matches[0].name}! ${matches[0].compatibility}% compatible`
        });
      }

      setScreen('matches');
      onComplete?.();
    };

    const timer = setTimeout(fetchMatches, 500);
    return () => clearTimeout(timer);
  }, [enabled, orientation, setScreen, setMatches, addNotification, onComplete]);
};
