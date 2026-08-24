import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserRole } from '../types/donation';
import { Heart, ShieldCheck, UserCheck, Smartphone, Maximize2, Database } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  activeTabTitle: string;
  onOpenApiConfig?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isMobileFrame,
  onToggleFrame,
  activeTabTitle,
  onOpenApiConfig,
}) => {
  return (
    <View className="bg-white border-b border-gray-100 z-30 shadow-xs">
      {/* Top Brand Bar */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        {/* Logo Give&Go */}
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-2xl bg-red-600 items-center justify-center text-white shadow-md">
            <Heart className="w-5 h-5 fill-white text-white" />
          </View>
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                Give<Text className="text-red-600">&</Text>Go
              </Text>
              <Text className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                Mobile
              </Text>
            </View>
            <Text className="text-[11px] text-gray-500 font-medium">Donaciones con Impacto</Text>
          </View>
        </View>

        {/* Right Actions: API Config, Role selector & Frame toggle */}
        <View className="flex-row items-center gap-1.5">
          {/* API / DB Config Button */}
          {onOpenApiConfig && (
            <TouchableOpacity
              onPress={onOpenApiConfig}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors relative"
            >
              <Database className="w-4 h-4 text-gray-600" />
              <View className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1" />
            </TouchableOpacity>
          )}

          {/* Frame Toggle */}
          <TouchableOpacity
            onPress={onToggleFrame}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4 text-gray-600" /> : <Smartphone className="w-4 h-4 text-gray-600" />}
          </TouchableOpacity>

          {/* Role Pill Switcher */}
          <View className="flex-row items-center bg-gray-100 p-1 rounded-xl border border-gray-200/60">
            <TouchableOpacity
              onPress={() => onRoleChange('Voluntario')}
              className={`flex-row items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                currentRole === 'Voluntario'
                  ? 'bg-white text-red-600 shadow-xs font-bold'
                  : 'text-gray-600'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${currentRole === 'Voluntario' ? 'text-red-600' : 'text-gray-600'}`} />
              <Text className={`text-xs ${currentRole === 'Voluntario' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                Voluntario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onRoleChange('Administrador')}
              className={`flex-row items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                currentRole === 'Administrador'
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'text-gray-600'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === 'Administrador' ? 'text-white' : 'text-gray-600'}`} />
              <Text className={`text-xs ${currentRole === 'Administrador' ? 'text-white font-bold' : 'text-gray-600'}`}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Subheader: Current Section Title */}
      <View className="px-4 py-2 bg-slate-50 border-t border-gray-100 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-red-600" />
          <Text className="text-sm font-bold text-gray-800">{activeTabTitle}</Text>
        </View>
        <View className="flex-row items-center gap-2 text-xs text-gray-500 font-medium">
          <Text className="text-xs text-gray-500 font-medium">Rol activo: </Text>
          <Text className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            currentRole === 'Administrador' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {currentRole}
          </Text>
        </View>
      </View>
    </View>
  );
};
