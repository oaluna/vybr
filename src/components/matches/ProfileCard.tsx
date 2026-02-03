import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import type { Match } from '@/types';
import { useId } from 'react';

interface ProfileCardProps {
  match: Match;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const ProfileCard = ({ match, onClose, isSaved = false, onToggleSave }: ProfileCardProps) => {
  const { setCurrentMatch, setScreen } = useAppStore();
  const titleId = useId();

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
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl overflow-hidden shadow-card w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Close profile"
        >
          <X className="w-5 h-5 text-white" aria-hidden="true" />
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src={match.avatar}
            alt={`Profile photo of ${match.name}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" aria-hidden="true" />
          
          {/* Compatibility score */}
          <div className="absolute top-3 left-3 gradient-primary px-3 py-1.5 rounded-full flex items-center gap-1 shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
            <span className="text-sm font-bold text-primary-foreground">{match.compatibility}% match</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 id={titleId} className="text-2xl font-display font-bold">
              {match.name}, {match.age}
            </h2>
            <span className="text-xs text-muted-foreground">Active {match.lastActive}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {match.bio}
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Interests">
            {match.interests.map((interest) => (
              <span
                key={interest}
                role="listitem"
                className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="glass" 
              size="icon" 
              className="shrink-0"
              onClick={onToggleSave}
              aria-label={isSaved ? `Remove ${match.name} from saved` : `Save ${match.name}`}
              aria-pressed={isSaved}
            >
              <Heart 
                className={`w-5 h-5 ${isSaved ? 'text-primary fill-primary' : 'text-primary'}`}
                aria-hidden="true"
              />
            </Button>
            <Button 
              variant="glow" 
              className="flex-1"
              onClick={handleMessage}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Message {match.name}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
