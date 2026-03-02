import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { mockProfiles } from '@/data/mockProfiles';
import type { Match } from '@/types';

interface UseMatchFetchingOptions {
  /** Start fetching immediately when true */
  enabled: boolean;
  /** Called once results are ready (or fallback used) */
  onComplete?: () => void;
}

export const useMatchFetching = ({ enabled, onComplete }: UseMatchFetchingOptions) => {
  const { orientation, setMatches, addNotification, setScreen } = useAppStore();
  const called = useRef(false);

  useEffect(() => {
    if (!enabled || called.current) return;
    called.current = true;

    const fetchMatches = async () => {
      let matches: Match[] | null = null;

      try {
        const { data, error } = await supabase.functions.invoke('matchmaking');

        if (!error && data?.matches?.length) {
          matches = data.matches as Match[];
        }
      } catch (err) {
        console.error('Matchmaking function error:', err);
      }

      // Fallback to mock data
      if (!matches || matches.length === 0) {
        console.log('Falling back to mock profiles');
        let filteredProfiles = mockProfiles;

        if (orientation === 'women') {
          filteredProfiles = mockProfiles.filter(p => p.gender === 'female');
        } else if (orientation === 'men') {
          filteredProfiles = mockProfiles.filter(p => p.gender === 'male');
        }

        const sortedProfiles = [...filteredProfiles]
          .sort((a, b) => b.compatibility - a.compatibility)
          .slice(0, 50);

        matches = sortedProfiles.map(({ gender, ...profile }) => profile);
      }

      if (matches.length > 0) {
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

    fetchMatches();
  }, [enabled, orientation, setScreen, setMatches, addNotification, onComplete]);
};
