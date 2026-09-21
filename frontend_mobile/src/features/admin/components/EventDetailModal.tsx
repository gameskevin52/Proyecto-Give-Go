import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Building2,
  Tag,
  Compass,
} from 'lucide-react-native';
import { AdminEventItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface EventDetailModalProps {
  visible: boolean;
  event: AdminEventItem | null;
  onClose: () => void;
  onEdit?: (event: AdminEventItem) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  event,
  onClose,
  onEdit,
}) => {
  if (!event) return null;

  const isActivo = event.estado === 'activo';
  const formattedDate = event.fecha
    ? new Date(event.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'No definida';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.headerIcon}>
                <Calendar size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Consulta de Evento</Text>
                <Text style={styles.headerSubtitle}>ID: {event.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Main title banner */}
            <View style={styles.banner}>
              <Text style={styles.eventTitle}>{event.nombre}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <View style={styles.categoryPill}>
                  <Tag size={12} color="#DC2626" />
                  <Text style={styles.categoryText}>{event.categoria || 'Social'}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isActivo ? '#DCFCE7' : '#F1F5F9' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isActivo ? '#16A34A' : '#64748B' },
                    ]}
                  >
                    {isActivo ? 'Activo' : event.estado}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>OBJETIVO Y DESCRIPCIÓN</Text>
              <Text style={styles.descText}>
                {event.descripcion || 'Sin descripción disponible.'}
              </Text>
            </View>

            {/* Time & Capacity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FECHA Y CUPOS</Text>

              <View style={styles.infoRow}>
                <Calendar size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha Programada</Text>
                  <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Users size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Cupo Máximo de Voluntarios</Text>
                  <Text style={styles.infoValue}>
                    {event.cupo ? `${event.cupo} personas` : 'Ilimitado'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location & Organization */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>UBICACIÓN Y ORGANIZACIÓN</Text>

              <View style={styles.infoRow}>
                <Building2 size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organización Anfitriona</Text>
                  <Text style={styles.infoValue}>
                    {event.nombreOrganizacion || `ID: ${event.organizacionId || 'Central'}`}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Punto de Encuentro</Text>
                  <Text style={styles.infoValue}>
                    {event.direccion || 'Kennedy Central'} · {event.barrio || 'Kennedy'}
                  </Text>
                </View>
              </View>

              {event.latitud && event.longitud ? (
                <View style={styles.infoRow}>
                  <Compass size={16} color="#64748B" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Coordenadas GPS</Text>
                    <Text style={styles.infoValue}>
                      {event.latitud}, {event.longitud}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {onEdit && (
              <AppButton
                title="Editar Evento"
                variant="outline"
                onPress={() => {
                  onClose();
                  onEdit(event);
                }}
                style={{ flex: 1 }}
              />
            )}
            <AppButton
              title="Cerrar"
              variant="primary"
              onPress={onClose}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  banner: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  descText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
