/**
 * Navegador Principal de Give & Go Mobile (React Native + TypeScript)
 * Maneja las rutas: Home, CreateEvent (HU013), EditEvent (HU014 & HU015) y EventDetail (HU016)
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { EditEventScreen } from '../screens/EditEventScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';

export type RootScreenName = 'Home' | 'CreateEvent' | 'EditEvent' | 'EventDetail';

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<RootScreenName>('Home');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const navigateToHome = () => {
    setSelectedEventId(null);
    setCurrentScreen('Home');
  };

  const navigateToCreate = () => {
    setSelectedEventId(null);
    setCurrentScreen('CreateEvent');
  };

  const navigateToEdit = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentScreen('EditEvent');
  };

  const navigateToDetail = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentScreen('EventDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {currentScreen === 'Home' && (
          <HomeScreen
            onNavigateToCreate={navigateToCreate}
            onNavigateToEdit={navigateToEdit}
            onNavigateToDetail={navigateToDetail}
          />
        )}

        {currentScreen === 'CreateEvent' && (
          <CreateEventScreen
            onBack={navigateToHome}
            onSuccess={navigateToHome}
          />
        )}

        {currentScreen === 'EditEvent' && selectedEventId !== null && (
          <EditEventScreen
            eventId={selectedEventId}
            onBack={navigateToHome}
            onSuccess={navigateToHome}
          />
        )}

        {currentScreen === 'EventDetail' && selectedEventId !== null && (
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
