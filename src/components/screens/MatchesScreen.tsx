import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useAppStore, Match } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { BottomTabNav } from '@/components/BottomTabNav';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MatchCard = ({ match, index }: { match: Match; index: number }) => {
  const { setCurrentMatch, setScreen } = useAppStore();

  const handleMessage = () => {
    setCurrentMatch(match.id);
    setScreen('chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="glass rounded-3xl overflow-hidden shadow-card"
    >
      {/* Compatibility badge */}
      <div className="relative">
        <img
          src={match.avatar}
          alt={match.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Compatibility score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
          className="absolute top-3 right-3 gradient-primary px-3 py-1.5 rounded-full flex items-center gap-1 shadow-glow"
        >
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-bold text-primary-foreground">{match.compatibility}%</span>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-display font-bold">
            {match.name}, {match.age}
          </h3>
          <span className="text-xs text-muted-foreground">{match.lastActive}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {match.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-4">
          {match.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground"
            >
              {interest}
            </span>
          ))}
          {match.interests.length > 3 && (
            <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
              +{match.interests.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="glass" size="icon" className="shrink-0">
            <Heart className="w-5 h-5 text-primary" />
          </Button>
          <Button 
            variant="glow" 
            className="flex-1"
            onClick={handleMessage}
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

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
  const [sortBy, setSortBy] = useState<SortOption>('compatibility');

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

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          Your <span className="bg-gradient-to-tl from-rose-500 to-orange-400 bg-clip-text text-transparent">Matches</span>
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

      {/* Matches grid */}
      <div className="flex-1 space-y-4">
        <AnimatePresence>
          {sortedMatches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))}
        </AnimatePresence>
      </div>

      <BottomTabNav />
    </div>
  );
};
