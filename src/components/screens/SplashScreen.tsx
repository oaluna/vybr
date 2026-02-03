import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import vybrLogo from '@/assets/vybr-logo.png';
export const SplashScreen = () => {
  const setScreen = useAppStore(state => state.setScreen);
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('auth');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setScreen]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden animated-gradient-bg" role="status" aria-label="Loading Vybr">
      {/* Aurora blobs - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-secondary/15 blur-[100px] animate-aurora" style={{ animationDelay: '4s' }} />
      </div>

      {/* Background glow - decorative */}
      <div className="absolute inset-0 gradient-glow" aria-hidden="true" />
      {/* Animated rings - decorative */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
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
      <motion.div initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      type: "spring",
      duration: 1
    }} className="relative z-10">
        <motion.img alt="Vybr" className="w-56 h-56 object-contain" animate={{
        filter: ['drop-shadow(0 0 30px hsl(var(--primary) / 0.4))', 'drop-shadow(0 0 60px hsl(var(--primary) / 0.6))', 'drop-shadow(0 0 30px hsl(var(--primary) / 0.4))']
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }} src="/lovable-uploads/45b181cd-997e-42d2-8803-d71d1e217c7a.png" />
      </motion.div>

      <motion.p initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.8
    }} className="mt-4 text-muted-foreground">
        Match by your digital soul
      </motion.p>
    </div>
  );
};