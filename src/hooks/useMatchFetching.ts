import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { mockProfiles } from '@/data/mockProfiles';
import type { Match } from '@/types';

interface UseMatchFetchingOptions {
  enabled: boolean;
  onComplete?: () => void;
}

const fallbackToMockData = (orientation: string | null): Match[] => {
  let filteredProfiles = mockProfiles;

  if (orientation === 'women') {
    filteredProfiles = mockProfiles.filter(p => p.gender === 'female');
  } else if (orientation === 'men') {
    filteredProfiles = mockProfiles.filter(p => p.gender === 'male');
  }

  const sortedProfiles = [...filteredProfiles]
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 50);

  return sortedProfiles.map(({ gender, ...profile }) => profile);
};

export const useMatchFetching = ({ enabled, onComplete }: UseMatchFetchingOptions) => {
  const { orientation, setMatches, addNotification, setScreen } = useAppStore();

  useEffect(() => {
    if (!enabled) return;

    const fetchMatches = async () => {
      let matches: Match[] = [];

      try {
        // Try AI-powered matching via edge function
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data, error } = await supabase.functions.invoke('calculate-compatibility', {
            body: { orientation: orientation || 'everyone' },
          });

          if (!error && data?.matches?.length > 0) {
            matches = data.matches.map((m: any) => ({
              id: m.id,
              name: m.name,
              age: m.age,
              avatar: m.avatar,
              compatibility: m.compatibility,
              interests: m.interests,
              lastActive: m.lastActive,
              bio: m.bio,
            }));
          } else {
            if (import.meta.env.DEV) console.warn('Edge function failed, falling back to mock data');
            matches = fallbackToMockData(orientation);
          }
        } else {
          matches = fallbackToMockData(orientation);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('Match fetching error, using mock data');
        matches = fallbackToMockData(orientation);
      }

      if (matches.length > 0) {
        setMatches(matches);
        addNotification({
          id: Date.now().toString(),
          type: 'match',
          matchId: matches[0].id,
          text: `You matched with ${matches[0].name}! ${matches[0].compatibility}% compatible`,
        });
      }

      setScreen('matches');
      onComplete?.();
    };

    const timer = setTimeout(fetchMatches, 500);
    return () => clearTimeout(timer);
  }, [enabled, orientation, setScreen, setMatches, addNotification, onComplete]);
};
