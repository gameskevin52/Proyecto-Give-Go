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
import { X, Tag } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { nombre: string; descripcion: string; estado?: string }) => Promise<{ success: boolean; message?: string }>;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setEstado('activo');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('El nombre de la categoría es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setErrorMessage('La descripción de la categoría es obligatoria.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        estado,
      });

      if (res.success) {
        Alert.alert('Éxito', 'Categoría creada correctamente.');
        handleClose();
      } else {
        setErrorMessage(res.message || 'Error al crear la categoría.');
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
                <Tag size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Nueva Categoría</Text>
                <Text style={styles.headerSubtitle}>
                  Clasificación temática de ayuda comunitaria
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

            <Text style={styles.sectionTitle}>ESTADO INICIAL</Text>
            <View style={styles.stateRow}>
              <TouchableOpacity
                onPress={() => setEstado('activo')}
                style={[
                  styles.stateBtn,
                  estado === 'activo' && styles.stateBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.stateBtnText,
                    estado === 'activo' && styles.stateBtnTextActive,
                  ]}
                >
                  ACTIVA
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEstado('inactivo')}
                style={[
                  styles.stateBtn,
                  estado === 'inactivo' && styles.stateBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.stateBtnText,
                    estado === 'inactivo' && styles.stateBtnTextActive,
                  ]}
                >
                  INACTIVA
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>INFORMACIÓN</Text>
            <AppInput
              label="Nombre de Categoría *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Niñez y Juventud, Medio Ambiente, Adulto Mayor..."
            />

            <AppInput
              label="Descripción General *"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Explica qué tipo de causas y donaciones abarca esta categoría..."
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
              title="Crear Categoría"
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
  stateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
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
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
