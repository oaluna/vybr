import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { mockProfiles } from '@/data/mockProfiles';
import type { Match } from '@/types';

/* ====== ORIGINAL DATABASE FETCH - UNCOMMENT TO RESTORE ======
import { supabase } from '@/integrations/supabase/client';

// NOTE: To restore database fetching:
// 1. Uncomment this entire block
// 2. Remove the mockProfiles import above
// 3. Replace the mock data logic in fetchMatches with the database query below

const fetchFromDatabase = async (orientation: string) => {
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
    return null;
  }

  if (data && data.length > 0) {
    return data.map((profile) => ({
      id: profile.user_id,
      name: profile.name,
      age: profile.age,
      avatar: profile.avatar,
      compatibility: profile.compatibility,
      interests: profile.interests,
      lastActive: profile.last_active,
      bio: profile.bio,
    }));
  }
  return null;
};
====== END ORIGINAL DATABASE FETCH ====== */

interface UseMatchFetchingOptions {
  enabled: boolean;
  onComplete?: () => void;
}

export const useMatchFetching = ({ enabled, onComplete }: UseMatchFetchingOptions) => {
  const { orientation, setMatches, addNotification, setScreen } = useAppStore();

  useEffect(() => {
    if (!enabled) return;

    const fetchMatches = async () => {
      // MOCK DATA - Remove this section and uncomment the database fetch above to restore
      let filteredProfiles = mockProfiles;

      if (orientation === 'women') {
        filteredProfiles = mockProfiles.filter(p => p.gender === 'female');
      } else if (orientation === 'men') {
        filteredProfiles = mockProfiles.filter(p => p.gender === 'male');
      }
      // "everyone" - no filter needed

      // Sort by compatibility and take top 50
      const sortedProfiles = [...filteredProfiles]
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, 50);

      // Map to Match interface (excluding gender field)
      const matches: Match[] = sortedProfiles.map(({ gender, ...profile }) => profile);

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

    const timer = setTimeout(fetchMatches, 500);
    return () => clearTimeout(timer);
  }, [enabled, orientation, setScreen, setMatches, addNotification, onComplete]);
};
