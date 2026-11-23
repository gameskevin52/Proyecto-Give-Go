import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import {
  Home,
  MapPin,
  Calendar,
  HeartHandshake,
  ClipboardList,
  User,
  LayoutDashboard,
} from 'lucide-react-native';
import { BottomTabParamList } from './types';
import { colors } from '../config/theme';
import { useAuth } from '../store/auth/AuthContext';

// Views
import { Home as HomeScreen } from '../features/home/views/Home';
import { MapaSocialView } from '../features/map/views/MapaSocialView';
import { EventsListView } from '../features/events/views/EventsListView';
import { DonationsListView } from '../features/donations/views/DonationsListView';
import { DashboardView } from '../features/dashboard/views/DashboardView';
import { BeneficiaryRequestsView } from '../features/beneficiary/views/BeneficiaryRequestsView';
import { ProfileView } from '../features/profile/views/ProfileView';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  const iconSize = focused ? 22 : 20;
  const strokeWidth = focused ? 2.5 : 2;

  let IconComponent = Home;
  if (name === 'Mapa') IconComponent = MapPin;
  if (name === 'Eventos') IconComponent = Calendar;
  if (name === 'Donaciones') IconComponent = HeartHandshake;
  if (name === 'Dashboard') IconComponent = LayoutDashboard;
  if (name === 'Solicitudes') IconComponent = ClipboardList;
  if (name === 'Perfil') IconComponent = User;

  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <IconComponent size={iconSize} color={color} strokeWidth={strokeWidth} />
    </View>
  );
};

export const BottomTabNavigator = () => {
  const { user } = useAuth();
  const role = (user?.rol || 'voluntario').toLowerCase();

  const isBeneficiary = role === 'beneficiario';
  const isAdmin = role === 'admin';
  const isOrg = role === 'organizacion';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted || '#94A3B8',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 9.5,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
      })}
    >
      {/* 1. Inicio (para todos los roles) */}
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />

      {/* 2. Mapa Interactivo (disponible para todos los roles) */}
      <Tab.Screen
        name="Mapa"
        component={MapaSocialView}
        options={{ tabBarLabel: 'Mapa' }}
      />

      {/* 3. Panel de Administración (solo visible para admin como panel principal) */}
      {isAdmin && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardView}
          options={{ tabBarLabel: 'Admin Hub' }}
        />
      )}

      {/* 3. Panel de Organización (solo visible para organización como panel principal) */}
      {isOrg && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardView}
          options={{ tabBarLabel: 'Panel Org' }}
        />
      )}

      {/* 4. Eventos / Jornadas (para todos) */}
      <Tab.Screen
        name="Eventos"
        component={EventsListView}
        options={{
          tabBarLabel: isBeneficiary ? 'Jornadas' : isOrg ? 'Mis Eventos' : 'Convocatorias',
        }}
      />

      {/* 5. Donaciones (para voluntarios, org y admin) o Solicitudes (para beneficiario) */}
      {isBeneficiary ? (
        <Tab.Screen
          name="Solicitudes"
          component={BeneficiaryRequestsView}
          options={{ tabBarLabel: 'Solicitudes' }}
        />
      ) : (
        <Tab.Screen
          name="Donaciones"
          component={DonationsListView}
          options={{
            tabBarLabel: isOrg ? 'Fondos' : isAdmin ? 'Donaciones' : 'Aportar',
          }}
        />
      )}

      {/* 6. Dashboard de impacto / red de apoyo (para voluntarios y beneficiarios) */}
      {!isAdmin && !isOrg && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardView}
          options={{
            tabBarLabel: isBeneficiary ? 'Red Apoyo' : 'Mi Impacto',
          }}
        />
      )}

      {/* 7. Perfil (para todos los roles) */}
      <Tab.Screen
        name="Perfil"
        component={ProfileView}
        options={{ tabBarLabel: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    transform: [{ scale: 1.08 }],
  },
});

export default BottomTabNavigator;
