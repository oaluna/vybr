import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import type { Match } from '@/types';

interface ProfileCardProps {
  match: Match;
  onClose: () => void;
}

export const ProfileCard = ({ match, onClose }: ProfileCardProps) => {
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
          <div className="absolute top-3 left-3 gradient-primary px-3 py-1.5 rounded-full flex items-center gap-1 shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-bold text-primary-foreground">{match.compatibility}%</span>
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
