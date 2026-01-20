import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export const SplashScreen = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 gradient-glow" />
      
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 100, height: 100, opacity: 0 }}
            animate={{ 
              width: [100, 300 + i * 100], 
              height: [100, 300 + i * 100],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
          <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />
        </div>
      </motion.div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-4xl font-display font-bold text-gradient"
      >
        Sync
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-muted-foreground"
      >
        Match by your digital soul
      </motion.p>
    </div>
  );
};
