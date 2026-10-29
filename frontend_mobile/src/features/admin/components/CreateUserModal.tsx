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
import { X, UserPlus, Shield, Heart, Building2, UserCheck } from 'lucide-react-native';
import { THEME } from '../../../config/theme';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { CreateUserPayload, SupportedRole } from '../models/admin.models';

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<{ success: boolean; message?: string }>;
}

const ROLES: { key: CreateUserPayload['rol']; label: string; icon: any; color: string }[] = [
  { key: 'Voluntario', label: 'Voluntario', icon: Heart, color: '#16A34A' },
  { key: 'Beneficiario', label: 'Beneficiario', icon: UserCheck, color: '#D97706' },
  { key: 'Organizacion', label: 'Organización', icon: Building2, color: '#2563EB' },
  { key: 'Admin', label: 'Administrador', icon: Shield, color: '#DC2626' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<CreateUserPayload['rol']>('Voluntario');
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [barrio, setBarrio] = useState('Kennedy Central');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('User123*');
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setSelectedRole('Voluntario');
    setNombre1('');
    setNombre2('');
    setApellido1('');
    setApellido2('');
    setCorreo('');
    setTelefono('');
    setBarrio('Kennedy Central');
    setDireccion('');
    setPassword('User123*');
    setEstado('activo');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!nombre1.trim()) {
      setErrorMessage('El primer nombre es obligatorio.');
      return;
    }
    if (!apellido1.trim()) {
      setErrorMessage('El primer apellido es obligatorio.');
      return;
    }
    if (!correo.trim()) {
      setErrorMessage('El correo electrónico es obligatorio.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setErrorMessage('El formato de correo es inválido.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateUserPayload = {
        rol: selectedRole,
        nombre1: nombre1.trim(),
        nombre2: nombre2.trim() || undefined,
        apellido1: apellido1.trim(),
        apellido2: apellido2.trim() || undefined,
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim() || '+57 300 123 4567',
        barrio: barrio.trim() || 'Kennedy Central',
        direccion: direccion.trim() || undefined,
        password: password.trim() || 'User123*',
        estado,
      };

      const result = await onSubmit(payload);
      if (result.success) {
        Alert.alert('Éxito', result.message || 'Usuario creado correctamente.');
        handleClose();
      } else {
        setErrorMessage(result.message || 'No se pudo crear el usuario.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <UserPlus size={18} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.title}>Registro Manual de Usuario</Text>
                <Text style={styles.subtitle}>Creación administrativa de cuenta con rol</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Role Selection */}
            <Text style={styles.sectionLabel}>Selecciona el Rol del Usuario *</Text>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.key;
                const IconComponent = r.icon;
                return (
                  <TouchableOpacity
                    key={r.key}
                    activeOpacity={0.75}
                    onPress={() => setSelectedRole(r.key)}
                    style={[
                      styles.roleChip,
                      isSelected && { borderColor: r.color, backgroundColor: `${r.color}15` },
                    ]}
                  >
                    <IconComponent size={16} color={isSelected ? r.color : '#64748B'} />
                    <Text
                      style={[
                        styles.roleChipText,
                        isSelected && { color: r.color, fontWeight: '700' },
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Names */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <AppInput
                  label="Primer Nombre *"
                  placeholder="Ej: Carlos"
                  value={nombre1}
                  onChangeText={setNombre1}
                />
              </View>
              <View style={styles.halfCol}>
                <AppInput
                  label="Segundo Nombre"
                  placeholder="Ej: Andrés"
                  value={nombre2}
                  onChangeText={setNombre2}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <AppInput
                  label="Primer Apellido *"
                  placeholder="Ej: Gómez"
                  value={apellido1}
                  onChangeText={setApellido1}
                />
              </View>
              <View style={styles.halfCol}>
                <AppInput
                  label="Segundo Apellido"
                  placeholder="Ej: Pérez"
                  value={apellido2}
                  onChangeText={setApellido2}
                />
              </View>
            </View>

            {/* Contact */}
            <AppInput
              label="Correo Electrónico *"
              placeholder="carlos.gomez@giveandgo.com"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Teléfono Móvil"
              placeholder="+57 310 123 4567"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <AppInput
                  label="Barrio"
                  placeholder="Ej: Timiza"
                  value={barrio}
                  onChangeText={setBarrio}
                />
              </View>
              <View style={styles.halfCol}>
                <AppInput
                  label="Dirección"
                  placeholder="Ej: Calle 40 Sur"
                  value={direccion}
                  onChangeText={setDireccion}
                />
              </View>
            </View>

            <AppInput
              label="Contraseña Inicial *"
              placeholder="User123*"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Estado */}
            <Text style={styles.sectionLabel}>Estado Inicial</Text>
            <View style={styles.estadoRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setEstado('activo')}
                style={[
                  styles.estadoBtn,
                  estado === 'activo' && { borderColor: '#16A34A', backgroundColor: '#DCFCE7' },
                ]}
              >
                <Text
                  style={[
                    styles.estadoBtnText,
                    estado === 'activo' && { color: '#16A34A', fontWeight: '700' },
                  ]}
                >
                  Activo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setEstado('inactivo')}
                style={[
                  styles.estadoBtn,
                  estado === 'inactivo' && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
                ]}
              >
                <Text
                  style={[
                    styles.estadoBtnText,
                    estado === 'inactivo' && { color: '#DC2626', fontWeight: '700' },
                  ]}
                >
                  Inactivo
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <AppButton
                title="Registrar Usuario"
                onPress={handleSubmit}
                isLoading={isLoading}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleClose}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 36,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 4,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  estadoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  estadoBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  estadoBtnText: {
    fontSize: 13,
    color: '#64748B',
  },
  actions: {
    marginTop: 10,
    gap: 8,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default CreateUserModal;
