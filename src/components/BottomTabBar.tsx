import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HeartHandshake, History } from 'lucide-react';

export type TabType = 'donar' | 'historial';

interface BottomTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount = 0,
}) => {
  const tabs = [
    { id: 'donar' as TabType, label: 'Donar', icon: HeartHandshake },
    { id: 'historial' as TabType, label: 'Donaciones', icon: History, badge: pendingCount },
  ];

  return (
    <View className="bg-white border-t border-gray-200/80 shadow-lg">
      <View className="max-w-md mx-auto px-4 flex-row items-center justify-around h-16 relative gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectTab(tab.id)}
              className={`flex-1 py-2 flex-col items-center justify-center relative rounded-xl ${
                isActive ? 'bg-red-50/60' : ''
              }`}
            >
              <View className="relative items-center">
                <Icon className={`w-6 h-6 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <View className="absolute -top-1 -right-2 bg-red-600 w-4 h-4 rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-extrabold text-center">
                      {tab.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text className={`text-xs mt-1 ${isActive ? 'font-black text-red-600' : 'font-medium text-gray-500'}`}>
                {tab.label}
              </Text>
              {isActive && (
                <View className="w-8 h-0.5 rounded-full bg-red-600 absolute bottom-0.5" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
