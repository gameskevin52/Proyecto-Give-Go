import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminVerificationItem } from '../models/admin.models';
import { ShieldCheck, Clock, CheckCircle2, XCircle, FileText, Trash2, Edit3, Eye } from 'lucide-react-native';

interface AdminVerificationCardProps {
  item: AdminVerificationItem;
  onRespond?: (item: AdminVerificationItem) => void;
  onConsult?: (item: AdminVerificationItem) => void;
  onDelete?: (id: string) => void;
}

export const AdminVerificationCard: React.FC<AdminVerificationCardProps> = ({
  item,
  onRespond,
  onConsult,
  onDelete,
}) => {
  const getStatusBadge = () => {
    switch (item.estado) {
      case 'aprobada':
        return {
          bg: '#DCFCE7',
          text: '#16A34A',
          label: 'Aprobada',
          icon: CheckCircle2,
        };
      case 'rechazada':
        return {
          bg: '#FEE2E2',
          text: '#DC2626',
          label: 'Rechazada',
          icon: XCircle,
        };
      default:
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          label: 'Pendiente',
          icon: Clock,
        };
    }
  };

  const badge = getStatusBadge();
  const IconBadge = badge.icon;

  const formattedDate = item.fechaSolicitud
    ? new Date(item.fechaSolicitud).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Reciente';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onConsult && onConsult(item)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <ShieldCheck size={20} color="#DC2626" />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.orgName} numberOfLines={1}>
              {item.nombreOrganizacion || 'Organización'}
            </Text>
            <Text style={styles.nitText}>NIT: {item.nit || 'Sin NIT'}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <IconBadge size={12} color={badge.text} style={{ marginRight: 4 }} />
          <Text style={[styles.statusText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {item.mensaje ? (
        <Text style={styles.messageText} numberOfLines={2}>
          "{item.mensaje}"
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <View style={styles.docInfo}>
          <FileText size={12} color="#64748B" />
          <Text style={styles.docText} numberOfLines={1}>
            {item.documentos || 'RUT / Cámara de Comercio'}
          </Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.actionsRow}>
        {onConsult && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onConsult(item)}
            style={[styles.actionBtn, { backgroundColor: '#F8FAFC' }]}
          >
            <Eye size={13} color="#475569" />
            <Text style={[styles.actionBtnText, { color: '#475569' }]}>
              Consultar
            </Text>
          </TouchableOpacity>
        )}

        {onRespond && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onRespond(item)}
            style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}
          >
            <Edit3 size={13} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>
              {item.estado === 'pendiente' ? 'Resolver' : 'Actualizar'}
            </Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(item.id)}
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
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  nitText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  docText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    marginTop: 4,
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
