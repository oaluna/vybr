import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { PermissionsScreen } from '@/components/screens/PermissionsScreen';
import { OrientationScreen } from '@/components/screens/OrientationScreen';
import { CreateProfileScreen } from '@/components/screens/CreateProfileScreen';
import { AnalyzingScreen } from '@/components/screens/AnalyzingScreen';
import { MatchesScreen } from '@/components/screens/MatchesScreen';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { MessagesScreen } from '@/components/screens/MessagesScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { NotificationToast } from '@/components/NotificationToast';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);
  const setScreen = useAppStore((state) => state.setScreen);
  const { isAuthenticated, hasProfile, loading } = useAuth();

  // Handle auth state changes
  useEffect(() => {
    if (loading) return;

    // Screens that are part of the main app (don't redirect away from these)
    const mainAppScreens = ['matches', 'messages', 'profile', 'settings', 'chat'];
    
    // Screens that are part of onboarding flow
    const onboardingScreens = ['orientation', 'create-profile', 'analyzing'];

    // If user is authenticated and has a profile
    if (isAuthenticated && hasProfile) {
      // Only redirect if not already in main app or completing onboarding
      if (!mainAppScreens.includes(currentScreen) && !onboardingScreens.includes(currentScreen)) {
        setScreen('matches');
      }
    }
    // If user is authenticated but no profile, go to orientation
    else if (isAuthenticated && !hasProfile) {
      // Only redirect if not already in onboarding flow
      if (!onboardingScreens.includes(currentScreen)) {
        setScreen('orientation');
      }
    }
  }, [isAuthenticated, hasProfile, loading, currentScreen, setScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen key="splash" />;
      case 'auth':
        return <AuthScreen key="auth" />;
      case 'onboarding':
        return <OnboardingScreen key="onboarding" />;
      case 'permissions':
        return <PermissionsScreen key="permissions" />;
      case 'orientation':
        return <OrientationScreen key="orientation" />;
      case 'create-profile':
        return <CreateProfileScreen key="create-profile" />;
      case 'analyzing':
        return <AnalyzingScreen />;
      case 'matches':
        return <MatchesScreen key="matches" />;
      case 'messages':
        return <MessagesScreen key="messages" />;
      case 'profile':
        return <ProfileScreen key="profile" />;
      case 'settings':
        return <SettingsScreen key="settings" />;
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
