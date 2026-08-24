import React from 'react';
import { View, Text } from 'react-native';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isMobileFrame }) => {
  if (!isMobileFrame) {
    return <View className="flex-1 bg-slate-50">{children}</View>;
  }

  return (
    <View className="flex-1 bg-slate-900 py-2 px-2 items-center justify-center">
      <View className="w-full max-w-[430px] flex-1 bg-white rounded-[36px] border-[8px] border-slate-800 relative overflow-hidden flex-col">
        {/* Phone Notch & Status Bar */}
        <View className="bg-white pt-2 px-6 flex-row items-center justify-between text-[11px] z-50">
          <Text className="text-[11px] font-bold text-gray-900">9:41</Text>
          {/* Dynamic Island Notch */}
          <View className="w-24 h-4 bg-black rounded-full" />
          <View className="flex-row items-center gap-1.5">
            <Signal className="w-3 h-3 text-gray-800" />
            <Wifi className="w-3 h-3 text-gray-800" />
            <Battery className="w-3.5 h-3.5 text-gray-800 fill-gray-800" />
          </View>
        </View>

        {/* Inner Phone Viewport */}
        <View className="flex-1 relative bg-slate-50">
          {children}
        </View>

        {/* Home Indicator Bar */}
        <View className="bg-white py-1.5 items-center justify-center z-50">
          <View className="w-32 h-1 bg-gray-300 rounded-full" />
        </View>
      </View>
    </View>
  );
};
