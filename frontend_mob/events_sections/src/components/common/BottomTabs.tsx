import React from 'react';
import { LayoutDashboard, PlusCircle, CalendarDays } from 'lucide-react';

export type TabType = 'dashboard' | 'create-event' | 'my-events';

interface BottomTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'create-event' as TabType,
      label: 'Crear Evento',
      icon: PlusCircle,
    },
    {
      id: 'my-events' as TabType,
      label: 'Mis Eventos',
      icon: CalendarDays,
    },
  ];

  return (
    <nav
      id="giveandgo-bottom-tabs"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg px-2 py-2"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-red-600 font-bold bg-red-50/80 scale-105'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
