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
import { X, Edit3, Shield, Heart, Building2, UserCheck, Power } from 'lucide-react-native';
import { THEME } from '../../../config/theme';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminUserItem, SupportedRole } from '../models/admin.models';

interface EditUserModalProps {
  visible: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onSubmit: (id: string | number, payload: Partial<AdminUserItem> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
}

const ROLES: { key: 'Voluntario' | 'Beneficiario' | 'Organizacion' | 'Admin'; label: string; icon: any; color: string }[] = [
  { key: 'Voluntario', label: 'Voluntario', icon: Heart, color: '#16A34A' },
  { key: 'Beneficiario', label: 'Beneficiario', icon: UserCheck, color: '#D97706' },
  { key: 'Organizacion', label: 'Organización', icon: Building2, color: '#2563EB' },
  { key: 'Admin', label: 'Administrador', icon: Shield, color: '#DC2626' },
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  onClose,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<'Voluntario' | 'Beneficiario' | 'Organizacion' | 'Admin'>('Voluntario');
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [barrio, setBarrio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      let r: any = 'Voluntario';
      const userRole = String(user.rol).toLowerCase();
      if (userRole.includes('admin')) r = 'Admin';
      else if (userRole.includes('benef')) r = 'Beneficiario';
      else if (userRole.includes('org')) r = 'Organizacion';
      else r = 'Voluntario';

      setSelectedRole(r);
      setNombre1(user.nombre1 || '');
      setNombre2(user.nombre2 || '');
      setApellido1(user.apellido1 || '');
      setApellido2(user.apellido2 || '');
      setCorreo(user.correo || '');
      setTelefono(user.telefono || '');
      setBarrio(user.barrio || 'Kennedy Central');
      setDireccion(user.direccion || '');
      setPassword('');
      setEstado(user.estado === 'activo' || user.estado === 1 || user.estado === '1' ? 'activo' : 'inactivo');
      setErrorMessage('');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
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

    try {
      setIsLoading(true);
      const updateData: any = {
        rol: selectedRole,
        nombre1: nombre1.trim(),
        nombre2: nombre2.trim() || undefined,
        apellido1: apellido1.trim(),
        apellido2: apellido2.trim() || undefined,
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        barrio: barrio.trim() || undefined,
        direccion: direccion.trim() || undefined,
        estado: estado === 'activo' ? 1 : 0,
      };

      if (password.trim()) {
        updateData.password = password.trim();
      }

      const res = await onSubmit(user.id || user.id_usuario!, updateData);
      if (res.success) {
        Alert.alert('Éxito', res.message || 'Usuario actualizado correctamente.');
        onClose();
      } else {
        setErrorMessage(res.message || 'No se pudo actualizar el usuario.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

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
                <Edit3 size={18} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Actualizar Usuario</Text>
                <Text style={styles.headerSubtitle}>ID: {user.id || user.id_usuario}</Text>
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

            {/* Selector de Rol */}
            <Text style={styles.sectionTitle}>ROL EN LA PLATAFORMA</Text>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.key;
                const IconComponent = r.icon;
                return (
                  <TouchableOpacity
                    key={r.key}
                    activeOpacity={0.8}
                    onPress={() => setSelectedRole(r.key)}
                    style={[
                      styles.roleButton,
                      isSelected && {
                        borderColor: r.color,
                        backgroundColor: `${r.color}15`,
                      },
                    ]}
                  >
                    <IconComponent
                      size={18}
                      color={isSelected ? r.color : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.roleButtonText,
                        isSelected && { color: r.color, fontWeight: '800' },
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Datos Personales */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
              DATOS PERSONALES
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Primer Nombre *"
                  value={nombre1}
                  onChangeText={setNombre1}
                  placeholder="Ej. Juan"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Segundo Nombre"
                  value={nombre2}
                  onChangeText={setNombre2}
                  placeholder="Ej. Carlos"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Primer Apellido *"
                  value={apellido1}
                  onChangeText={setApellido1}
                  placeholder="Ej. Pérez"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Segundo Apellido"
                  value={apellido2}
                  onChangeText={setApellido2}
                  placeholder="Ej. Gómez"
                />
              </View>
            </View>

            {/* Contacto y Ubicación */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              CONTACTO Y RESIDENCIA
            </Text>

            <AppInput
              label="Correo Electrónico *"
              value={correo}
              onChangeText={setCorreo}
              placeholder="juan.perez@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Teléfono Móvil"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+57 300 123 4567"
              keyboardType="phone-pad"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Barrio (Kennedy)"
                  value={barrio}
                  onChangeText={setBarrio}
                  placeholder="Ej. Mandalay"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Dirección"
                  value={direccion}
                  onChangeText={setDireccion}
                  placeholder="Calle 38 Sur # 78K"
                />
              </View>
            </View>

            {/* Estado de la Cuenta */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              ESTADO DE LA CUENTA
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setEstado('activo')}
                style={[
                  styles.statusOption,
                  estado === 'activo' && styles.statusOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    estado === 'activo' && { color: '#16A34A', fontWeight: '800' },
                  ]}
                >
                  ✓ Activo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEstado('inactivo')}
                style={[
                  styles.statusOption,
                  estado === 'inactivo' && styles.statusOptionInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    estado === 'inactivo' && { color: '#DC2626', fontWeight: '800' },
                  ]}
                >
                  ✕ Inactivo / Suspendido
                </Text>
              </TouchableOpacity>
            </View>

            {/* Contraseña nueva opcional */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
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

          {/* Footer */}
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
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  roleButtonText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
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
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
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
