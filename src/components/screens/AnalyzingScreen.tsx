import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useMatchFetching } from '@/hooks/useMatchFetching';

const analysisSteps = [
  "Scanning browsing patterns...",
  "Analyzing search interests...",
  "Mapping activity rhythms...",
  "Building personality profile...",
  "Finding compatible souls..."
];

export const AnalyzingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [matchesReady, setMatchesReady] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const onMatchComplete = useCallback(() => {
    setMatchesReady(true);
  }, []);

  // Start fetching immediately on mount
  useMatchFetching({ enabled: true, onComplete: onMatchComplete });

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, analysisSteps.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setAnimationDone(true);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // If matches arrived before animation, wait for animation.
  // If animation finished before matches, the hook will navigate when ready.
  // This is handled by the hook calling setScreen('matches') directly.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Scanning animation */}
      <div className="relative w-48 h-48 mb-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-8 rounded-full gradient-primary shadow-glow flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-display font-bold text-primary-foreground"
          >
            {progress}%
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/40"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-medium text-foreground mb-2">
          {analysisSteps[currentStep]}
        </p>
        <p className="text-sm text-muted-foreground">
          This only takes a moment
        </p>
      </motion.div>

      <div className="mt-8 w-full max-w-xs">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
