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
import { X, Edit3, CheckCircle, XCircle } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminOrgItem } from '../models/admin.models';

interface EditOrgModalProps {
  visible: boolean;
  org: AdminOrgItem | null;
  onClose: () => void;
  onSubmit: (id: string, payload: Partial<AdminOrgItem> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
}

export const EditOrgModal: React.FC<EditOrgModalProps> = ({
  visible,
  org,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nit, setNit] = useState('');
  const [verificada, setVerificada] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (org) {
      setNombre(org.nombre || '');
      setDireccion(org.direccion || '');
      setCorreo(org.correo || '');
      setTelefono(org.telefono || '');
      setNit(org.nit || '');
      setVerificada(Boolean(org.verificada));
      setPassword('');
      setErrorMessage('');
    }
  }, [org]);

  const handleSubmit = async () => {
    if (!org) return;
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('El nombre de la organización es obligatorio.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('La dirección es obligatoria.');
      return;
    }
    if (!correo.trim()) {
      setErrorMessage('El correo es obligatorio.');
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        nit: nit.trim() || undefined,
        verificada: verificada ? 1 : 0,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const res = await onSubmit(org.id, payload);
      if (res.success) {
        Alert.alert('Éxito', res.message || 'Organización actualizada correctamente.');
        onClose();
      } else {
        setErrorMessage(res.message || 'No se pudo actualizar la organización.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!org) return null;

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
                <Edit3 size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Actualizar Organización</Text>
                <Text style={styles.headerSubtitle}>ID: {org.id}</Text>
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

            <Text style={styles.sectionTitle}>ESTADO DE VERIFICACIÓN</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <TouchableOpacity
                onPress={() => setVerificada(true)}
                style={[
                  styles.statusOption,
                  verificada && styles.statusOptionActive,
                ]}
              >
                <CheckCircle size={16} color={verificada ? '#16A34A' : '#94A3B8'} />
                <Text
                  style={[
                    styles.statusOptionText,
                    verificada && { color: '#16A34A', fontWeight: '800' },
                  ]}
                >
                  Verificada Oficial
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVerificada(false)}
                style={[
                  styles.statusOption,
                  !verificada && styles.statusOptionInactive,
                ]}
              >
                <XCircle size={16} color={!verificada ? '#64748B' : '#94A3B8'} />
                <Text
                  style={[
                    styles.statusOptionText,
                    !verificada && { color: '#64748B', fontWeight: '800' },
                  ]}
                >
                  Sin Verificar
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>DATOS INSTITUCIONALES</Text>

            <AppInput
              label="Razón Social / Nombre ONG *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Fundación Proteger"
            />

            <AppInput
              label="NIT Tributario"
              value={nit}
              onChangeText={setNit}
              placeholder="Ej. 900.123.456-7"
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              SEDE Y CONTACTO
            </Text>

            <AppInput
              label="Dirección Sede *"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Ej. Cra 78 # 45 Sur, Kennedy"
            />

            <AppInput
              label="Correo Electrónico *"
              value={correo}
              onChangeText={setCorreo}
              placeholder="contacto@ong.org"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Teléfono Móvil / Fijo"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+57 300 000 0000"
              keyboardType="phone-pad"
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              SEGURIDAD (OPCIONAL)
            </Text>
            <AppInput
              label="Nueva Contraseña (dejar en blanco para conservar)"
              value={password}
              onChangeText={setPassword}
              placeholder="Nueva clave segura..."
              secureTextEntry
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
              title="Guardar Cambios"
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
    maxHeight: '90%',
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
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  statusOptionActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusOptionInactive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusOptionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
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
