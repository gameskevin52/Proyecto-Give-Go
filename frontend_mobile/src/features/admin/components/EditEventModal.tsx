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
import { X, Edit3, Tag, Calendar } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminEventItem, AdminCategoryItem } from '../models/admin.models';

interface EditEventModalProps {
  visible: boolean;
  event: AdminEventItem | null;
  categories: AdminCategoryItem[];
  onClose: () => void;
  onSubmit: (id: string | number, payload: Partial<AdminEventItem>) => Promise<{ success: boolean; message?: string }>;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  visible,
  event,
  categories,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<'activo' | 'finalizado' | 'cancelado'>('activo');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [cupo, setCupo] = useState('30');
  const [latitud, setLatitud] = useState('4.6280');
  const [longitud, setLongitud] = useState('-74.1530');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (event) {
      setNombre(event.nombre || '');
      setCategoria(event.categoria || (categories[0]?.nombre || 'Social y Comunitario'));
      setDescripcion(event.descripcion || '');
      setFecha(event.fecha ? event.fecha.split('T')[0] : '');
      setEstado((event.estado as any) || 'activo');
      setDireccion(event.direccion || '');
      setBarrio(event.barrio || 'Kennedy Central');
      setCupo(String(event.cupo || '30'));
      setLatitud(String(event.latitud || '4.6280'));
      setLongitud(String(event.longitud || '-74.1530'));
      setErrorMessage('');
    }
  }, [event, categories]);

  const handleSubmit = async () => {
    if (!event) return;
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('El título del evento es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setErrorMessage('La descripción es obligatoria.');
      return;
    }
    if (!fecha.trim()) {
      setErrorMessage('La fecha es obligatoria.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit(event.id, {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        descripcion: descripcion.trim(),
        fecha: fecha.trim(),
        estado,
        direccion: direccion.trim(),
        barrio: barrio.trim(),
        cupo: parseInt(cupo, 10) || 0,
        latitud: parseFloat(latitud) || 4.6280,
        longitud: parseFloat(longitud) || -74.1530,
      });

      if (res.success) {
        Alert.alert('Éxito', res.message || 'Evento actualizado correctamente.');
        onClose();
      } else {
        setErrorMessage(res.message || 'No se pudo actualizar el evento.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

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
                <Edit3 size={18} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Actualizar Evento</Text>
                <Text style={styles.headerSubtitle}>ID: {event.id}</Text>
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

            <Text style={styles.sectionTitle}>ESTADO DEL EVENTO</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {(['activo', 'finalizado', 'cancelado'] as const).map((st) => {
                const isSelected = estado === st;
                return (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setEstado(st)}
                    style={[
                      styles.stateBtn,
                      isSelected && styles.stateBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stateBtnText,
                        isSelected && styles.stateBtnTextActive,
                      ]}
                    >
                      {st.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>INFORMACIÓN BÁSICA</Text>
            <AppInput
              label="Título del Evento *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Título del evento..."
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>CATEGORÍA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
              {(categories.length > 0 ? categories : [
                { id: '1', nombre: 'Medio Ambiente' },
                { id: '2', nombre: 'Niñez y Juventud' },
                { id: '3', nombre: 'Adulto Mayor' },
                { id: '4', nombre: 'Salud y Bienestar' },
              ]).map((cat) => {
                const isSelected = categoria === cat.nombre;
                return (
                  <TouchableOpacity
                    key={cat.id || cat.nombre}
                    activeOpacity={0.8}
                    onPress={() => setCategoria(cat.nombre)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipActive,
                    ]}
                  >
                    <Tag size={12} color={isSelected ? '#DC2626' : '#64748B'} />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {cat.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <AppInput
              label="Descripción *"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción..."
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>DETALLES OPERATIVOS</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Fecha (YYYY-MM-DD) *"
                  value={fecha}
                  onChangeText={setFecha}
                  placeholder="2026-10-15"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Cupo Voluntarios"
                  value={cupo}
                  onChangeText={setCupo}
                  placeholder="30"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <AppInput
              label="Dirección *"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección..."
            />

            <AppInput
              label="Barrio"
              value={barrio}
              onChangeText={setBarrio}
              placeholder="Barrio..."
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
  stateBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  stateBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  stateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stateBtnTextActive: {
    color: '#DC2626',
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
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
