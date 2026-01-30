import {Logo} from '../ui/logo'
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';

export const SplashScreen = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('auth');
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
      <Logo />
    </div>
  );
};
