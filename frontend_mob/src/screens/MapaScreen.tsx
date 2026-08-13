import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';

interface MapaScreenProps {
  organizaciones: Organizacion[];
}

export const MapaScreen: React.FC<MapaScreenProps> = ({ organizaciones }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>🗺️ Mapa de Cobertura</Text>
      <Text style={styles.screenSubtitle}>Puntos de acopio y sedes comunitarias en Bogotá D.C.</Text>

      {organizaciones.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>Sin puntos en el mapa</Text>
          <Text style={styles.emptyDesc}>
            Aún no hay puntos ni sedes registradas en el mapa. Se agregarán automáticamente al registrar organizaciones.
          </Text>
        </View>
      ) : (
        organizaciones.map((org) => (
          <View key={org.idOrganizacion} style={styles.cardItem}>
            <Text style={styles.cardBadge}>{org.barrio} • {org.ciudad}</Text>
            <Text style={styles.cardItemTitle}>{org.nombre}</Text>
            <Text style={styles.cardItemDesc}>
              {org.direccion} • Tel: {org.telefono}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardItemDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
