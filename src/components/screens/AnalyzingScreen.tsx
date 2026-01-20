import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore, Match } from '@/store/appStore';

const analysisSteps = [
  "Scanning browsing patterns...",
  "Analyzing search interests...",
  "Mapping activity rhythms...",
  "Building personality profile...",
  "Finding compatible souls..."
];

const womenMatches: Match[] = [
  {
    id: '1',
    name: 'Emma',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    compatibility: 94,
    interests: ['Tech', 'Coffee', 'Hiking', 'Photography'],
    lastActive: '2 min ago',
    bio: 'Engineer by day, photographer by sunset. Looking for someone to share adventures with.'
  },
  {
    id: '2',
    name: 'Sophie',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    compatibility: 89,
    interests: ['Design', 'Music', 'Travel', 'Cooking'],
    lastActive: '15 min ago',
    bio: 'Creative soul with a passport full of stamps. Let\'s explore the world together.'
  },
  {
    id: '3',
    name: 'Lily',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    compatibility: 87,
    interests: ['Gaming', 'Anime', 'Reading', 'Art'],
    lastActive: '1 hr ago',
    bio: 'Bookworm with a love for pixel art and indie games. Cat parent x2.'
  }
];

const menMatches: Match[] = [
  {
    id: '4',
    name: 'James',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    compatibility: 92,
    interests: ['Fitness', 'Cooking', 'Movies', 'Travel'],
    lastActive: '5 min ago',
    bio: 'Chef in training, gym enthusiast. Love discovering new restaurants and hidden gems.'
  },
  {
    id: '5',
    name: 'Marcus',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    compatibility: 88,
    interests: ['Music', 'Photography', 'Hiking', 'Dogs'],
    lastActive: '20 min ago',
    bio: 'Weekend adventurer, weekday creative. My dog picks my dates.'
  },
  {
    id: '6',
    name: 'Daniel',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    compatibility: 85,
    interests: ['Tech', 'Gaming', 'Coffee', 'Books'],
    lastActive: '45 min ago',
    bio: 'Software dev who reads too much sci-fi. Looking for my co-op partner.'
  }
];

export const AnalyzingScreen = () => {
  const { setScreen, setMatches, addNotification, orientation } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, analysisSteps.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setTimeout(() => {
            // Filter matches based on orientation
            let filteredMatches: Match[];
            if (orientation === 'women') {
              filteredMatches = womenMatches;
            } else if (orientation === 'men') {
              filteredMatches = menMatches;
            } else {
              // "everyone" - combine both
              filteredMatches = [...womenMatches, ...menMatches].sort((a, b) => b.compatibility - a.compatibility);
            }
            
            setMatches(filteredMatches);
            addNotification({
              id: Date.now().toString(),
              type: 'match',
              matchId: filteredMatches[0].id,
              text: `You matched with ${filteredMatches[0].name}! ${filteredMatches[0].compatibility}% compatible`
            });
            setScreen('matches');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [setScreen, setMatches, addNotification, orientation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Scanning animation */}
      <div className="relative w-48 h-48 mb-12">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Center pulse */}
        <div className="absolute inset-8 rounded-full gradient-primary shadow-glow flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-display font-bold text-primary-foreground"
          >
            {progress}%
          </motion.div>
        </div>

        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Ripple effects */}
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

      {/* Status text */}
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

      {/* Progress bar */}
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
