import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { BottomTabNav } from '@/components/BottomTabNav';
import { useEffect, useRef, useState, useCallback } from 'react';

export const MessagesScreen = () => {
  const { matches, setCurrentMatch, setScreen } = useAppStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollTop(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenChat = (matchId: string) => {
    setCurrentMatch(matchId);
    setScreen('chat');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          <span className="text-gradient">Messages</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Your conversations
        </p>
      </motion.div>

      {/* Conversations list */}
      <div className="flex-1 space-y-3">
        {matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground/70">Match with someone to start chatting!</p>
          </motion.div>
        ) : (
          matches.map((match, index) => (
            <motion.button
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOpenChat(match.id)}
              className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
            >
              <img
                src={match.avatar}
                alt={match.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">{match.name}</h3>
                  <span className="text-xs text-muted-foreground">{match.lastActive}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Tap to start a conversation
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-5 z-50 w-11 h-11 rounded-full gradient-primary shadow-glow flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomTabNav />
    </div>
  );
};
