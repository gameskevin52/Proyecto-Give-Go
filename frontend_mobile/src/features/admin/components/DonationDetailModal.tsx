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
  Heart,
  DollarSign,
  Package,
  Building2,
  User,
  Calendar,
  Download,
  ShieldCheck,
} from 'lucide-react-native';
import { AdminDonationItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { downloadDonationReceipt } from '../utils/donationReceipt';

interface DonationDetailModalProps {
  visible: boolean;
  donation: AdminDonationItem | null;
  onClose: () => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  visible,
  donation,
  onClose,
}) => {
  if (!donation) return null;

  const isMonetary = donation.tipo === 'monetaria';
  const formattedDate = donation.fecha
    ? new Date(donation.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'No registrada';

  const amountOrQty = isMonetary
    ? `$${Number(donation.monetaria?.valor || 0).toLocaleString('es-CO')} COP`
    : `${donation.objeto?.cantidad || 1} unidades`;

  const handleDownload = () => {
    downloadDonationReceipt(donation);
  };

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
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: isMonetary ? '#DCFCE7' : '#EFF6FF' },
                ]}
              >
                {isMonetary ? (
                  <DollarSign size={20} color="#16A34A" />
                ) : (
                  <Package size={20} color="#2563EB" />
                )}
              </View>
              <View>
                <Text style={styles.headerTitle}>Consulta de Donación</Text>
                <Text style={styles.headerSubtitle}>Registro Oficial #{donation.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Banner summary */}
            <View style={styles.banner}>
              <Text style={styles.bannerLabel}>
                {isMonetary ? 'MONTO APORTADO' : 'CANTIDAD EN ESPECIE'}
              </Text>
              <Text style={styles.bannerAmount}>{amountOrQty}</Text>

              <View style={styles.verifiedRow}>
                <ShieldCheck size={14} color="#16A34A" />
                <Text style={styles.verifiedText}>
                  Aportación certificada e inmutable en el libro contable
                </Text>
              </View>
            </View>

            {/* Donor & Destination */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PARTES INVOLUCRADAS</Text>

              <View style={styles.infoRow}>
                <User size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Donante Registrado</Text>
                  <Text style={styles.infoValue}>
                    {donation.usuarioNombre || 'Donante Solidario Anónimo'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Building2 size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organización Destinataria</Text>
                  <Text style={styles.infoValue}>
                    {donation.organizacionNombre || `ID: ${donation.organizacionId}`}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Calendar size={16} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha de Transacción</Text>
                  <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Specific Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DETALLES DEL REGISTRO</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Causa Comunitaria:</Text>
                <Text style={styles.detailVal}>{donation.categoria || 'Social'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Modalidad:</Text>
                <Text style={styles.detailVal}>
                  {isMonetary ? 'Monetaria / Transferencia' : 'Insumos en Especie'}
                </Text>
              </View>

              {isMonetary ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Método de Pago:</Text>
                    <Text style={styles.detailVal}>
                      {(donation.monetaria?.metodo || 'TARJETA').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Cuenta / Ref:</Text>
                    <Text style={styles.detailVal}>
                      {donation.monetaria?.cuenta || 'N/A'}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Tipo de Insumo:</Text>
                    <Text style={styles.detailVal}>
                      {donation.objeto?.categoria || 'General'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Descripción:</Text>
                    <Text style={styles.detailVal}>
                      {donation.objeto?.descripcion || 'Sin observaciones'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {/* Footer with Comprobante Download */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDownload}
              style={styles.downloadBtn}
            >
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Descargar Comprobante PDF</Text>
            </TouchableOpacity>

            <AppButton
              title="Cerrar"
              variant="outline"
              onPress={onClose}
              style={{ marginTop: 8 }}
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
    alignItems: 'center',
  },
  bannerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  bannerAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 11,
    color: '#16A34A',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailKey: {
    fontSize: 12,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 12,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
