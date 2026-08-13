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
import { RegistroScreen } from './src/screens/RegistroScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { EventosScreen } from './src/screens/EventosScreen';
import { MapaScreen } from './src/screens/MapaScreen';
import { DonarScreen } from './src/screens/DonarScreen';
import {
  getOrganizaciones,
  saveOrganizacion,
  updateOrganizacionInStorage,
} from './src/services/storage';

export default function App() {
  // Inicialmente muestra primero el formulario de registro de organización
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('REGISTRO');
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organizacion | null>(null);

  // Cargar organizaciones guardadas en AsyncStorage al iniciar
  useEffect(() => {
    const loadStoredOrgs = async () => {
      const stored = await getOrganizaciones();
      setOrganizaciones(stored);
      if (stored.length > 0) {
        setCurrentOrg(stored[0]);
      }
    };
    loadStoredOrgs();
  }, []);

  const handleRegisterSuccess = async (nuevaOrg: Organizacion) => {
    // Guardar en almacenamiento local persistente
    const updatedList = await saveOrganizacion(nuevaOrg);
    setOrganizaciones(updatedList);
    setCurrentOrg(nuevaOrg);

    // Redirigir al Dashboard de inmediato
    setCurrentScreen('DASHBOARD');
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
        onOpenRegistro={() => setCurrentScreen('REGISTRO')}
      />

      {/* Área Principal de Contenido Con Scroll */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentScreen === 'DASHBOARD' && (
          <DashboardScreen
            currentOrg={currentOrg}
            organizacionesCount={organizaciones.length}
            onOpenRegistro={() => setCurrentScreen('REGISTRO')}
            onUpdateOrg={handleUpdateOrg}
          />
        )}

        {currentScreen === 'EVENTOS' && <EventosScreen />}

        {currentScreen === 'MAPA' && <MapaScreen organizaciones={organizaciones} />}

        {currentScreen === 'DONAR' && <DonarScreen />}

        {currentScreen === 'REGISTRO' && (
          <RegistroScreen
            onRegisterSuccess={handleRegisterSuccess}
            onCancel={() => setCurrentScreen('DASHBOARD')}
            hasExistingOrgs={organizaciones.length > 0}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Barra de Navegación Inferior */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectTab={(tab) => setCurrentScreen(tab)}
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
