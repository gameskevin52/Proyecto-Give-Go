import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onSelectTab: (tab: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onSelectTab }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navTab}
        onPress={() => onSelectTab('DASHBOARD')}
      >
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={[styles.navLabel, currentScreen === 'DASHBOARD' && styles.navLabelActive]}>
          DASHBOARD
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => onSelectTab('EVENTOS')}
      >
        <Text style={styles.navIcon}>📅</Text>
        <Text style={[styles.navLabel, currentScreen === 'EVENTOS' && styles.navLabelActive]}>
          EVENTOS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => onSelectTab('MAPA')}
      >
        <Text style={styles.navIcon}>📍</Text>
        <Text style={[styles.navLabel, currentScreen === 'MAPA' && styles.navLabelActive]}>
          MAPA
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navTab}
        onPress={() => onSelectTab('DONAR')}
      >
        <Text style={styles.navIcon}>❤️</Text>
        <Text style={[styles.navLabel, currentScreen === 'DONAR' && styles.navLabelActive]}>
          DONAR
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 64,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});
