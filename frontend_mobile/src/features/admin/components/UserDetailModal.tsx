import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, Power, Edit3 } from 'lucide-react-native';
import { THEME } from '../../../config/theme';
import { AdminUserItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface UserDetailModalProps {
  visible: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onEdit?: (user: AdminUserItem) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
  onEdit,
}) => {
  if (!user) return null;

  const isActive = user.estado === 'activo' || user.estado === 1 || user.estado === '1';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.headerIcon}>
                <User size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Consulta de Usuario</Text>
                <Text style={styles.headerSubtitle}>ID: {user.id || user.id_usuario}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Profile Banner */}
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.nombre1?.charAt(0) || 'U'}
                  {user.apellido1?.charAt(0) || ''}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullName}>
                  {user.nombre1} {user.nombre2 ? user.nombre2 + ' ' : ''}
                  {user.apellido1} {user.apellido2 || ''}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.badgeText, { color: '#DC2626' }]}>
                      {user.rol}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isActive ? '#16A34A' : '#DC2626' },
                      ]}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Information Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>

              <View style={styles.infoRow}>
                <Mail size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Correo Electrónico</Text>
                  <Text style={styles.infoValue}>{user.correo || 'No especificado'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Phone size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Teléfono Móvil</Text>
                  <Text style={styles.infoValue}>{user.telefono || 'No especificado'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>UBICACIÓN GEOGRÁFICA</Text>

              <View style={styles.infoRow}>
                <MapPin size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Barrio y Dirección</Text>
                  <Text style={styles.infoValue}>
                    {user.barrio || 'Sin barrio'} {user.direccion ? `· ${user.direccion}` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Shield size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Localidad / Ciudad</Text>
                  <Text style={styles.infoValue}>
                    {user.localidad || 'Kennedy'}, {user.ciudad || 'Bogotá'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SISTEMA Y AUDITORÍA</Text>

              <View style={styles.infoRow}>
                <Calendar size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha de Registro</Text>
                  <Text style={styles.infoValue}>
                    {user.fecha_registro || user.fechaRegistro || 'Registro histórico'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {onEdit && (
              <AppButton
                title="Editar Usuario"
                variant="outline"
                onPress={() => {
                  onClose();
                  onEdit(user);
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
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
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
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
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
