import { motion } from 'framer-motion';
import { Globe, Search, Clock, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useState } from 'react';

const permissions = [
  {
    id: 'browsing',
    icon: Globe,
    title: "Browsing History",
    description: "Sites you visit reveal your interests",
    granted: false
  },
  {
    id: 'search',
    icon: Search,
    title: "Search History",
    description: "What you search shows what you care about",
    granted: false
  },
  {
    id: 'activity',
    icon: Clock,
    title: "Activity Patterns",
    description: "When you're online matters for matching",
    granted: false
  }
];

export const PermissionsScreen = () => {
  const { setScreen, grantPermissions } = useAppStore();
  const [granted, setGranted] = useState<string[]>([]);

  const handleGrant = (id: string) => {
    if (!granted.includes(id)) {
      setGranted([...granted, id]);
    }
  };

  const allGranted = granted.length === permissions.length;

  const handleContinue = () => {
    grantPermissions();
    setScreen('orientation');
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">
          Privacy First
        </h1>
        <p className="text-muted-foreground text-sm">
          Grant permissions to unlock personalized matching
        </p>
      </motion.div>

      {/* Permissions List */}
      <div className="flex-1 space-y-4">
        {permissions.map((permission, index) => {
          const isGranted = granted.includes(permission.id);
          return (
            <motion.button
              key={permission.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              onClick={() => handleGrant(permission.id)}
              className={`w-full glass rounded-2xl p-4 flex gap-4 items-center text-left transition-all duration-300 ${
                isGranted ? 'border-accent/50 bg-accent/10' : 'hover:border-primary/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isGranted ? 'bg-accent' : 'bg-muted'
              }`}>
                <permission.icon className={`w-6 h-6 ${isGranted ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-0.5">{permission.title}</h3>
                <p className="text-xs text-muted-foreground">{permission.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isGranted ? 'bg-accent' : 'bg-muted'
              }`}>
                {isGranted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-accent-foreground rounded-full"
                  />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button 
          variant={allGranted ? "glow" : "glass"}
          size="lg" 
          className="w-full"
          onClick={handleContinue}
          disabled={!allGranted}
        >
          {allGranted ? "Start Matching" : "Grant All Permissions"}
        </Button>
      </motion.div>
    </div>
  );
};
