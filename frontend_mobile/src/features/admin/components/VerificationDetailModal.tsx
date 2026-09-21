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
  ShieldCheck,
  Building2,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react-native';
import { AdminVerificationItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface VerificationDetailModalProps {
  visible: boolean;
  item: AdminVerificationItem | null;
  onClose: () => void;
  onRespond?: (item: AdminVerificationItem) => void;
}

export const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({
  visible,
  item,
  onClose,
  onRespond,
}) => {
  if (!item) return null;

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
          label: 'Pendiente de Revisión',
          icon: Clock,
        };
    }
  };

  const badge = getStatusBadge();
  const IconBadge = badge.icon;

  const formattedDate = item.fechaSolicitud
    ? new Date(item.fechaSolicitud).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'No registrada';

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
                <ShieldCheck size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Consulta de Solicitud</Text>
                <Text style={styles.headerSubtitle}>Expediente ID: {item.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Status card */}
            <View style={styles.statusBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orgName}>{item.nombreOrganizacion || 'Organización'}</Text>
                <Text style={styles.nitText}>NIT Institucional: {item.nit || 'Sin NIT'}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <IconBadge size={14} color={badge.text} style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
            </View>

            {/* Solicitud info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DETALLES DE LA RADICACIÓN</Text>

              <View style={styles.infoRow}>
                <Calendar size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha de Radicación</Text>
                  <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <FileText size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Documentos Adjuntos</Text>
                  <Text style={styles.infoValue}>{item.documentos || 'RUT y Certificado Cámara de Comercio'}</Text>
                </View>
              </View>
            </View>

            {/* Justification message */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>JUSTIFICACIÓN / MENSAJE DE LA ONG</Text>
              <Text style={styles.messageBox}>
                {item.mensaje || 'No se adjuntó mensaje adicional.'}
              </Text>
            </View>

            {/* Admin Response */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RESOLUCIÓN Y RESPUESTA DEL ADMINISTRADOR</Text>
              <View style={styles.adminRespBox}>
                <MessageSquare size={16} color="#DC2626" style={{ marginTop: 2 }} />
                <Text style={styles.adminRespText}>
                  {item.respuestaAdmin || 'Esta solicitud aún no ha sido resuelta por el equipo administrativo.'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {onRespond && (
              <AppButton
                title={item.estado === 'pendiente' ? 'Resolver Solicitud' : 'Modificar Resolución'}
                variant="primary"
                onPress={() => {
                  onClose();
                  onRespond(item);
                }}
                style={{ flex: 1 }}
              />
            )}
            <AppButton
              title="Cerrar"
              variant="outline"
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
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  nitText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
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
  messageBox: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
  },
  adminRespBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  adminRespText: {
    flex: 1,
    fontSize: 13,
    color: '#9F1239',
    lineHeight: 18,
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
