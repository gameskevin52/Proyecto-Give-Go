import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminVerificationItem } from '../models/admin.models';

interface RespondVerificationModalProps {
  visible: boolean;
  item: AdminVerificationItem | null;
  onClose: () => void;
  onSubmit: (
    id: string,
    estado: 'aprobada' | 'rechazada',
    respuestaAdmin: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const RespondVerificationModal: React.FC<RespondVerificationModalProps> = ({
  visible,
  item,
  onClose,
  onSubmit,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<'aprobada' | 'rechazada'>('aprobada');
  const [respuestaAdmin, setRespuestaAdmin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (item) {
      setSelectedDecision(item.estado === 'rechazada' ? 'rechazada' : 'aprobada');
      setRespuestaAdmin(item.respuestaAdmin || '');
      setErrorMessage('');
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!item) return;
    setErrorMessage('');

    if (!respuestaAdmin.trim()) {
      setErrorMessage('Por favor ingresa una observación o motivo para la resolución.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit(item.id, selectedDecision, respuestaAdmin.trim());
      if (res.success) {
        Alert.alert(
          'Resolución Aplicada',
          `La solicitud ha sido marcada como "${selectedDecision === 'aprobada' ? 'Aprobada' : 'Rechazada'}".`
        );
        onClose();
      } else {
        setErrorMessage(res.message || 'No se pudo registrar la resolución.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

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
                <Text style={styles.headerTitle}>Resolución de Verificación</Text>
                <Text style={styles.headerSubtitle}>
                  {item.nombreOrganizacion} · NIT {item.nit}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {/* Decision selector */}
            <Text style={styles.sectionTitle}>DECISIÓN ADMINISTRATIVA</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedDecision('aprobada')}
                style={[
                  styles.decisionCard,
                  selectedDecision === 'aprobada' && styles.decisionCardApproved,
                ]}
              >
                <CheckCircle2
                  size={20}
                  color={selectedDecision === 'aprobada' ? '#16A34A' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.decisionText,
                    selectedDecision === 'aprobada' && { color: '#16A34A', fontWeight: '800' },
                  ]}
                >
                  Aprobar Solicitud
                </Text>
                <Text style={styles.decisionSub}>
                  Concede el sello verificado oficial a la ONG.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedDecision('rechazada')}
                style={[
                  styles.decisionCard,
                  selectedDecision === 'rechazada' && styles.decisionCardRejected,
                ]}
              >
                <XCircle
                  size={20}
                  color={selectedDecision === 'rechazada' ? '#DC2626' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.decisionText,
                    selectedDecision === 'rechazada' && { color: '#DC2626', fontWeight: '800' },
                  ]}
                >
                  Rechazar Solicitud
                </Text>
                <Text style={styles.decisionSub}>
                  Requiere subsanación o documentación adicional.
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>MOTIVO / OBSERVACIONES OFICIALES *</Text>
            <AppInput
              label="Respuesta Oficial del Administrador *"
              value={respuestaAdmin}
              onChangeText={setRespuestaAdmin}
              placeholder={
                selectedDecision === 'aprobada'
                  ? 'Ej. Se validaron los documentos de Cámara de Comercio y RUT a satisfacción.'
                  : 'Ej. El documento RUT adjunto está vencido. Favor adjuntar versión vigente.'
              }
              multiline
              numberOfLines={4}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <AppButton
              title={selectedDecision === 'aprobada' ? 'Aprobar ONG' : 'Rechazar Solicitud'}
              variant="primary"
              loading={isLoading}
              onPress={handleSubmit}
              style={{
                flex: 1,
                backgroundColor: selectedDecision === 'aprobada' ? '#16A34A' : '#DC2626',
              }}
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
    width: 36,
    height: 36,
    borderRadius: 10,
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
    fontSize: 11,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  decisionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    textAlign: 'center',
  },
  decisionCardApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  decisionCardRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  decisionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  decisionSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
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
