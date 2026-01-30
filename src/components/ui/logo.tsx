import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Logo = () => (
    <>
     <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="relative z-10 -mb-8"
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
        className="mt-8 text-6xl font-display font-bold text-gradient items-center justify-center m-0 h-auto pb-2 tracking-tighter"
      >
        Vybr
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="-mt-2 text-muted-foreground text-sm transform scale-[0.9]"
      >
       Find the right vibe
      </motion.p>
    </>
)