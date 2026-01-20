import { motion } from 'framer-motion';
import { Fingerprint, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

const features = [
  {
    icon: Fingerprint,
    title: "Your Digital Fingerprint",
    description: "We analyze your browsing patterns to understand who you really are"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description: "Our algorithm finds people who share your authentic interests"
  },
  {
    icon: Zap,
    title: "Zero Effort Required",
    description: "No swiping, no profiles — just genuine connections"
  }
];

export const OnboardingScreen = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-display font-bold mb-3">
          Dating, <span className="bg-gradient-to-tl from-rose-500 to-orange-400 bg-clip-text text-transparent">Reimagined</span>
        </h1>
        <p className="text-muted-foreground">
          Find matches based on your true self, not curated profiles
        </p>
      </motion.div>

      {/* Features */}
      <div className="flex-1 space-y-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="glass rounded-2xl p-5 flex gap-4 items-start"
          >
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
              <feature.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 space-y-3"
      >
        <Button 
          variant="glow" 
          size="lg" 
          className="w-full"
          onClick={() => setScreen('permissions')}
        >
          Get Started
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Your data is encrypted and never shared with third parties
        </p>
      </motion.div>
    </div>
  );
};
