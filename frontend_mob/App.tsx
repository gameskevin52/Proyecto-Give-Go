import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/theme';
import { ScreenType, Organizacion } from './src/types';
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { EventosScreen } from './src/screens/EventosScreen';
import { MapaScreen } from './src/screens/MapaScreen';
import { DonarScreen } from './src/screens/DonarScreen';
import {
  getOrganizaciones,
  updateOrganizacionInStorage,
} from './src/services/storage';

export default function App() {
  // Inicia mostrando la pantalla de Inicio de Sesión Institucional
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LOGIN');
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organizacion | null>(null);

  // Cargar organizaciones guardadas en AsyncStorage al iniciar
  useEffect(() => {
    const loadStoredOrgs = async () => {
      const stored = await getOrganizaciones();
      setOrganizaciones(stored);
    };
    loadStoredOrgs();
  }, []);

  const handleLoginSuccess = (org: Organizacion) => {
    setCurrentOrg(org);
    setCurrentScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentOrg(null);
    setCurrentScreen('LOGIN');
  };

  const handleUpdateOrg = async (updatedOrg: Organizacion) => {
    const updatedList = await updateOrganizacionInStorage(updatedOrg);
    setOrganizaciones(updatedList);
    setCurrentOrg(updatedOrg);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />

      {/* Encabezado Superior */}
      <Header
        currentScreen={currentScreen}
        isLoggedIn={currentOrg !== null}
        onLogout={handleLogout}
        onOpenLogin={() => setCurrentScreen('LOGIN')}
      />

      {/* Área Principal de Contenido Con Scroll */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentScreen === 'LOGIN' && (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}

        {currentScreen === 'DASHBOARD' && (
          <DashboardScreen
            currentOrg={currentOrg}
            organizacionesCount={organizaciones.length}
            onLogout={handleLogout}
            onUpdateOrg={handleUpdateOrg}
          />
        )}

        {currentScreen === 'EVENTOS' && <EventosScreen />}

        {currentScreen === 'MAPA' && <MapaScreen organizaciones={organizaciones} />}

        {currentScreen === 'DONAR' && <DonarScreen />}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Barra de Navegación Inferior */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectTab={(tab) => {
          // Si el usuario intenta ir al Dashboard sin haber iniciado sesión, le muestra Login
          if (tab === 'DASHBOARD' && !currentOrg) {
            setCurrentScreen('LOGIN');
          } else {
            setCurrentScreen(tab);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
