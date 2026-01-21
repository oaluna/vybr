import { motion } from 'framer-motion';
import { User, Camera, Edit2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { BottomTabNav } from '@/components/BottomTabNav';

export const ProfileScreen = () => {
  const { orientation } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          <span className="bg-gradient-to-tl from-rose-500 to-orange-400 bg-clip-text text-transparent">Profile</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Your digital identity
        </p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6 mb-6"
      >
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-display font-bold">Your Name</h2>
          <p className="text-sm text-muted-foreground">Add your bio</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Matches</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </motion.div>

      {/* Preferences section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-6"
      >
        <h3 className="font-display font-semibold mb-4">Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Looking for</span>
            <span className="text-sm font-medium capitalize">{orientation || 'Everyone'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Age range</span>
            <span className="text-sm font-medium">18 - 35</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Distance</span>
            <span className="text-sm font-medium">50 km</span>
          </div>
        </div>
      </motion.div>

      <BottomTabNav />
    </div>
  );
};
