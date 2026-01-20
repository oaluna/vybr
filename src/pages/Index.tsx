import { useAppStore } from '@/store/appStore';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { PermissionsScreen } from '@/components/screens/PermissionsScreen';
import { OrientationScreen } from '@/components/screens/OrientationScreen';
import { AnalyzingScreen } from '@/components/screens/AnalyzingScreen';
import { MatchesScreen } from '@/components/screens/MatchesScreen';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { NotificationToast } from '@/components/NotificationToast';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen key="splash" />;
      case 'onboarding':
        return <OnboardingScreen key="onboarding" />;
      case 'permissions':
        return <PermissionsScreen key="permissions" />;
      case 'orientation':
        return <OrientationScreen key="orientation" />;
      case 'analyzing':
        return <AnalyzingScreen key="analyzing" />;
      case 'matches':
        return <MatchesScreen key="matches" />;
      case 'chat':
        return <ChatScreen key="chat" />;
      default:
        return <SplashScreen key="splash" />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile frame for desktop preview */}
      <div className="max-w-md mx-auto min-h-screen relative">
        <NotificationToast />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
