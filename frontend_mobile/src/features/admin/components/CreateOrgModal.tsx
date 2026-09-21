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
import { X, Building2 } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminOrgItem } from '../models/admin.models';

interface CreateOrgModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    nombre: string;
    direccion: string;
    correo: string;
    password?: string;
    telefono?: string;
    nit?: string;
  }) => Promise<{ success: boolean; data?: AdminOrgItem; message?: string }>;
}

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('Org123456*');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setNombre('');
    setDireccion('');
    setCorreo('');
    setPassword('Org123456*');
    setNit('');
    setTelefono('');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('La razón social o nombre de la organización es obligatorio.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('La dirección de la sede es obligatoria.');
      return;
    }
    if (!correo.trim()) {
      setErrorMessage('El correo institucional es obligatorio.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit({
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        correo: correo.trim().toLowerCase(),
        password: password.trim() || 'Org123456*',
        nit: nit.trim() || undefined,
        telefono: telefono.trim() || undefined,
      });

      if (res.success) {
        Alert.alert('Éxito', res.message || 'Organización registrada correctamente.');
        handleClose();
      } else {
        setErrorMessage(res.message || 'No se pudo crear la organización.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con el servidor.');
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
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.headerIcon}>
                <Building2 size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Registrar Organización</Text>
                <Text style={styles.headerSubtitle}>
                  Creación institucional en el sistema Give&Go
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

            <Text style={styles.sectionTitle}>INFORMACIÓN CORPORATIVA</Text>

            <AppInput
              label="Razón Social / Nombre ONG *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Fundación Niños de Kennedy"
            />

            <AppInput
              label="NIT / Documento Tributario"
              value={nit}
              onChangeText={setNit}
              placeholder="Ej. 900.876.543-1"
            />

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              SEDE Y CONTACTO
            </Text>

            <AppInput
              label="Dirección Sede Principal *"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Ej. Calle 40 Sur # 78K-12, Kennedy"
            />

            <AppInput
              label="Correo Electrónico Institucional *"
              value={correo}
              onChangeText={setCorreo}
              placeholder="contacto@fundacion.org"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Teléfono de Contacto"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+57 (601) 456 7890"
              keyboardType="phone-pad"
            />

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              ACCESO A PLATAFORMA
            </Text>

            <AppInput
              label="Contraseña de Acceso *"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={handleClose}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Registrar ONG"
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
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
