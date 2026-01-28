import { motion } from 'framer-motion';
import { Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Globe } from 'lucide-react';
import { BottomTabNav } from '@/components/BottomTabNav';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';

interface SettingItem {
  icon: typeof Bell;
  label: string;
  description?: string;
}

const settingsGroups: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', description: 'Manage alerts' },
      { icon: Moon, label: 'Appearance', description: 'Dark mode' },
      { icon: Globe, label: 'Language', description: 'English' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Shield, label: 'Privacy & Security' },
      { icon: HelpCircle, label: 'Help Center' },
    ],
  },
];

export const SettingsScreen = () => {
  const { signOut, isAuthenticated } = useAuth();
  const { setScreen, resetApp } = useAppStore();

  const handleLogout = async () => {
    await signOut();
    resetApp();
    setScreen('auth');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your experience
        </p>
      </motion.div>

      {/* Settings groups */}
      <div className="flex-1 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {group.title}
            </h3>
            <div className="glass rounded-2xl overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left ${
                      itemIndex !== group.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout button */}
        {isAuthenticated && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleLogout}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-destructive/10 transition-colors text-destructive"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Log Out</span>
          </motion.button>
        )}
      </div>

      <BottomTabNav />
    </div>
  );
};
