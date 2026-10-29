import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminEventItem } from '../models/admin.models';
import { Calendar, MapPin, Users, Building2, Tag, Trash2, Edit3, Eye, CheckCircle2 } from 'lucide-react-native';

interface AdminEventCardProps {
  event: AdminEventItem;
  onEdit?: (event: AdminEventItem) => void;
  onDelete?: (eventId: string | number) => void;
  onConsult?: (event: AdminEventItem) => void;
}

export const AdminEventCard: React.FC<AdminEventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onConsult,
}) => {
  const isActivo = event.estado === 'activo';

  const formattedDate = event.fecha
    ? new Date(event.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Fecha por definir';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onConsult && onConsult(event)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Calendar size={20} color="#DC2626" />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={1}>
              {event.nombre}
            </Text>
            <View style={styles.categoryPill}>
              <Tag size={10} color="#DC2626" />
              <Text style={styles.categoryText}>{event.categoria || 'Comunitario'}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActivo ? '#DCFCE7' : '#F1F5F9' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isActivo ? '#16A34A' : '#64748B' },
            ]}
          >
            {isActivo ? 'Activo' : event.estado || 'Finalizado'}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {event.descripcion || 'Sin descripción detallada.'}
      </Text>

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <Calendar size={13} color="#64748B" />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>

        <View style={styles.metaRow}>
          <MapPin size={13} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.direccion || 'Kennedy Central'} {event.barrio ? `· ${event.barrio}` : ''}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.metaRow}>
            <Building2 size={13} color="#64748B" />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.nombreOrganizacion || `Org ID: ${event.organizacionId || 'Central'}`}
            </Text>
          </View>

          {event.cupo ? (
            <View style={styles.metaRow}>
              <Users size={13} color="#64748B" />
              <Text style={styles.metaText}>Cupo: {event.cupo}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.actionsRow}>
        {onConsult && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onConsult(event)}
            style={[styles.actionBtn, { backgroundColor: '#F8FAFC' }]}
          >
            <Eye size={13} color="#475569" />
            <Text style={[styles.actionBtnText, { color: '#475569' }]}>
              Consultar
            </Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onEdit(event)}
            style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}
          >
            <Edit3 size={13} color="#2563EB" />
            <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>
              Editar
            </Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(event.id)}
            style={[styles.actionBtn, { backgroundColor: '#FFF1F2' }]}
          >
            <Trash2 size={13} color="#E11D48" />
            <Text style={[styles.actionBtnText, { color: '#E11D48' }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 8,
  },
  metaContainer: {
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
