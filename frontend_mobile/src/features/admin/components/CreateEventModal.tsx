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
import { X, Calendar, Building2, Tag } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminOrgItem, AdminCategoryItem } from '../models/admin.models';

interface CreateEventModalProps {
  visible: boolean;
  organizations: AdminOrgItem[];
  categories: AdminCategoryItem[];
  onClose: () => void;
  onSubmit: (payload: any) => Promise<{ success: boolean; message?: string }>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  organizations,
  categories,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(categories[0]?.nombre || 'Social y Comunitario');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [organizacionId, setOrganizacionId] = useState(organizations[0]?.id || '');
  const [direccion, setDireccion] = useState('Parque Central Kennedy');
  const [barrio, setBarrio] = useState('Kennedy Central');
  const [cupo, setCupo] = useState('30');
  const [latitud, setLatitud] = useState('4.6280');
  const [longitud, setLongitud] = useState('-74.1530');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setNombre('');
    setCategoria(categories[0]?.nombre || 'Social y Comunitario');
    setDescripcion('');
    setFecha(new Date().toISOString().split('T')[0]);
    setOrganizacionId(organizations[0]?.id || '');
    setDireccion('Parque Central Kennedy');
    setBarrio('Kennedy Central');
    setCupo('30');
    setLatitud('4.6280');
    setLongitud('-74.1530');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('El título o nombre del evento es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setErrorMessage('La descripción del evento es obligatoria.');
      return;
    }
    if (!fecha.trim()) {
      setErrorMessage('La fecha del evento es obligatoria (YYYY-MM-DD).');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('La dirección es obligatoria.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        descripcion: descripcion.trim(),
        fecha: fecha.trim(),
        organizacionId: organizacionId || organizations[0]?.id || '1',
        direccion: direccion.trim(),
        barrio: barrio.trim() || 'Kennedy Central',
        localidad: 'Kennedy',
        ciudad: 'Bogotá',
        departamento: 'Bogotá D.C.',
        pais: 'Colombia',
        cupo: parseInt(cupo, 10) || 0,
        latitud: parseFloat(latitud) || 4.6280,
        longitud: parseFloat(longitud) || -74.1530,
        estado: 'activo',
      });

      if (res.success) {
        Alert.alert('Éxito', 'Evento comunitario creado correctamente.');
        handleClose();
      } else {
        setErrorMessage(res.message || 'No se pudo crear el evento.');
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
                <Calendar size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Crear Evento Comunitario</Text>
                <Text style={styles.headerSubtitle}>
                  Publicar jornada de impacto en Kennedy
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

            <Text style={styles.sectionTitle}>INFORMACIÓN BÁSICA</Text>
            <AppInput
              label="Título del Evento *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Jornada de Reforestación Humedal La Vaca"
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>CATEGORÍA DE IMPACTO</Text>
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
              label="Descripción de la Actividad *"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Detalla los objetivos, qué deben llevar los voluntarios..."
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>ORGANIZACIÓN RESPONSABLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
              {organizations.map((org) => {
                const isSelected = (organizacionId || organizations[0]?.id) === org.id;
                return (
                  <TouchableOpacity
                    key={org.id}
                    activeOpacity={0.8}
                    onPress={() => setOrganizacionId(org.id)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipActive,
                    ]}
                  >
                    <Building2 size={12} color={isSelected ? '#DC2626' : '#64748B'} />
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

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>FECHA Y UBICACIÓN</Text>

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
              label="Dirección del Encuentro *"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Ej. Calle 40 Sur con Carrera 78K"
            />

            <AppInput
              label="Barrio (Kennedy)"
              value={barrio}
              onChangeText={setBarrio}
              placeholder="Ej. Kennedy Central, Timiza, Castilla"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Latitud Coordenada"
                  value={latitud}
                  onChangeText={setLatitud}
                  placeholder="4.6280"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Longitud Coordenada"
                  value={longitud}
                  onChangeText={setLongitud}
                  placeholder="-74.1530"
                  keyboardType="numeric"
                />
              </View>
            </View>

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
              title="Publicar Evento"
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
