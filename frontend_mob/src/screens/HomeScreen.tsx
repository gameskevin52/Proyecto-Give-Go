/**
 * HU017 — Pantalla Principal / Catálogo de Eventos
 * Give & Go Mobile
 *
 * Consulta:
 * GET /api/events/
 *
 * Utiliza el contrato REAL del backend.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CustomButton } from '../components/common/CustomButton';
import { getAllEvents } from '../services/eventService';
import { Evento } from '../types/event.types';

interface HomeScreenProps {
  onNavigateToCreate?: () => void;
  onNavigateToEdit?: (eventId: string) => void;
  onNavigateToDetail?: (eventId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCreate,
  onNavigateToEdit,
  onNavigateToDetail,
}) => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * HU017
   * Consulta GET /api/events/
   */
  const fetchEvents = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);

      const response = await getAllEvents();

      if (response.success && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
        setErrorMessage(
          response.message || 'No se pudieron cargar los eventos.'
        );
      }
    } catch (error: any) {
      console.error('Error obteniendo eventos:', error);

      setErrorMessage(
        error?.message ||
          'No fue posible conectar con el servidor. Verifica que el backend esté ejecutándose.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Formatea la fecha recibida del backend.
   *
   * Ejemplo:
   * 2026-09-19T14:00:00.000Z
   */
  const formatDateTime = (fecha: string) => {
    if (!fecha) {
      return {
        date: 'Fecha por definir',
        time: 'Hora por definir',
      };
    }

    const dateObject = new Date(fecha);

    if (Number.isNaN(dateObject.getTime())) {
      return {
        date: fecha,
        time: '',
      };
    }

    return {
      date: dateObject.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      time: dateObject.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
  };

  /**
   * Renderiza cada evento.
   */
  const renderEventItem = ({ item }: { item: Evento }) => {
    const { date, time } = formatDateTime(item.fecha);

    return (
      <Pressable
        style={styles.eventCard}
        onPress={() => {
          if (onNavigateToDetail) {
            onNavigateToDetail(item.id);
          }
        }}
        android_ripple={{ color: '#FEE2E2' }}
      >
        {/* Imagen */}
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🤝</Text>
            <Text style={styles.placeholderText}>Give & Go</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          {/* Categoría y estado */}
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>
              {item.categoria}
            </Text>

            <Text
              style={[
                styles.statusBadge,
                item.estado === 'cancelado' &&
                  styles.statusBadgeCancelled,
              ]}
            >
              {item.estado.toUpperCase()}
            </Text>
          </View>

          {/* Nombre */}
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.nombre}
          </Text>

          {/* Organización */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏢</Text>
            <Text style={styles.infoText} numberOfLines={1}>
              {item.organizacionNombre}
            </Text>
          </View>

          {/* Fecha */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              {date} • {time}
            </Text>
          </View>

          {/* Ubicación */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText} numberOfLines={2}>
              {item.nombre_lugar
                ? `${item.nombre_lugar}, `
                : ''}
              {item.barrio ? `${item.barrio}, ` : ''}
              {item.ciudad || item.direccion}
            </Text>
          </View>

          {/* Cupos */}
          <View style={styles.capacityRow}>
            <View style={styles.capacityBox}>
              <Text style={styles.capacityLabel}>
                Cupo
              </Text>
              <Text style={styles.capacityValue}>
                {item.cupo}
              </Text>
            </View>

            <View style={styles.capacityBoxVolunteer}>
              <Text style={styles.capacityLabelVolunteer}>
                Voluntarios
              </Text>
              <Text style={styles.capacityValueVolunteer}>
                {item.vacantesVoluntarios}
              </Text>
            </View>

            <View style={styles.capacityBoxBeneficiary}>
              <Text style={styles.capacityLabelBeneficiary}>
                Beneficiarios
              </Text>
              <Text style={styles.capacityValueBeneficiary}>
                {item.vacantesBeneficiarios}
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.actionsRow}>
            <Text style={styles.detailText}>
              Ver detalle completo →
            </Text>

            {onNavigateToEdit && (
              <Pressable
                style={styles.editButton}
                onPress={(event) => {
                  event.stopPropagation();
                  onNavigateToEdit(item.id);
                }}
              >
                <Text style={styles.editButtonText}>
                  ⚙️ Gestionar
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  /**
   * Cabecera.
   */
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.brandBadge}>
        <Text style={styles.brandText}>
          GIVE & GO • MÓDULO DE EVENTOS
        </Text>
      </View>

      <Text style={styles.mainTitle}>
        Catálogo de Eventos
      </Text>

      <Text style={styles.subtitle}>
        Explora las actividades solidarias, jornadas de
        voluntariado y actividades comunitarias disponibles.
      </Text>

      {/* Crear evento */}
      {onNavigateToCreate && (
        <View style={styles.createCard}>
          <Text style={styles.createTag}>
            HU013 • ORGANIZACIONES
          </Text>

          <Text style={styles.createTitle}>
            ¿Representas una organización?
          </Text>

          <Text style={styles.createDescription}>
            Publica una nueva jornada de apoyo social con
            vacantes para voluntarios y beneficiarios.
          </Text>

          <CustomButton
            title="+ Publicar nuevo evento"
            onPress={onNavigateToCreate}
            variant="primary"
            style={styles.createButton}
          />
        </View>
      )}

      {/* Estado del catálogo */}
      <View style={styles.catalogBar}>
        <Text style={styles.catalogCount}>
          {events.length}{' '}
          {events.length === 1
            ? 'evento disponible'
            : 'eventos disponibles'}
        </Text>

        <Pressable
          style={styles.refreshButton}
          onPress={() => fetchEvents(true)}
        >
          <Text style={styles.refreshText}>
            🔄 Actualizar
          </Text>
        </Pressable>
      </View>
    </View>
  );

  /**
   * Loading.
   */
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#DC2626"
        />

        <Text style={styles.loadingText}>
          Cargando catálogo de eventos...
        </Text>
      </View>
    );
  }

  /**
   * Error.
   */
  if (errorMessage && events.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>!</Text>

          <Text style={styles.errorTitle}>
            Error al cargar eventos
          </Text>

          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>

          <CustomButton
            title="Reintentar"
            onPress={() => fetchEvents()}
            variant="primary"
            style={styles.retryButton}
          />

          {onNavigateToCreate && (
            <CustomButton
              title="+ Crear evento"
              onPress={onNavigateToCreate}
              variant="outline"
              style={styles.createFallbackButton}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>

            <Text style={styles.emptyTitle}>
              Catálogo sin eventos
            </Text>

            <Text style={styles.emptyDescription}>
              No se encontraron eventos comunitarios
              disponibles en este momento.
            </Text>

            {onNavigateToCreate && (
              <CustomButton
                title="+ Crear el primer evento"
                onPress={onNavigateToCreate}
                variant="primary"
                style={styles.emptyButton}
              />
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchEvents(true)}
            colors={['#DC2626']}
            tintColor="#DC2626"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },

  headerContainer: {
    marginBottom: 16,
  },

  brandBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },

  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },

  createTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },

  createTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 5,
  },

  createDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },

  createButton: {
    width: '100%',
  },

  catalogBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },

  catalogCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  refreshButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 7,
  },

  refreshText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  imagePlaceholder: {
    height: 110,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderEmoji: {
    fontSize: 32,
  },

  placeholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
    marginTop: 3,
  },

  cardBody: {
    padding: 16,
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  statusBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  statusBadgeCancelled: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  infoIcon: {
    fontSize: 14,
    marginRight: 7,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
  },

  capacityRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },

  capacityBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  capacityBoxVolunteer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 7,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  capacityBoxBeneficiary: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 7,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  capacityLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  capacityValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },

  capacityLabelVolunteer: {
    fontSize: 9,
    color: '#2563EB',
    fontWeight: '600',
  },

  capacityValueVolunteer: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  capacityLabelBeneficiary: {
    fontSize: 9,
    color: '#DC2626',
    fontWeight: '600',
  },

  capacityValueBeneficiary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B91C1C',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  detailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },

  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },

  editButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },

  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },

  emptyButton: {
    width: '100%',
  },

  errorCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    elevation: 2,
  },

  errorIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 12,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },

  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  retryButton: {
    width: '100%',
    marginBottom: 10,
  },

  createFallbackButton: {
    width: '100%',
  },
});