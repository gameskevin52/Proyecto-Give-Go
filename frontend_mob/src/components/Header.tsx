import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onOpenRegistro: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRegistro }) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Text style={styles.heartIcon}>❤️</Text>
        <Text style={styles.brandTitle}>Give&Go</Text>
      </View>
      <TouchableOpacity
        style={styles.registerButtonHeader}
        onPress={onOpenRegistro}
      >
        <Text style={styles.registerButtonHeaderText}>+ Registrar Org</Text>
      </TouchableOpacity>
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
  registerButtonHeader: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  registerButtonHeaderText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
