/**
 * HU013 — Pantalla para Crear Eventos (Give & Go Mobile)
 * Formulario nativo con validaciones completas, manejo de estados y diseño Give & Go
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CustomInput } from '../components/common/CustomInput';
import { CustomButton } from '../components/common/CustomButton';
import { createEvent } from '../services/eventService';
import { validateCreateEvent } from '../utils/eventValidators';
import {
  CreateEventDTO,
  CreateEventFormData,
  EventCategory,
  EventFormErrors,
} from '../types/event.types';

// Categorías oficiales del backend
const EVENT_CATEGORIES: EventCategory[] = [
  { id_categoria: 1, nombre: 'Alimentación y Comedores' },
  { id_categoria: 2, nombre: 'Salud y Primeros Auxilios' },
  { id_categoria: 3, nombre: 'Educación y Talleres' },
  { id_categoria: 4, nombre: 'Medio Ambiente y Reciclaje' },
  { id_categoria: 5, nombre: 'Refugio y Vivienda' },
  { id_categoria: 6, nombre: 'Donaciones y Ropa' },
  { id_categoria: 7, nombre: 'Apoyo a la Niñez y Juventud' },
  { id_categoria: 8, nombre: 'Cuidado de Adultos Mayores' },
];

interface CreateEventScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  // TODO: REEMPLAZAR CON EL ID DE LA ORGANIZACIÓN AUTENTICADA (desde AuthContext o sesión del usuario)
  const currentOrganizacionId = 1;

  // Estado del formulario
 const [formData, setFormData] = useState<Partial<CreateEventFormData>>({
  nombre: '',
  categoria: '1',
  descripcion: '',
  direccion: '',
  fecha: '',
  cupo: 20,
  vacantesVoluntarios: 10,
  vacantesBeneficiarios: 10,
  ayudaOfrecida: '',
  organizacionId: String(currentOrganizacionId),
  barrio: 'Centro',
  localidad: 'Kennedy',
  ciudad: 'Bogotá',
  departamento: 'Bogotá D.C.',
  pais: 'Colombia',
  punto_referencia: '',
  nombre_lugar: '',
  imagen: '',
});

  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Selector de fecha y hora simplificado para mobile
  const [dateInput, setDateInput] = useState<string>(''); // YYYY-MM-DD
  const [timeInput, setTimeInput] = useState<string>(''); // HH:mm

  const handleChange = (
  field: keyof CreateEventFormData,
  value: any
) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpia error específico del campo al editar
    if (errors[field as keyof EventFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof EventFormErrors];
        return next;
      });
    }
  };

  const handleCategorySelect = (categoria: EventCategory) => {
  handleChange('categoria', String(categoria.id_categoria));
  setShowCategoryModal(false);
};

  const updateCombinedDateTime = (dateStr: string, timeStr: string) => {
  if (dateStr && timeStr) {
    // Formato ISO 8601
    const combined = `${dateStr}T${timeStr}:00`;
    handleChange('fecha', combined);
  } else if (dateStr) {
    const combined = `${dateStr}T08:00:00`;
    handleChange('fecha', combined);
  }
};

  const handleDateChange = (val: string) => {
    setDateInput(val);
    updateCombinedDateTime(val, timeInput || '08:00');
  };

  const handleTimeChange = (val: string) => {
    setTimeInput(val);
    updateCombinedDateTime(dateInput, val);
  };

  const handleSubmit = async () => {
    setGeneralError(null);

    // 1. Armar payload con datos tipados
    const payload: CreateEventDTO = {
  nombre: (formData.nombre || '').trim(),
  id_categoria: Number(formData.categoria || '1'),
  descripcion: (formData.descripcion || '').trim(),
  direccion: (formData.direccion || '').trim(),
  fecha: formData.fecha || '',
  cupo: Number(formData.cupo),
  vacantes_voluntarios: Number(formData.vacantesVoluntarios),
  vacantes_beneficiarios: Number(formData.vacantesBeneficiarios),
  ayuda_ofrecida: (formData.ayudaOfrecida || '').trim(),
  organizacion_id: Number(formData.organizacionId || currentOrganizacionId),
  barrio: (formData.barrio || '').trim(),
  localidad: (formData.localidad || '').trim(),
  ciudad: (formData.ciudad || '').trim(),
  departamento: (formData.departamento || '').trim(),
  pais: (formData.pais || 'Colombia').trim(),
  punto_referencia: (formData.punto_referencia || '').trim(),
  nombre_lugar: (formData.nombre_lugar || '').trim(),
  imagen: (formData.imagen || '').trim(),
};

    // 2. Validación Mobile First
    const validation = validateCreateEvent(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setGeneralError('Por favor revisa los campos señalados antes de continuar.');
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 3. Petición al endpoint POST /api/events/
      await createEvent(payload);

      // 4. Éxito
      setIsLoading(false);
      setSuccessModalVisible(true);
    } catch (err: any) {
      setIsLoading(false);
      const msg =
        err?.message ||
        'No fue posible crear el evento. Verifica la información e inténtalo nuevamente.';
      setGeneralError(msg);
    }
  };

  const selectedCategoryName =
  EVENT_CATEGORIES.find(
    (c) => String(c.id_categoria) === formData.categoria
  )?.nombre || 'Seleccionar categoría';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO */}
        <View style={styles.header}>
          {onBack && (
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </Pressable>
          )}
          <Text style={styles.headerBadge}>HU013 • ORGANIZACIONES</Text>
          <Text style={styles.title}>Crear evento</Text>
          <Text style={styles.subtitle}>
            Publica una nueva actividad comunitaria para convocar voluntarios y beneficiarios.
          </Text>
        </View>

        {/* ALERTA DE ERROR GENERAL */}
        {generalError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerTitle}>Atención</Text>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        )}

        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Información principal</Text>

          <CustomInput
            label="Nombre del evento"
            placeholder="Ej: Jornada de donación de ropa de invierno"
            value={formData.nombre}
            onChangeText={(val) => handleChange('nombre', val)}
            error={errors.nombre}
            required
          />

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Categoría del evento</Text>
              <Text style={styles.requiredStar}> *</Text>
            </View>
            <Pressable
              onPress={() => setShowCategoryModal(true)}
              style={[
                styles.categorySelector,
                errors.categoria ? styles.categorySelectorError : null,
              ]}
            >
              <Text style={styles.categorySelectorText}>{selectedCategoryName}</Text>
              <Text style={styles.categorySelectorArrow}>▼</Text>
            </Pressable>
            {errors.categoria ? (
              <Text style={styles.fieldErrorText}>{errors.categoria}</Text>
            ) : null}
          </View>

          <CustomInput
            label="Descripción"
            placeholder="Explica detalladamente la misión de la actividad, requisitos y tareas..."
            value={formData.descripcion}
            onChangeText={(val) => handleChange('descripcion', val)}
            error={errors.descripcion}
            multiline
            numberOfLines={4}
            required
          />

          <CustomInput
            label="Ayuda u ofrecimiento"
            placeholder="Ej: Entrega de paquetes alimentarios, kits escolares..."
            value={formData.ayudaOfrecida}
            onChangeText={(val) => handleChange('ayudaOfrecida', val)}
            error={errors.ayudaOfrecida}
            required
            helperText="Describe los recursos o servicios que se brindarán."
          />
        </View>

        {/* SECCIÓN 2: FECHA Y HORARIO */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Fecha y horario</Text>
          <Text style={styles.sectionSubtitle}>
            La fecha y hora deben ser posteriores al momento actual.
          </Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <CustomInput
                label="Fecha (AAAA-MM-DD)"
                placeholder="2026-09-01"
                value={dateInput}
                onChangeText={handleDateChange}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                required
              />
            </View>
            <View style={styles.colSpacing} />
            <View style={styles.col}>
              <CustomInput
                label="Hora (HH:mm)"
                placeholder="09:00"
                value={timeInput}
                onChangeText={handleTimeChange}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                required
              />
            </View>
          </View>

          {errors.fecha ? (
            <View style={styles.inlineErrorBox}>
              <Text style={styles.inlineErrorText}>{errors.fecha}</Text>
            </View>
          ) : (
            <Text style={styles.datePreviewText}>
              Fecha seleccionada: {formData.fecha ? formData.fecha : 'Sin definir'}
            </Text>
          )}
        </View>

        {/* SECCIÓN 3: CAPACIDAD Y CUPOS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Capacidad y vacantes</Text>

          <CustomInput
            label="Cupo total máximo"
            placeholder="Ej: 30"
            value={formData.cupo?.toString()}
            onChangeText={(val) => handleChange('cupo', val.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            error={errors.cupo}
            required
            helperText="Capacidad máxima global del lugar o actividad."
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <CustomInput
                label="Vacantes Voluntarios"
                placeholder="Ej: 15"
                value={formData.vacantesVoluntarios?.toString()}
                onChangeText={(val) =>
                handleChange('vacantesVoluntarios', val.replace(/[^0-9]/g, ''))
                }
                keyboardType="number-pad"
                error={errors.vacantesVoluntarios}
                required
              />
            </View>
            <View style={styles.colSpacing} />
            <View style={styles.col}>
              <CustomInput
                label="Vacantes Beneficiarios"
                placeholder="Ej: 15"
                value={formData.vacantesBeneficiarios?.toString()}
                onChangeText={(val) =>
                handleChange('vacantesBeneficiarios', val.replace(/[^0-9]/g, ''))
                } 
                keyboardType="number-pad"
                error={errors.vacantesBeneficiarios}
                required
              />
            </View>
          </View>
        </View>

        {/* SECCIÓN 4: UBICACIÓN */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Ubicación del evento</Text>

          <CustomInput
            label="Dirección principal"
            placeholder="Ej: Cra 15 # 85-30"
            value={formData.direccion}
            onChangeText={(val) => handleChange('direccion', val)}
            error={errors.direccion}
            required
          />

          <CustomInput
            label="Nombre del lugar o recinto"
            placeholder="Ej: Parque Comunitario El Rosal"
            value={formData.nombre_lugar}
            onChangeText={(val) => handleChange('nombre_lugar', val)}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <CustomInput
                label="Ciudad"
                placeholder="Bogotá"
                value={formData.ciudad}
                onChangeText={(val) => handleChange('ciudad', val)}
              />
            </View>
            <View style={styles.colSpacing} />
            <View style={styles.col}>
              <CustomInput
                label="Barrio / Localidad"
                placeholder="Chapinero"
                value={formData.barrio}
                onChangeText={(val) => handleChange('barrio', val)}
              />
            </View>
          </View>

          <CustomInput
            label="Punto de referencia"
            placeholder="Ej: Frente a la parroquia, portón azul"
            value={formData.punto_referencia}
            onChangeText={(val) => handleChange('punto_referencia', val)}
          />
        </View>

        {/* SECCIÓN 5: RECURSOS ADICIONALES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Imagen (opcional)</Text>
          <CustomInput
            label="URL de imagen del evento"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imagen}
            onChangeText={(val) => handleChange('imagen', val)}
            helperText="Puedes incluir una imagen promocional para tu actividad."
          />
        </View>

        {/* BOTÓN DE ACCIÓN */}
        <View style={styles.actionContainer}>
          <CustomButton
            title="Crear evento"
            onPress={handleSubmit}
            isLoading={isLoading}
            variant="primary"
          />

          {onBack && (
            <CustomButton
              title="Cancelar"
              onPress={onBack}
              variant="outline"
              style={styles.cancelBtn}
            />
          )}
        </View>
      </ScrollView>

      {/* MODAL DE SELECCIÓN DE CATEGORÍA */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar categoría</Text>
              <Pressable
                onPress={() => setShowCategoryModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalList}>
              {EVENT_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id_categoria}
                  style={[
                    styles.categoryItem,
                    formData.categoria === String(cat.id_categoria) &&
                    styles.categoryItemSelected
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      formData.categoria === String(cat.id_categoria) && 
                      styles.categoryItemTextSelected
                    ]}
                  >
                    {cat.nombre}
                  </Text>
                  {formData.categoria === String(cat.id_categoria) && (
                  <Text style={styles.checkmark}>✓</Text>
                 )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ÉXITO */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSuccessModalVisible(false);
          if (onSuccess) onSuccess();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconBadge}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successModalTitle}>Evento creado correctamente</Text>
            <Text style={styles.successModalMessage}>
              La actividad "{formData.nombre}" ha sido registrada y publicada en la plataforma Give & Go.
            </Text>
            <CustomButton
              title="Aceptar y continuar"
              onPress={() => {
                setSuccessModalVisible(false);
                if (onSuccess) {
                  onSuccess();
                } else if (onBack) {
                  onBack();
                }
              }}
              variant="primary"
              style={styles.successActionBtn}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  requiredStar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  categorySelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelectorError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  categorySelectorText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  categorySelectorArrow: {
    fontSize: 12,
    color: '#64748B',
  },
  fieldErrorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
  },
  colSpacing: {
    width: 12,
  },
  datePreviewText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  inlineErrorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 8,
    marginTop: -8,
    marginBottom: 8,
  },
  inlineErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    marginTop: 8,
  },
  cancelBtn: {
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  modalList: {
    flexGrow: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  categoryItemSelected: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  categoryItemText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  categoryItemTextSelected: {
    color: '#DC2626',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  successModalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  successIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    borderWidth: 3,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 30,
    color: '#16A34A',
    fontWeight: '800',
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  successModalMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  successActionBtn: {
    width: '100%',
  },
});
