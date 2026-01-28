import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { BottomTabNav } from '@/components/BottomTabNav';
import { ProfileCard } from '@/components/matches/ProfileCard';
import { MosaicTile } from '@/components/matches/MosaicTile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Match } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSavedMatches } from '@/hooks/useSavedMatches';

type SortOption = 'compatibility' | 'age' | 'lastActive';

const parseLastActive = (lastActive: string): number => {
  const match = lastActive.match(/(\d+)/);
  if (!match) return 0;
  const num = parseInt(match[1], 10);
  if (lastActive.includes('min')) return num;
  if (lastActive.includes('hour')) return num * 60;
  if (lastActive.includes('day')) return num * 1440;
  return num;
};

export const MatchesScreen = () => {
  const matches = useAppStore((state) => state.matches);
  const { user } = useAuth();
  const { isMatchSaved, saveMatch, unsaveMatch } = useSavedMatches(user?.id);
  const [sortBy, setSortBy] = useState<SortOption>('compatibility');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case 'compatibility':
        return b.compatibility - a.compatibility;
      case 'age':
        return a.age - b.age;
      case 'lastActive':
        return parseLastActive(a.lastActive) - parseLastActive(b.lastActive);
      default:
        return 0;
    }
  });

  const handleToggleSave = async (profileId: string) => {
    if (isMatchSaved(profileId)) {
      await unsaveMatch(profileId);
    } else {
      await saveMatch(profileId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          Your <span className="text-gradient">Matches</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          People who share your digital soul
        </p>
      </motion.div>

      {/* Sort filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-4"
      >
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[160px] h-9 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="compatibility">Compatibility</SelectItem>
            <SelectItem value="age">Age</SelectItem>
            <SelectItem value="lastActive">Recently Active</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Mosaic grid */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {sortedMatches.map((match, index) => (
          <MosaicTile
            key={match.id}
            match={match}
            index={index}
            onClick={() => setSelectedMatch(match)}
          />
        ))}
      </div>

      {/* Profile card overlay */}
      <AnimatePresence>
        {selectedMatch && (
          <ProfileCard 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)}
            isSaved={isMatchSaved(selectedMatch.id)}
            onToggleSave={() => handleToggleSave(selectedMatch.id)}
          />
        )}
      </AnimatePresence>

      <BottomTabNav />
    </div>
  );
};
