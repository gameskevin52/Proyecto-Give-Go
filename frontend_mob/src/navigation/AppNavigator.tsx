/**
 * Navegador Principal de Give & Go Mobile
 *
 * Maneja las rutas:
 * Home
 * CreateEvent - HU013
 * EditEvent - HU014 / HU015
 * EventDetail - HU016
 *
 * IMPORTANTE:
 * Los IDs de eventos vienen del backend como strings:
 * evt_1, evt_2, evt_3, evt_4...
 */

import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { EditEventScreen } from '../screens/EditEventScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';

export type RootScreenName =
  | 'Home'
  | 'CreateEvent'
  | 'EditEvent'
  | 'EventDetail';

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] =
    useState<RootScreenName>('Home');

  /**
   * ID del evento seleccionado.
   *
   * El backend devuelve IDs como:
   * evt_1
   * evt_2
   * evt_3
   * evt_4
   */
  const [selectedEventId, setSelectedEventId] =
    useState<string | null>(null);

  /**
   * Volver al catálogo.
   */
  const navigateToHome = () => {
    setSelectedEventId(null);
    setCurrentScreen('Home');
  };

  /**
   * Ir a crear evento.
   */
  const navigateToCreate = () => {
    setSelectedEventId(null);
    setCurrentScreen('CreateEvent');
  };

  /**
   * Ir a editar evento.
   */
  const navigateToEdit = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentScreen('EditEvent');
  };

  /**
   * Ir al detalle del evento.
   */
  const navigateToDetail = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentScreen('EventDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.container}>

        {/* =========================
            HOME / HU017
        ========================== */}
        {currentScreen === 'Home' && (
          <HomeScreen
            onNavigateToCreate={navigateToCreate}
            onNavigateToEdit={navigateToEdit}
            onNavigateToDetail={navigateToDetail}
          />
        )}

        {/* =========================
            CREAR EVENTO / HU013
        ========================== */}
        {currentScreen === 'CreateEvent' && (
          <CreateEventScreen
            onBack={navigateToHome}
            onSuccess={navigateToHome}
          />
        )}

        {/* =========================
            EDITAR EVENTO / HU014
        ========================== */}
        {currentScreen === 'EditEvent' &&
          selectedEventId !== null && (
            <EditEventScreen
              eventId={selectedEventId}
              onBack={navigateToHome}
              onSuccess={navigateToHome}
            />
          )}

        {/* =========================
            DETALLE / HU016
        ========================== */}
        {currentScreen === 'EventDetail' &&
          selectedEventId !== null && (
            <EventDetailScreen
              eventId={selectedEventId}
              onBack={navigateToHome}
              onNavigateToEdit={navigateToEdit}
            />
          )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});