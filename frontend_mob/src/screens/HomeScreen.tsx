/**
 * HU017 — Pantalla Principal / Catálogo de Eventos (Give & Go Mobile)
 * Consulta GET /api/events/, presenta lista interactiva con FlatList, Pull-to-refresh,
 * indicadores de cupo y navegación hacia HU013, HU014/HU015 y HU016.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CustomButton } from '../components/common/CustomButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getAllEvents } from '../services/eventService';
import { Evento } from '../types/event.types';

// Mapeo de categorías oficiales del backend Give & Go
const CATEGORY_NAMES: Record<number, string> = {
  1: 'Alimentación y Comedores',
  2: 'Salud y Primeros Auxilios',
  3: 'Educación y Talleres',
  4: 'Medio Ambiente y Reciclaje',
  5: 'Refugio y Vivienda',
  6: 'Donaciones y Ropa',
  7: 'Apoyo a la Niñez y Juventud',
  8: 'Cuidado de Adultos Mayores',
};

interface HomeScreenProps {
  onNavigateToCreate?: () => void;
  onNavigateToEdit?: (eventId: number) => void;
  onNavigateToDetail?: (eventId: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCreate,
  onNavigateToEdit,
  onNavigateToDetail,
}) => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consulta GET /api/events/
  const fetchEvents = useCallback(async (isRefreshAction = false) => {
    if (isRefreshAction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const response = await getAllEvents();
      let eventList: Evento[] = [];

      if (Array.isArray(response)) {
        eventList = response;
      } else if (response && Array.isArray((response as any).data)) {
        eventList = (response as any).data;
      } else if (response && Array.isArray((response as any).events)) {
        eventList = (response as any).events;
      }

      setEvents(eventList);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'No fue posible cargar los eventos. Verifica que el backend esté en ejecución y que la URL/IP configurada sea accesible desde el dispositivo.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Formateo de fecha y hora
  const formatDateTime = (rawFecha?: string) => {
    if (!rawFecha) return { dateStr: 'Por definir', timeStr: '' };
    const cleanFecha = rawFecha.replace('T', ' ');
    const parts = cleanFecha.split(' ');
    const dateStr = parts[0] || rawFecha;
    const timeStr = parts[1] ? parts[1].substring(0, 5) : '';
    return { dateStr, timeStr };
  };

  // Renderizado de cada tarjeta de evento
  const renderEventItem = ({ item }: { item: Evento }) => {
    const eventId = item.id_evento || 0;
    const { dateStr, timeStr } = formatDateTime(item.fecha);
    const categoryName =
      item.categoria_nombre ||
      CATEGORY_NAMES[item.id_categoria] ||
      `Categoría #${item.id_categoria}`;

    return (
      <Pressable
        style={styles.eventCard}
        onPress={() => {
          if (eventId > 0 && onNavigateToDetail) {
            onNavigateToDetail(eventId);
          }
        }}
        android_ripple={{ color: '#FEE2E2' }}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalle de ${item.nombre}`}
      >
        {/* IMAGEN O PLACEHOLDER */}
        {item.imagen && item.imagen.trim().length > 0 ? (
          <Image
            source={{ uri: item.imagen }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardPlaceholderIcon}>🤝</Text>
            <Text style={styles.cardPlaceholderText}>Give & Go</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          {/* BADGES SUPERIORES */}
          <View style={styles.cardBadgeRow}>
            <Text style={styles.categoryBadge}>{categoryName}</Text>
            <Text
              style={[
                styles.statusBadge,
                item.estado === 'cancelado' && styles.statusBadgeCancelled,
              ]}
            >
              {item.estado ? item.estado.toUpperCase() : 'ACTIVO'}
            </Text>
          </View>

          {/* TÍTULO DEL EVENTO */}
          <Text style={styles.eventCardTitle} numberOfLines={2}>
            {item.nombre}
          </Text>

          {/* FECHA Y HORA */}
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>
              {dateStr} {timeStr ? `• ${timeStr} hrs` : ''}
            </Text>
          </View>

          {/* UBICACIÓN */}
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {item.nombre_lugar ? `${item.nombre_lugar}, ` : ''}
              {item.barrio ? `${item.barrio}, ` : ''}
              {item.ciudad || item.direccion || 'Ubicación comunitaria'}
            </Text>
          </View>

          {/* CONTADORES DE VACANTES Y CUPOS */}
          <View style={styles.capacityRow}>
            <View style={styles.capacityBadgeTotal}>
              <Text style={styles.capacityLabel}>Cupo:</Text>
              <Text style={styles.capacityValue}>{item.cupo ?? 0}</Text>
            </View>

            <View style={styles.capacityBadgeVol}>
              <Text style={styles.capacityLabelVol}>Voluntarios:</Text>
              <Text style={styles.capacityValueVol}>{item.vacantes_voluntarios ?? 0}</Text>
            </View>

            <View style={styles.capacityBadgeBen}>
              <Text style={styles.capacityLabelBen}>Beneficiarios:</Text>
              <Text style={styles.capacityValueBen}>{item.vacantes_beneficiarios ?? 0}</Text>
            </View>
          </View>

          {/* ACCIONES DE LA TARJETA */}
          <View style={styles.cardFooterActions}>
            <Text style={styles.viewDetailLink}>Ver detalle completo →</Text>

            {onNavigateToEdit && eventId > 0 && (
              <Pressable
                style={styles.editQuickBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onNavigateToEdit(eventId);
                }}
                accessibilityRole="button"
                accessibilityLabel="Gestionar evento"
              >
                <Text style={styles.editQuickBtnText}>⚙️ Gestionar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  // Cabecera del FlatList (Identidad institucional + Botón HU013)
  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GIVE & GO • MÓDULO DE EVENTOS</Text>
        </View>
      </View>

      <Text style={styles.title}>Catálogo de Eventos</Text>
      <Text style={styles.subtitle}>
        Explora las actividades solidarias, jornadas de voluntariado y comedores comunitarios disponibles.
      </Text>

      {/* BOTÓN HU013: CREAR NUEVO EVENTO */}
      <View style={styles.createActionCard}>
        <View style={styles.createActionHeader}>
          <Text style={styles.createActionTag}>HU013 • ORGANIZACIONES</Text>
          <Text style={styles.createActionTitle}>¿Representas una organización?</Text>
        </View>
        <Text style={styles.createActionText}>
          Publica una nueva jornada de apoyo social con vacantes para voluntarios y beneficiarios.
        </Text>
        <CustomButton
          title="+ Publicar nuevo evento"
          onPress={() => {
            if (onNavigateToCreate) onNavigateToCreate();
          }}
          variant="primary"
          style={styles.createBtn}
        />
      </View>

      {/* BARRA DE ESTADO DEL CATÁLOGO (HU017) */}
      <View style={styles.catalogStatusBar}>
        <Text style={styles.catalogCountText}>
          {events.length} {events.length === 1 ? 'evento disponible' : 'eventos disponibles'}
        </Text>
        <Pressable
          style={styles.refreshBadgeBtn}
          onPress={() => fetchEvents(true)}
          accessibilityRole="button"
          accessibilityLabel="Refrescar listado"
        >
          <Text style={styles.refreshBadgeText}>🔄 Actualizar</Text>
        </Pressable>
      </View>
    </View>
  );

  // Pie del FlatList (Resumen técnico)
  const renderListFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Módulos operativos</Text>
        <Text style={styles.infoItem}>• HU017: GET /api/events/ (Catálogo dinámico)</Text>
        <Text style={styles.infoItem}>• HU016: GET /api/events/:id (Detalle y ficha)</Text>
        <Text style={styles.infoItem}>• HU013: POST /api/events/ (Creación)</Text>
        <Text style={styles.infoItem}>• HU014 & HU015: PUT / DELETE /api/events/:id (Edición / Borrado)</Text>
      </View>
    </View>
  );

  // 1. Estado de carga inicial
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner message="Cargando catálogo de eventos..." />
      </View>
    );
  }

  // 2. Estado de error
  if (errorMessage && events.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <View style={styles.errorIconBadge}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
          <Text style={styles.errorCardTitle}>Error al cargar eventos</Text>
          <Text style={styles.errorCardMessage}>{errorMessage}</Text>
          <CustomButton
            title="Reintentar"
            onPress={() => fetchEvents()}
            variant="primary"
            style={styles.retryBtn}
          />
          {onNavigateToCreate && (
            <CustomButton
              title="+ Crear evento directamente"
              onPress={onNavigateToCreate}
              variant="outline"
              style={styles.createFallbackBtn}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      <FlatList
        data={events}
        keyExtractor={(item, index) =>
          item.id_evento ? item.id_evento.toString() : `event-${index}`
        }
        renderItem={renderEventItem}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={events.length > 0 ? renderListFooter : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBadge}>
              <Text style={styles.emptyIconText}>📅</Text>
            </View>
            <Text style={styles.emptyTitle}>Catálogo sin eventos</Text>
            <Text style={styles.emptySubtitle}>
              No se encontraron eventos comunitarios disponibles en este momento.
            </Text>
            {onNavigateToCreate && (
              <CustomButton
                title="+ Crear el primer evento"
                onPress={onNavigateToCreate}
                variant="primary"
                style={styles.emptyCreateBtn}
              />
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchEvents(true)}
            colors={['#DC2626']}
            tintColor="#DC2626"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  createActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  createActionHeader: {
    marginBottom: 4,
  },
  createActionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  createActionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  createActionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  createBtn: {
    width: '100%',
  },
  catalogStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  catalogCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  refreshBadgeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  refreshBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
  },
  cardPlaceholderIcon: {
    fontSize: 32,
    marginBottom: 2,
  },
  cardPlaceholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeCancelled: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  capacityRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
    gap: 6,
  },
  capacityBadgeTotal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  capacityBadgeVol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  capacityBadgeBen: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  capacityLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 4,
  },
  capacityValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  capacityLabelVol: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
  },
  capacityValueVol: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  capacityLabelBen: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
    marginRight: 4,
  },
  capacityValueBen: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B91C1C',
  },
  cardFooterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewDetailLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  editQuickBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  editQuickBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 3,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  emptyCreateBtn: {
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
  errorIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorIconText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#DC2626',
  },
  errorCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorCardMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryBtn: {
    width: '100%',
    marginBottom: 10,
  },
  createFallbackBtn: {
    width: '100%',
  },
});
