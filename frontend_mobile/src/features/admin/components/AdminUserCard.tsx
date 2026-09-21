import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../../../config/theme';
import { AdminUserItem } from '../models/admin.models';
import { Phone, MapPin, CheckCircle, XCircle, Trash2, Power, Edit3, Eye } from 'lucide-react-native';

interface AdminUserCardProps {
  user: AdminUserItem;
  onToggleStatus?: (user: AdminUserItem) => void;
  onDelete?: (userId: string | number) => void;
  onEdit?: (user: AdminUserItem) => void;
  onConsult?: (user: AdminUserItem) => void;
  onPress?: (user: AdminUserItem) => void;
}

const getRoleConfig = (rol: string) => {
  const r = rol.toLowerCase();
  if (r.includes('admin')) {
    return { bg: '#FEE2E2', text: '#DC2626', label: 'Administrador' };
  }
  if (r.includes('org')) {
    return { bg: '#DBEAFE', text: '#2563EB', label: 'Organización' };
  }
  if (r.includes('benef')) {
    return { bg: '#FEF3C7', text: '#D97706', label: 'Beneficiario' };
  }
  return { bg: '#DCFCE7', text: '#16A34A', label: 'Voluntario' };
};

export const AdminUserCard: React.FC<AdminUserCardProps> = ({
  user,
  onToggleStatus,
  onDelete,
  onEdit,
  onConsult,
  onPress,
}) => {
  const roleConfig = getRoleConfig(user.rol);
  const isActive = user.estado === 'activo' || user.estado === 1 || user.estado === '1';

  const initials = `${user.nombre1 ? user.nombre1.charAt(0) : 'U'}${
    user.apellido1 ? user.apellido1.charAt(0) : ''
  }`.toUpperCase();

  const handleCardPress = () => {
    if (onConsult) onConsult(user);
    else if (onPress) onPress(user);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleCardPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: roleConfig.bg }]}>
            <Text style={[styles.avatarText, { color: roleConfig.text }]}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {user.nombre1} {user.nombre2 || ''} {user.apellido1} {user.apellido2 || ''}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.correo}
            </Text>
          </View>
        </View>

        <View style={styles.badgeGroup}>
          <View style={[styles.badge, { backgroundColor: roleConfig.bg }]}>
            <Text style={[styles.badgeText, { color: roleConfig.text }]}>
              {roleConfig.label}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isActive ? '#16A34A' : '#DC2626' },
              ]}
            >
              {isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        {user.telefono ? (
          <View style={styles.metaItem}>
            <Phone size={12} color="#64748B" />
            <Text style={styles.metaText}>{user.telefono}</Text>
          </View>
        ) : null}
        {user.barrio ? (
          <View style={styles.metaItem}>
            <MapPin size={12} color="#64748B" />
            <Text style={styles.metaText}>{user.barrio}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        {onConsult && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onConsult(user)}
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
            onPress={() => onEdit(user)}
            style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}
          >
            <Edit3 size={13} color="#2563EB" />
            <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>
              Editar
            </Text>
          </TouchableOpacity>
        )}

        {onToggleStatus && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggleStatus(user)}
            style={[
              styles.actionBtn,
              { backgroundColor: isActive ? '#FEF2F2' : '#F0FDF4' },
            ]}
          >
            <Power size={13} color={isActive ? '#DC2626' : '#16A34A'} />
            <Text
              style={[
                styles.actionBtnText,
                { color: isActive ? '#DC2626' : '#16A34A' },
              ]}
            >
              {isActive ? 'Desactivar' : 'Activar'}
            </Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(user.id)}
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
    backgroundColor: THEME.colors.surface || '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border || '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.text || '#0F172A',
  },
  email: {
    fontSize: 12,
    color: THEME.colors.textMuted || '#64748B',
    marginTop: 1,
  },
  badgeGroup: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});


export default AdminUserCard;
