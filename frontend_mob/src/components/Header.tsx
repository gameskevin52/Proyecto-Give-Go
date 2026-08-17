//Componentes reutilizables
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
}
// Encabezado de la app siendo la barra superior en todas las
export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  isLoggedIn,
  onLogout,
  onOpenLogin,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Text style={styles.heartIcon}>❤️</Text>
        <Text style={styles.brandTitle}>Give&Go</Text>
      </View>

      {isLoggedIn ? (
        <TouchableOpacity style={styles.authButtonHeader} onPress={onLogout}>
          <Text style={styles.authButtonHeaderText}>🚪 Salir</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.authButtonHeader, currentScreen === 'LOGIN' && styles.authButtonActive]}
          onPress={onOpenLogin}
        >
          <Text style={styles.authButtonHeaderText}>🔑 Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  authButtonHeader: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  authButtonActive: {
    backgroundColor: '#FFE4E6',
  },
  authButtonHeaderText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
