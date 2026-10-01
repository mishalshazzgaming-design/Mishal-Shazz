import React from 'react';
import { Home, Clock, BookOpen, Users, MoreHorizontal } from 'lucide-react';

export type NavTab = 'today' | 'ibadah' | 'quran' | 'journey' | 'more' | 'calendar' | 'history' | 'fasting' | 'journal' | 'learn';

interface BottomNavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
  isMoreOpen: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenMoreMenu,
  isMoreOpen,
}) => {
  const tabs = [
    { key: 'today' as NavTab, label: 'Today', icon: <Home className="w-5 h-5" /> },
    { key: 'ibadah' as NavTab, label: 'Prayers', icon: <Clock className="w-5 h-5" /> },
    { key: 'quran' as NavTab, label: 'Quran', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'journey' as NavTab, label: 'Journey', icon: <Users className="w-5 h-5" /> },
    { key: 'more' as NavTab, label: 'More', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07111F]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 sm:hidden transition-all">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive =
            tab.key === 'more'
              ? isMoreOpen || ['calendar', 'history', 'fasting', 'journal', 'learn'].includes(activeTab)
              : activeTab === tab.key && !isMoreOpen;

          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === 'more') {
                  onOpenMoreMenu();
                } else {
                  onSelectTab(tab.key);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
                isActive ? 'text-[#8DB7D9]' : 'text-[#B8C1CC]/70 hover:text-[#F5F3EE]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8DB7D9]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#F5F3EE] font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
