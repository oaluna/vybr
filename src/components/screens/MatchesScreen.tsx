import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { useAppStore, Match } from '@/store/appStore';
import { Button } from '@/components/ui/button';

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

export const MatchesScreen = () => {
  const matches = useAppStore((state) => state.matches);

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          Your <span className="text-gradient">Matches</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          People who share your digital soul
        </p>
      </motion.div>

      {/* Matches grid */}
      <div className="flex-1 space-y-4">
        <AnimatePresence>
          {matches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
