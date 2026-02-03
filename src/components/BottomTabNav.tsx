import { motion } from 'framer-motion';
import { MessageCircle, User, Settings } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import vybrLogo from '@/assets/vybr-logo.png';

type TabType = 'matches' | 'messages' | 'profile' | 'settings';

interface Tab {
  id: TabType;
  label: string;
  icon?: typeof MessageCircle;
  isLogo?: boolean;
  screen: 'matches' | 'messages' | 'profile' | 'settings';
}

const tabs: Tab[] = [
  { id: 'matches', label: 'Matches', isLogo: true, screen: 'matches' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, screen: 'messages' },
  { id: 'profile', label: 'Profile', icon: User, screen: 'profile' },
  { id: 'settings', label: 'Settings', icon: Settings, screen: 'settings' },
];

export const BottomTabNav = () => {
  const { currentScreen, setScreen } = useAppStore();

  const getActiveTab = (): TabType => {
    if (currentScreen === 'chat') return 'messages';
    if (['matches', 'messages', 'profile', 'settings'].includes(currentScreen)) {
      return currentScreen as TabType;
    }
    return 'matches';
  };

  const activeTab = getActiveTab();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass border-t border-border z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-4" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.screen)}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
            >
              <div className="relative" aria-hidden="true">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 gradient-primary rounded-full blur-lg opacity-50"
                  />
                )}
                {tab.isLogo ? (
                  <img 
                    src={vybrLogo} 
                    alt="" 
                    className={`w-6 h-6 relative z-10 transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-50'
                    }`}
                  />
                ) : (
                  <Icon
                    className={`w-6 h-6 relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                aria-hidden="true"
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};
