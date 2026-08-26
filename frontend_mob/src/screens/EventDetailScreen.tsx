/**
 * HU016 — Pantalla de Detalle de un Evento (Give & Go Mobile)
 * Consulta GET /api/events/:id y muestra la ficha técnica completa con diseño nativo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CustomButton } from '../components/common/CustomButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getEventById } from '../services/eventService';
import { Evento } from '../types/event.types';

// Mapeo de nombres de categorías oficiales
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

interface EventDetailScreenProps {
  eventId: string;
  onBack?: () => void;
  onNavigateToEdit?: (id: string) => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onBack,
  onNavigateToEdit,
}) => {
  const [event, setEvent] = useState<Evento | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchEventDetail = async () => {
    setIsLoading(true);
    setNotFound(false);
    setErrorMessage(null);

    try {
      const response = await getEventById(eventId);
      const data: Evento = (response?.data || response) as Evento;

      if (!data || (!data.id_evento && !data.nombre)) {
        setNotFound(true);
        setErrorMessage('El evento no existe o ya fue eliminado.');
      } else {
        setEvent(data);
      }
    } catch (err: any) {
      if (err?.message && (err.message.includes('404') || err.message.toLowerCase().includes('no encontrado'))) {
        setNotFound(true);
        setErrorMessage('El evento no existe o ya fue eliminado.');
      } else {
        setErrorMessage(
          err?.message ||
            'No fue posible conectar con el servidor. Verifica que el backend esté en ejecución y que la URL/IP configurada sea accesible desde el dispositivo.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetail();
    } else {
      setIsLoading(false);
      setNotFound(true);
      setErrorMessage('Identificador de evento inválido.');
    }
  }, [eventId]);

  // Formateo de fecha y hora para visualización humana
  const formatDateTime = (rawFecha?: string) => {
    if (!rawFecha) return { dateStr: 'Por definir', timeStr: 'Por definir' };
    const cleanFecha = rawFecha.replace('T', ' ');
    const parts = cleanFecha.split(' ');
    const dateStr = parts[0] || rawFecha;
    const timeStr = parts[1] ? parts[1].substring(0, 5) : '08:00';
    return { dateStr, timeStr };
  };

  // 1. Estado de carga inicial
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner message={`Cargando detalles del evento #${eventId}...`} />
      </View>
    );
  }

  // 2. Estado de error o evento no encontrado (404 / conexión)
  if (notFound || errorMessage || !event) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <View style={styles.errorIconBadge}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
          <Text style={styles.errorCardTitle}>
            {notFound ? 'Evento no encontrado' : 'Error de consulta'}
          </Text>
          <Text style={styles.errorCardMessage}>
            {errorMessage || 'El evento no existe o ya fue eliminado.'}
          </Text>

          <View style={styles.errorActionRow}>
            {!notFound && (
              <CustomButton
                title="Reintentar"
                onPress={fetchEventDetail}
                variant="primary"
                style={styles.retryBtn}
              />
            )}
            {onBack && (
              <CustomButton
                title="← Volver al panel"
                onPress={onBack}
                variant={notFound ? 'primary' : 'outline'}
                style={styles.backFullBtn}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  const { dateStr, timeStr } = formatDateTime(event.fecha);
  const categoryName =
    event.categoria_nombre ||
    CATEGORY_NAMES[event.id_categoria] ||
    `Categoría #${event.id_categoria}`;

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* BOTÓN SUPERIOR VOLVER */}
        <View style={styles.topNav}>
          {onBack && (
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Volver al panel"
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </Pressable>
          )}
          <View style={styles.badgeGroup}>
            <Text style={styles.idBadge}>ID #{event.id_evento || eventId}</Text>
            <Text style={[styles.statusBadge, event.estado === 'cancelado' && styles.statusBadgeCancelled]}>
              {event.estado ? event.estado.toUpperCase() : 'ACTIVO'}
            </Text>
          </View>
        </View>

        {/* IMAGEN DEL EVENTO (Si existe) */}
        {event.imagen && event.imagen.trim().length > 0 ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: event.imagen }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* ENCABEZADO PRINCIPAL */}
        <View style={styles.headerCard}>
          <Text style={styles.categoryLabel}>{categoryName}</Text>
          <Text style={styles.eventTitle}>{event.nombre}</Text>

          {event.organizacion_nombre ? (
            <Text style={styles.orgName}>Organizado por: {event.organizacion_nombre}</Text>
          ) : (
            <Text style={styles.orgName}>Organización responsable: ID #{event.organizacion_id}</Text>
          )}
        </View>

        {/* TARJETA DE FECHA Y HORARIO */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>📅 Fecha y Horario</Text>
          <View style={styles.dateTimeGrid}>
            <View style={styles.dateTimeCol}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValueHighlight}>{dateStr}</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.dateTimeCol}>
              <Text style={styles.infoLabel}>Hora programada</Text>
              <Text style={styles.infoValueHighlight}>{timeStr}</Text>
            </View>
          </View>
        </View>

        {/* TARJETA DE CUPOS Y DISPONIBILIDAD */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>👥 Capacidad y Vacantes</Text>
          <View style={styles.capacityGrid}>
            <View style={styles.capacityBoxTotal}>
              <Text style={styles.capacityNumber}>{event.cupo}</Text>
              <Text style={styles.capacityLabel}>Cupo Total</Text>
            </View>
            <View style={styles.capacityBoxVol}>
              <Text style={styles.capacityNumberVol}>{event.vacantes_voluntarios}</Text>
              <Text style={styles.capacityLabel}>Voluntarios</Text>
            </View>
            <View style={styles.capacityBoxBen}>
              <Text style={styles.capacityNumberBen}>{event.vacantes_beneficiarios}</Text>
              <Text style={styles.capacityLabel}>Beneficiarios</Text>
            </View>
          </View>
        </View>

        {/* TARJETA DE DESCRIPCIÓN */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>📋 Misión y Descripción</Text>
          <Text style={styles.paragraphText}>{event.descripcion}</Text>
        </View>

        {/* TARJETA DE AYUDA OFRECIDA */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>🎁 Ayuda y Recursos Ofrecidos</Text>
          <View style={styles.highlightTextBox}>
            <Text style={styles.highlightTextContent}>{event.ayuda_ofrecida}</Text>
          </View>
        </View>

        {/* TARJETA DE UBICACIÓN */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>📍 Ubicación del Evento</Text>

          <View style={styles.locationItem}>
            <Text style={styles.infoLabel}>Dirección principal</Text>
            <Text style={styles.infoValueBold}>{event.direccion}</Text>
          </View>

          {event.nombre_lugar ? (
            <View style={styles.locationItem}>
              <Text style={styles.infoLabel}>Nombre del recinto / lugar</Text>
              <Text style={styles.infoValue}>{event.nombre_lugar}</Text>
            </View>
          ) : null}

          <View style={styles.locationGrid}>
            {event.ciudad ? (
              <View style={styles.locationGridCol}>
                <Text style={styles.infoLabel}>Ciudad</Text>
                <Text style={styles.infoValue}>{event.ciudad}</Text>
              </View>
            ) : null}

            {event.barrio || event.localidad ? (
              <View style={styles.locationGridCol}>
                <Text style={styles.infoLabel}>Barrio / Localidad</Text>
                <Text style={styles.infoValue}>{event.barrio || event.localidad}</Text>
              </View>
            ) : null}
          </View>

          {event.punto_referencia ? (
            <View style={styles.locationItem}>
              <Text style={styles.infoLabel}>Punto de referencia</Text>
              <Text style={styles.infoValueItalic}>"{event.punto_referencia}"</Text>
            </View>
          ) : null}
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.actionsContainer}>
          {onNavigateToEdit && (
            <CustomButton
              title="✏️ Editar este evento"
              onPress={() => onNavigateToEdit(event.id_evento || eventId)}
              variant="primary"
              style={styles.actionBtn}
            />
          )}

          {onBack && (
            <CustomButton
              title="← Volver al listado"
              onPress={onBack}
              variant="outline"
              style={styles.actionBtnSecondary}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  statusBadgeCancelled: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  imageContainer: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 8,
  },
  orgName: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  dateTimeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeCol: {
    flex: 1,
  },
  dividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  infoValueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoValue: {
    fontSize: 14,
    color: '#334155',
  },
  infoValueItalic: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
  },
  capacityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityBoxTotal: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  capacityBoxVol: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  capacityBoxBen: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  capacityNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  capacityNumberVol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
  },
  capacityNumberBen: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DC2626',
  },
  capacityLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  paragraphText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  highlightTextBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  highlightTextContent: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
    fontWeight: '500',
  },
  locationItem: {
    marginBottom: 10,
  },
  locationGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationGridCol: {
    flex: 1,
    marginRight: 8,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionBtn: {
    marginBottom: 10,
  },
  actionBtnSecondary: {
    marginBottom: 10,
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
  errorActionRow: {
    width: '100%',
  },
  retryBtn: {
    width: '100%',
    marginBottom: 10,
  },
  backFullBtn: {
    width: '100%',
  },
});
