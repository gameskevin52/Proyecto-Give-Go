import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';

interface DashboardScreenProps {
  currentOrg: Organizacion | null;
  organizacionesCount: number;
  onOpenRegistro: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentOrg,
  organizacionesCount,
  onOpenRegistro,
}) => {
  return (
    <View style={styles.container}>
      {/* Banner Bienvenida */}
      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>
          {currentOrg ? `ID #${currentOrg.idOrganizacion} • ${currentOrg.barrio}` : 'Bogotá Solidaria'}
        </Text>
        <Text style={styles.heroTitle}>
          {currentOrg ? currentOrg.nombre : 'Panel de Organizaciones Give&Go'}
        </Text>
        <Text style={styles.heroSubtitle}>
          {currentOrg
            ? `Organización registrada en ${currentOrg.ciudad}. NIT: ${currentOrg.nit} | Correo: ${currentOrg.correo}`
            : 'Inscribe una organización para comenzar a gestionar donaciones, eventos y voluntariado.'}
        </Text>
      </View>

      {/* Tarjetas de Métricas */}
      <Text style={styles.sectionTitle}>Resumen de la Organización</Text>
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.metricNumber}>{organizacionesCount}</Text>
          <Text style={styles.metricLabel}>Organizaciones</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: COLORS.info }]}>
          <Text style={styles.metricNumber}>0</Text>
          <Text style={styles.metricLabel}>Eventos Activos</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.metricNumber}>$0</Text>
          <Text style={styles.metricLabel}>Total Donaciones</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: COLORS.warning }]}>
          <Text style={styles.metricNumber}>0</Text>
          <Text style={styles.metricLabel}>Voluntarios</Text>
        </View>
      </View>

      {/* Botón Acción Rápida */}
      <TouchableOpacity
        style={styles.primaryActionButton}
        onPress={onOpenRegistro}
      >
        <Text style={styles.primaryActionButtonText}>📝 Inscribir Nueva Fundación / Organización</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroBadge: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#FEF2F2',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  primaryActionButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryActionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
