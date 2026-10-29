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
import { X, Heart, DollarSign, Package, Building2, User } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminOrgItem, AdminUserItem, AdminCategoryItem } from '../models/admin.models';

interface CreateDonationModalProps {
  visible: boolean;
  organizations: AdminOrgItem[];
  users: AdminUserItem[];
  categories: AdminCategoryItem[];
  onClose: () => void;
  onSubmit: (payload: any) => Promise<{ success: boolean; message?: string }>;
}

export const CreateDonationModal: React.FC<CreateDonationModalProps> = ({
  visible,
  organizations,
  users,
  categories,
  onClose,
  onSubmit,
}) => {
  const [tipo, setTipo] = useState<'monetaria' | 'objeto'>('monetaria');
  const [organizacionId, setOrganizacionId] = useState(organizations[0]?.id || '');
  const [usuarioId, setUsuarioId] = useState(users[0]?.id ? String(users[0].id) : 'anonimo');
  const [categoria, setCategoria] = useState(categories[0]?.nombre || 'Social y Comunitario');

  // Monetaria fields
  const [valor, setValor] = useState('50000');
  const [metodo, setMetodo] = useState<'tarjeta' | 'transferencia' | 'efectivo' | 'nequi' | 'daviplata'>('nequi');
  const [cuenta, setCuenta] = useState('3109876543');

  // Objeto fields
  const [objetoCategoria, setObjetoCategoria] = useState('Alimentos no perecederos');
  const [objetoCantidad, setObjetoCantidad] = useState('5');
  const [objetoDescripcion, setObjetoDescripcion] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setTipo('monetaria');
    setOrganizacionId(organizations[0]?.id || '');
    setUsuarioId(users[0]?.id ? String(users[0].id) : 'anonimo');
    setCategoria(categories[0]?.nombre || 'Social y Comunitario');
    setValor('50000');
    setMetodo('nequi');
    setCuenta('3109876543');
    setObjetoCategoria('Alimentos no perecederos');
    setObjetoCantidad('5');
    setObjetoDescripcion('');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (tipo === 'monetaria') {
      const numVal = parseFloat(valor);
      if (isNaN(numVal) || numVal <= 0) {
        setErrorMessage('Por favor ingrese un monto monetario válido mayor a cero.');
        return;
      }
    } else {
      const numCant = parseInt(objetoCantidad, 10);
      if (isNaN(numCant) || numCant <= 0) {
        setErrorMessage('La cantidad de elementos donados debe ser mayor a cero.');
        return;
      }
      if (!objetoDescripcion.trim()) {
        setErrorMessage('Por favor describa el estado o tipo de insumos donados.');
        return;
      }
    }

    try {
      setIsLoading(true);

      const targetOrg = organizations.find((o) => o.id === organizacionId) || organizations[0];
      const payload: any = {
        tipo,
        categoria: categoria || targetOrg?.categoria || 'General',
        usuarioId: usuarioId || 'anonimo',
        organizacionId: organizacionId || targetOrg?.id,
      };

      if (tipo === 'monetaria') {
        payload.monetaria = {
          valor: parseFloat(valor),
          metodo,
          cuenta: cuenta.trim() || 'Aporte en ventanilla / Nequi',
        };
      } else {
        payload.objeto = {
          categoria: objetoCategoria,
          cantidad: parseInt(objetoCantidad, 10),
          descripcion: objetoDescripcion.trim(),
        };
      }

      const res = await onSubmit(payload);
      if (res.success) {
        Alert.alert('Éxito', 'Donación registrada exitosamente en el libro contable.');
        handleClose();
      } else {
        setErrorMessage(res.message || 'Error al registrar la donación.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de comunicación.');
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
                <Heart size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Registrar Donación</Text>
                <Text style={styles.headerSubtitle}>
                  Ingreso oficial a la plataforma solidaria
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

            {/* Type selector */}
            <Text style={styles.sectionTitle}>MODALIDAD DE DONACIÓN</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTipo('monetaria')}
                style={[
                  styles.typeOption,
                  tipo === 'monetaria' && styles.typeOptionActive,
                ]}
              >
                <DollarSign
                  size={18}
                  color={tipo === 'monetaria' ? '#16A34A' : '#64748B'}
                />
                <Text
                  style={[
                    styles.typeOptionText,
                    tipo === 'monetaria' && styles.typeOptionTextActive,
                  ]}
                >
                  Monetaria (COP)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTipo('objeto')}
                style={[
                  styles.typeOption,
                  tipo === 'objeto' && styles.typeOptionActive,
                ]}
              >
                <Package
                  size={18}
                  color={tipo === 'objeto' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.typeOptionText,
                    tipo === 'objeto' && styles.typeOptionTextActive,
                  ]}
                >
                  En Especie / Insumos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Target Organization */}
            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
              ORGANIZACIÓN BENEFICIARIA *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 10 }}
            >
              {organizations.map((org) => {
                const isSelected = (organizacionId || organizations[0]?.id) === org.id;
                return (
                  <TouchableOpacity
                    key={org.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      setOrganizacionId(org.id);
                      if (org.categoria) setCategoria(org.categoria);
                    }}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Building2
                      size={12}
                      color={isSelected ? '#DC2626' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {org.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Donor selector */}
            <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
              DONANTE REGISTRADO
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 10 }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setUsuarioId('anonimo')}
                style={[
                  styles.chip,
                  usuarioId === 'anonimo' && styles.chipActive,
                ]}
              >
                <User
                  size={12}
                  color={usuarioId === 'anonimo' ? '#DC2626' : '#64748B'}
                />
                <Text
                  style={[
                    styles.chipText,
                    usuarioId === 'anonimo' && styles.chipTextActive,
                  ]}
                >
                  Donante Anónimo
                </Text>
              </TouchableOpacity>

              {users.slice(0, 10).map((u) => {
                const isSelected = usuarioId === String(u.id);
                return (
                  <TouchableOpacity
                    key={u.id}
                    activeOpacity={0.8}
                    onPress={() => setUsuarioId(String(u.id))}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <User
                      size={12}
                      color={isSelected ? '#DC2626' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {u.nombre1} {u.apellido1 || ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Dynamic fields based on tipo */}
            {tipo === 'monetaria' ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.sectionTitle}>DETALLES DEL PAGO</Text>
                <AppInput
                  label="Valor en Pesos Colombianos (COP) *"
                  value={valor}
                  onChangeText={setValor}
                  placeholder="50000"
                  keyboardType="numeric"
                />

                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>MÉTODO DE PAGO</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {(['nequi', 'daviplata', 'transferencia', 'tarjeta', 'efectivo'] as const).map(
                    (m) => {
                      const isSel = metodo === m;
                      return (
                        <TouchableOpacity
                          key={m}
                          onPress={() => setMetodo(m)}
                          style={[
                            styles.smallChip,
                            isSel && styles.smallChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              isSel && styles.smallChipTextActive,
                            ]}
                          >
                            {m.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>

                <AppInput
                  label="Referencia o Número de Cuenta"
                  value={cuenta}
                  onChangeText={setCuenta}
                  placeholder="Ej. Comprobante Nequi # 894372"
                />
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.sectionTitle}>DETALLES DEL OBJETO / INSUMO</Text>
                <AppInput
                  label="Categoría del Elemento *"
                  value={objetoCategoria}
                  onChangeText={setObjetoCategoria}
                  placeholder="Ej. Alimentos, Ropa, Útiles escolares..."
                />

                <AppInput
                  label="Cantidad de Unidades *"
                  value={objetoCantidad}
                  onChangeText={setObjetoCantidad}
                  placeholder="Ej. 10"
                  keyboardType="numeric"
                />

                <AppInput
                  label="Descripción y Estado de los Insumos *"
                  value={objetoDescripcion}
                  onChangeText={setObjetoDescripcion}
                  placeholder="Ej. 5 bultos de arroz y lentejas sellados..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

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
              title="Registrar Donación"
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
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeOptionActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  typeOptionTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  chip: {
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
  chipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  chipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    maxWidth: 160,
  },
  chipTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  smallChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  smallChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  smallChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  smallChipTextActive: {
    color: '#16A34A',
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
