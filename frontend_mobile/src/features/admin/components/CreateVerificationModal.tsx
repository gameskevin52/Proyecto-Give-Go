import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, ShieldPlus, Building2 } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminOrgItem } from '../models/admin.models';

interface CreateVerificationModalProps {
  visible: boolean;
  organizations: AdminOrgItem[];
  onClose: () => void;
  onSubmit: (payload: {
    organizacionId: string;
    nit?: string;
    mensaje?: string;
    documentos?: string;
  }) => Promise<{ success: boolean; message?: string; data?: any }>;
}

export const CreateVerificationModal: React.FC<CreateVerificationModalProps> = ({
  visible,
  organizations,
  onClose,
  onSubmit,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [nit, setNit] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [documentos, setDocumentos] = useState('RUT_2026.pdf, CamaraComercio_Vigente.pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setSelectedOrgId('');
    setNit('');
    setMensaje('');
    setDocumentos('RUT_2026.pdf, CamaraComercio_Vigente.pdf');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectOrg = (org: AdminOrgItem) => {
    setSelectedOrgId(org.id);
    if (org.nit) setNit(org.nit);
    if (!mensaje) {
      setMensaje(`Solicitud formal de verificación y validación legal para ${org.nombre}.`);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!selectedOrgId) {
      setErrorMessage('Debes seleccionar la organización solicitante.');
      return;
    }
    if (!nit.trim()) {
      setErrorMessage('El NIT institucional es obligatorio.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit({
        organizacionId: selectedOrgId,
        nit: nit.trim(),
        mensaje: mensaje.trim() || undefined,
        documentos: documentos.trim() || undefined,
      });

      if (res.success) {
        Alert.alert('Éxito', 'Solicitud de verificación radicada correctamente.');
        handleClose();
      } else {
        setErrorMessage(res.message || 'No se pudo radicar la solicitud.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.headerIcon}>
                <ShieldPlus size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Radicar Verificación</Text>
                <Text style={styles.headerSubtitle}>
                  Crear expediente de validación jurídica
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>ORGANIZACIÓN SOLICITANTE *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 10 }}
            >
              {organizations.map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                  <TouchableOpacity
                    key={org.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectOrg(org)}
                    style={[
                      styles.orgChip,
                      isSelected && styles.orgChipActive,
                    ]}
                  >
                    <Building2
                      size={14}
                      color={isSelected ? '#DC2626' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.orgChipText,
                        isSelected && styles.orgChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {org.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              DOCUMENTACIÓN Y EXPEDIENTE
            </Text>

            <AppInput
              label="NIT de la Organización *"
              value={nit}
              onChangeText={setNit}
              placeholder="Ej. 900.890.123-4"
            />

            <AppInput
              label="Archivos / Documentos Adjuntos"
              value={documentos}
              onChangeText={setDocumentos}
              placeholder="RUT_2026.pdf, Camara_Comercio.pdf"
            />

            <AppInput
              label="Justificación o Mensaje Institucional"
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Describa la labor comunitaria y respaldo legal..."
              multiline
              numberOfLines={3}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={handleClose}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Radicar Solicitud"
              variant="primary"
              loading={isLoading}
              onPress={handleSubmit}
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
    maxHeight: '88%',
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
  orgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  orgChipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  orgChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    maxWidth: 160,
  },
  orgChipTextActive: {
    color: '#DC2626',
    fontWeight: '800',
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
