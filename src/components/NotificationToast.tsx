import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';

export const NotificationToast = () => {
  const { notifications, clearNotification, matches, setCurrentMatch, setScreen } = useAppStore();

  const latestNotification = notifications[notifications.length - 1];

  useEffect(() => {
    if (latestNotification) {
      const timer = setTimeout(() => {
        clearNotification(latestNotification.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [latestNotification, clearNotification]);

  const handleClick = () => {
    if (latestNotification) {
      setCurrentMatch(latestNotification.matchId);
      setScreen('chat');
      clearNotification(latestNotification.id);
    }
  };

  const match = latestNotification 
    ? matches.find(m => m.id === latestNotification.matchId)
    : null;

  return (
    <AnimatePresence>
      {latestNotification && match && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div
            onClick={handleClick}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left shadow-elevated"
          >
            <div className="relative">
              <img
                src={match.avatar}
                alt={match.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                latestNotification.type === 'match' ? 'gradient-primary' : 'bg-accent'
              }`}>
                {latestNotification.type === 'match' ? (
                  <Heart className="w-3 h-3 text-primary-foreground" fill="currentColor" />
                ) : (
                  <MessageCircle className="w-3 h-3 text-accent-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {latestNotification.type === 'match' ? 'New Match!' : match.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {latestNotification.text}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearNotification(latestNotification.id);
              }}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
