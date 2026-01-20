import { motion } from 'framer-motion';
import { Users, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useState } from 'react';

const orientations = [
  { id: 'women', label: 'Women', icon: '👩' },
  { id: 'men', label: 'Men', icon: '👨' },
  { id: 'everyone', label: 'Everyone', icon: '✨' },
];

export const OrientationScreen = () => {
  const { setScreen } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      setScreen('analyzing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">
          Who are you interested in?
        </h1>
        <p className="text-muted-foreground text-sm">
          We'll find matches based on your preference
        </p>
      </motion.div>

      {/* Orientation Options */}
      <div className="flex-1 space-y-4">
        {orientations.map((orientation, index) => {
          const isSelected = selected === orientation.id;
          return (
            <motion.button
              key={orientation.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelected(orientation.id)}
              className={`w-full glass rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-300 ${
                isSelected 
                  ? 'border-primary/50 bg-primary/10 shadow-glow' 
                  : 'hover:border-muted-foreground/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                isSelected ? 'gradient-primary shadow-glow' : 'bg-muted'
              }`}>
                {orientation.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{orientation.label}</h3>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
              }`}>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 bg-primary-foreground rounded-full"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-center text-muted-foreground mt-6 mb-4"
      >
        Your preference is private and can be changed anytime
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          variant={selected ? "glow" : "glass"}
          size="lg" 
          className="w-full"
          onClick={handleContinue}
          disabled={!selected}
        >
          <Sparkles className="w-5 h-5" />
          Find My Matches
        </Button>
      </motion.div>
    </div>
  );
};
