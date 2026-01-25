import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, SlidersHorizontal, X } from 'lucide-react';
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

const ProfileCard = ({ match, onClose }: { match: Match; onClose: () => void }) => {
  const { setCurrentMatch, setScreen } = useAppStore();

  const handleMessage = () => {
    setCurrentMatch(match.id);
    setScreen('chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl overflow-hidden shadow-card w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src={match.avatar}
            alt={match.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Compatibility score */}
          <div className="absolute top-3 left-3 bg-gradient-to-tl from-rose-500 to-orange-400 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">{match.compatibility}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-display font-bold">
              {match.name}, {match.age}
            </h3>
            <span className="text-xs text-muted-foreground">{match.lastActive}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {match.bio}
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 mb-5">
            {match.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground"
              >
                {interest}
              </span>
            ))}
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
    </motion.div>
  );
};

const MosaicTile = ({ match, index, onClick }: { match: Match; index: number; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
      onClick={onClick}
    >
      <img
        src={match.avatar}
        alt={match.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Compatibility badge */}
      <div className="absolute top-1.5 right-1.5 bg-gradient-to-tl from-rose-500 to-orange-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
        <Sparkles className="w-3 h-3 text-white" />
        <span className="text-xs font-bold text-white">{match.compatibility}%</span>
      </div>

      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-semibold truncate">{match.name}, {match.age}</p>
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

      {/* Mosaic grid */}
      <div className="flex-1 flex-wrap grid grid-cols-3 gap-2">
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
          <ProfileCard match={selectedMatch} onClose={() => setSelectedMatch(null)} />
        )}
      </AnimatePresence>

      <BottomTabNav />
    </div>
  );
};
