import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, Building2, Mail, Phone, MapPin, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react-native';
import { AdminOrgItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface OrgDetailModalProps {
  visible: boolean;
  org: AdminOrgItem | null;
  onClose: () => void;
  onEdit?: (org: AdminOrgItem) => void;
}

export const OrgDetailModal: React.FC<OrgDetailModalProps> = ({
  visible,
  org,
  onClose,
  onEdit,
}) => {
  if (!org) return null;

  const isVerified = Boolean(org.verificada);
  const estadoVerif = org.estadoVerificacion || (isVerified ? 'aprobada' : 'no_solicitado');

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
                <Building2 size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Consulta de Organización</Text>
                <Text style={styles.headerSubtitle}>ID: {org.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Banner */}
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                <Building2 size={28} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.orgName}>{org.nombre}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: isVerified ? '#DCFCE7' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isVerified ? '#16A34A' : '#D97706' },
                      ]}
                    >
                      {isVerified ? '✓ Organización Verificada' : '⏳ Verificación Pendiente / No solicitada'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* General Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN LEGAL Y TRIBUTARIA</Text>

              <View style={styles.infoRow}>
                <ShieldCheck size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>NIT Institucional</Text>
                  <Text style={styles.infoValue}>{org.nit || 'Sin NIT registrado'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Building2 size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Razón Social</Text>
                  <Text style={styles.infoValue}>{org.nombre}</Text>
                </View>
              </View>
            </View>

            {/* Contact & Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTACTO Y SEDE SOCIAL</Text>

              <View style={styles.infoRow}>
                <Mail size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Correo Electrónico</Text>
                  <Text style={styles.infoValue}>{org.correo || 'No especificado'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Phone size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Teléfono Institucional</Text>
                  <Text style={styles.infoValue}>{org.telefono || 'No especificado'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Dirección de la Sede</Text>
                  <Text style={styles.infoValue}>
                    {org.direccion || 'Kennedy Central'} · Localidad {org.localidad || 'Kennedy'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {onEdit && (
              <AppButton
                title="Editar Organización"
                variant="outline"
                onPress={() => {
                  onClose();
                  onEdit(org);
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
    backgroundColor: '#EFF6FF',
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
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgName: {
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
