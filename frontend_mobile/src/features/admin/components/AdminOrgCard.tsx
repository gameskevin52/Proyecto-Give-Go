import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../../../config/theme';
import { AdminOrgItem } from '../models/admin.models';
import { Building2, MapPin, Mail, Phone, CheckCircle, Clock, XCircle, Trash2, Edit3, Eye } from 'lucide-react-native';

interface AdminOrgCardProps {
  organization: AdminOrgItem;
  onEdit?: (org: AdminOrgItem) => void;
  onDelete?: (orgId: string) => void;
  onConsult?: (org: AdminOrgItem) => void;
}

export const AdminOrgCard: React.FC<AdminOrgCardProps> = ({
  organization,
  onEdit,
  onDelete,
  onConsult,
}) => {
  const isVerified = Boolean(organization.verificada);
  const estadoVerif = organization.estadoVerificacion || (isVerified ? 'aprobada' : 'no_solicitado');

  const getVerificationBadge = () => {
    if (isVerified || estadoVerif === 'aprobada') {
      return {
        bg: '#DCFCE7',
        text: '#16A34A',
        label: 'Verificada',
        icon: CheckCircle,
      };
    }
    if (estadoVerif === 'pendiente') {
      return {
        bg: '#FEF3C7',
        text: '#D97706',
        label: 'Verif. Pendiente',
        icon: Clock,
      };
    }
    return {
      bg: '#F1F5F9',
      text: '#64748B',
      label: 'Sin Verificar',
      icon: XCircle,
    };
  };

  const badge = getVerificationBadge();
  const IconBadge = badge.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onConsult && onConsult(organization)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Building2 size={20} color="#2563EB" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.orgName} numberOfLines={1}>
              {organization.nombre}
            </Text>
            <Text style={styles.orgId}>ID: {organization.id}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <IconBadge size={12} color={badge.text} style={{ marginRight: 4 }} />
          <Text style={[styles.statusText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <Mail size={13} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {organization.correo || 'Sin correo registrado'}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <MapPin size={13} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {organization.direccion || 'Kennedy Central'}
          </Text>
        </View>
        {organization.telefono ? (
          <View style={styles.metaRow}>
            <Phone size={13} color="#64748B" />
            <Text style={styles.metaText} numberOfLines={1}>
              {organization.telefono}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        {onConsult && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onConsult(organization)}
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
            onPress={() => onEdit(organization)}
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
            onPress={() => onDelete(organization.id)}
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
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  orgId: {
    fontSize: 11,
    color: '#94A3B8',
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
  metaContainer: {
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
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
