import { motion } from 'framer-motion';
import { User, Camera, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/appStore';
import { useState } from 'react';

export const CreateProfileScreen = () => {
  const { setScreen } = useAppStore();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');

  const handleContinue = () => {
    if (name.trim() && age.trim()) {
      setScreen('analyzing');
    }
  };

  const isValid = name.trim().length > 0 && age.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-display font-bold mb-2">
          Create Your <span className="bg-gradient-to-tl from-rose-500 to-orange-400 bg-clip-text text-transparent">Profile</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Let others know who you are
        </p>
      </motion.div>

      {/* Avatar Upload */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Camera className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Form Fields */}
      <div className="flex-1 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass border-border/50 focus:border-primary/50"
            maxLength={50}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-foreground">
            Age <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="glass border-border/50 focus:border-primary/50"
            min={18}
            max={99}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-foreground">
            Bio <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            placeholder="Tell others about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="glass border-border/50 focus:border-primary/50 min-h-[100px] resize-none"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground text-right">
            {bio.length}/300
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Button 
          variant={isValid ? "glow" : "glass"}
          size="lg" 
          className="w-full"
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};
