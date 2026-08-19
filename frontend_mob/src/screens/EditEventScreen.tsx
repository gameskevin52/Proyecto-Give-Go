/**
 * HU014 & HU015 — Pantalla para Actualizar y Eliminar Eventos (Give & Go Mobile)
 * Consulta el evento por ID, precarga datos, valida modificaciones, ejecuta PUT /api/events/:id y DELETE /api/events/:id con confirmación
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CustomInput } from '../components/common/CustomInput';
import { CustomButton } from '../components/common/CustomButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getEventById, updateEvent, deleteEvent } from '../services/eventService';
import { validateUpdateEvent } from '../utils/eventValidators';
import { UpdateEventDTO, EventCategory, EventFormErrors, Evento } from '../types/event.types';

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

interface EditEventScreenProps {
  eventId: number;
  onBack?: () => void;
  onSuccess?: () => void;
}

export const EditEventScreen: React.FC<EditEventScreenProps> = ({
  eventId,
  onBack,
  onSuccess,
}) => {
  // Estados de carga inicial y consulta
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

  // Datos del formulario
  const [formData, setFormData] = useState<Partial<UpdateEventDTO>>({
    nombre: '',
    id_categoria: 1,
    descripcion: '',
    direccion: '',
    fecha: '',
    cupo: 0,
    vacantes_voluntarios: 0,
    vacantes_beneficiarios: 0,
    ayuda_ofrecida: '',
    organizacion_id: 1,
    barrio: '',
    localidad: '',
    ciudad: '',
    departamento: '',
    pais: 'Colombia',
    punto_referencia: '',
    nombre_lugar: '',
    latitud: null,
    longitud: null,
    imagen: '',
  });

  // Entradas de fecha y hora separadas para interfaz móvil
  const [dateInput, setDateInput] = useState<string>(''); // YYYY-MM-DD
  const [timeInput, setTimeInput] = useState<string>(''); // HH:mm

  // Estados de envío y validaciones (HU014)
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Estados de eliminación (HU015)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState<boolean>(false);

  // Cargar datos existentes del evento (GET /api/events/:id)
  useEffect(() => {
    let isMounted = true;

    async function loadEventData() {
      setIsFetching(true);
      setNotFound(false);
      setFetchErrorMessage(null);

      try {
        const response = await getEventById(eventId);
        const event: Evento = (response?.data || response) as Evento;

        if (!event || (!event.id_evento && !event.nombre)) {
          if (isMounted) {
            setNotFound(true);
            setFetchErrorMessage('El evento no existe o ya fue eliminado.');
          }
          return;
        }

        if (isMounted) {
          // Extraer fecha y hora para los inputs
          let parsedDate = '';
          let parsedTime = '';

          if (event.fecha) {
            const rawFecha = event.fecha.replace('T', ' ');
            const parts = rawFecha.split(' ');
            if (parts.length >= 1) {
              parsedDate = parts[0];
            }
            if (parts.length >= 2) {
              parsedTime = parts[1].substring(0, 5); // HH:mm
            }
          }

          setDateInput(parsedDate);
          setTimeInput(parsedTime || '08:00');

          setFormData({
            nombre: event.nombre || '',
            id_categoria: Number(event.id_categoria) || 1,
            descripcion: event.descripcion || '',
            direccion: event.direccion || '',
            fecha: event.fecha || '',
            cupo: Number(event.cupo) || 0,
            vacantes_voluntarios: Number(event.vacantes_voluntarios) || 0,
            vacantes_beneficiarios: Number(event.vacantes_beneficiarios) || 0,
            ayuda_ofrecida: event.ayuda_ofrecida || '',
            organizacion_id: Number(event.organizacion_id) || 1,
            barrio: event.barrio || '',
            localidad: event.localidad || '',
            ciudad: event.ciudad || '',
            departamento: event.departamento || '',
            pais: event.pais || 'Colombia',
            punto_referencia: event.punto_referencia || '',
            nombre_lugar: event.nombre_lugar || '',
            latitud: event.latitud ?? null,
            longitud: event.longitud ?? null,
            imagen: event.imagen || '',
          });
        }
      } catch (err: any) {
        if (isMounted) {
          if (err?.message && (err.message.includes('404') || err.message.toLowerCase().includes('no encontrado'))) {
            setNotFound(true);
            setFetchErrorMessage('El evento no existe o ya fue eliminado.');
          } else {
            setFetchErrorMessage(
              err?.message ||
                'No fue posible conectar con el servidor. Verifica que el backend esté en ejecución y que la URL/IP configurada sea accesible desde el dispositivo.'
            );
          }
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    if (eventId) {
      loadEventData();
    } else {
      setIsFetching(false);
      setNotFound(true);
      setFetchErrorMessage('Identificador de evento inválido.');
    }

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleChange = (field: keyof UpdateEventDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof EventFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof EventFormErrors];
        return next;
      });
    }
  };

  const handleCategorySelect = (categoria: EventCategory) => {
    handleChange('id_categoria', categoria.id_categoria);
    setShowCategoryModal(false);
  };

  const updateCombinedDateTime = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      const combined = `${dateStr} ${timeStr}:00`;
      handleChange('fecha', combined);
    } else if (dateStr) {
      const combined = `${dateStr} 08:00:00`;
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

  // Guardar modificaciones (HU014 - PUT /api/events/:id)
  const handleSubmit = async () => {
    setGeneralError(null);

    const payload: UpdateEventDTO = {
      nombre: (formData.nombre || '').trim(),
      id_categoria: Number(formData.id_categoria),
      descripcion: (formData.descripcion || '').trim(),
      direccion: (formData.direccion || '').trim(),
      fecha: formData.fecha || '',
      cupo: Number(formData.cupo),
      vacantes_voluntarios: Number(formData.vacantes_voluntarios),
      vacantes_beneficiarios: Number(formData.vacantes_beneficiarios),
      ayuda_ofrecida: (formData.ayuda_ofrecida || '').trim(),
      organizacion_id: Number(formData.organizacion_id) || 1,
      barrio: (formData.barrio || '').trim(),
      localidad: (formData.localidad || '').trim(),
      ciudad: (formData.ciudad || '').trim(),
      departamento: (formData.departamento || '').trim(),
      pais: (formData.pais || 'Colombia').trim(),
      punto_referencia: (formData.punto_referencia || '').trim(),
      nombre_lugar: (formData.nombre_lugar || '').trim(),
      latitud: formData.latitud ?? null,
      longitud: formData.longitud ?? null,
      imagen: (formData.imagen || '').trim(),
    };

    const validation = validateUpdateEvent(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setGeneralError('Por favor revisa los campos señalados antes de guardar los cambios.');
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      await updateEvent(eventId, payload);
      setIsSaving(false);
      setSuccessModalVisible(true);
    } catch (err: any) {
      setIsSaving(false);
      if (err?.message && err.message.includes('404')) {
        setGeneralError('El evento no existe o ya fue eliminado.');
      } else {
        const msg =
          err?.message ||
          'No fue posible actualizar el evento. Verifica la información e inténtalo nuevamente.';
        setGeneralError(msg);
      }
    }
  };

  // Abrir modal de confirmación de eliminación (HU015)
  const handleOpenDeleteConfirm = () => {
    setShowDeleteConfirmModal(true);
  };

  // Ejecutar eliminación (HU015 - DELETE /api/events/:id)
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setGeneralError(null);

    try {
      await deleteEvent(eventId);
      setIsDeleting(false);
      setShowDeleteConfirmModal(false);
      setDeleteSuccessModalVisible(true);
    } catch (err: any) {
      setIsDeleting(false);
      setShowDeleteConfirmModal(false);

      if (err?.message && err.message.includes('404')) {
        setGeneralError('El evento no existe o ya fue eliminado previamente.');
      } else if (err?.message && err.message.includes('500')) {
        setGeneralError('No fue posible eliminar el evento debido a un problema en el servidor. Inténtalo de nuevo más tarde.');
      } else {
        const msg =
          err?.message ||
          'No fue posible conectar con el servidor. Verifica que el backend esté en ejecución y que la URL/IP configurada sea accesible desde el dispositivo.';
        setGeneralError(msg);
      }
    }
  };

  const selectedCategoryName =
    EVENT_CATEGORIES.find((c) => c.id_categoria === formData.id_categoria)?.nombre ||
    'Seleccionar categoría';

  // Renderizado durante carga inicial
  if (isFetching) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner message={`Cargando información del evento #${eventId}...`} />
      </View>
    );
  }

  // Renderizado si el evento no existe o hubo error de consulta
  if (notFound || fetchErrorMessage) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <View style={styles.errorIconBadge}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
          <Text style={styles.errorCardTitle}>
            {notFound ? 'Evento no encontrado' : 'Error al cargar'}
          </Text>
          <Text style={styles.errorCardMessage}>
            {fetchErrorMessage || 'El evento no existe o ya fue eliminado.'}
          </Text>
          {onBack && (
            <CustomButton
              title="← Volver al panel"
              onPress={onBack}
              variant="primary"
              style={styles.backFullBtn}
            />
          )}
        </View>
      </View>
    );
  }

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
          <View style={styles.badgeRow}>
            <Text style={styles.headerBadge}>HU014 • HU015 • GESTIÓN</Text>
            <Text style={styles.idBadge}>ID #{eventId}</Text>
          </View>
          <Text style={styles.title}>Editar evento</Text>
          <Text style={styles.subtitle}>
            Modifica los datos del evento o elimínalo si ya no se llevará a cabo.
          </Text>
        </View>

        {/* BANNER DE ERROR GENERAL */}
        {generalError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerTitle}>Atención</Text>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        )}

        {/* SECCIÓN 1: INFORMACIÓN PRINCIPAL */}
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
                errors.id_categoria ? styles.categorySelectorError : null,
              ]}
            >
              <Text style={styles.categorySelectorText}>{selectedCategoryName}</Text>
              <Text style={styles.categorySelectorArrow}>▼</Text>
            </Pressable>
            {errors.id_categoria ? (
              <Text style={styles.fieldErrorText}>{errors.id_categoria}</Text>
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
            value={formData.ayuda_ofrecida}
            onChangeText={(val) => handleChange('ayuda_ofrecida', val)}
            error={errors.ayuda_ofrecida}
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
                value={formData.vacantes_voluntarios?.toString()}
                onChangeText={(val) =>
                  handleChange('vacantes_voluntarios', val.replace(/[^0-9]/g, ''))
                }
                keyboardType="number-pad"
                error={errors.vacantes_voluntarios}
                required
              />
            </View>
            <View style={styles.colSpacing} />
            <View style={styles.col}>
              <CustomInput
                label="Vacantes Beneficiarios"
                placeholder="Ej: 15"
                value={formData.vacantes_beneficiarios?.toString()}
                onChangeText={(val) =>
                  handleChange('vacantes_beneficiarios', val.replace(/[^0-9]/g, ''))
                }
                keyboardType="number-pad"
                error={errors.vacantes_beneficiarios}
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
            helperText="Puedes actualizar la URL de la imagen promocional."
          />
        </View>

        {/* BOTONES DE ACCIÓN PRINCIPALES (HU014) */}
        <View style={styles.actionContainer}>
          <CustomButton
            title="Guardar cambios"
            onPress={handleSubmit}
            isLoading={isSaving}
            disabled={isDeleting}
            variant="primary"
          />

          {onBack && (
            <CustomButton
              title="Cancelar"
              onPress={onBack}
              variant="outline"
              disabled={isSaving || isDeleting}
              style={styles.cancelBtn}
            />
          )}
        </View>

        {/* ZONA DE PELIGRO: ELIMINAR EVENTO (HU015) */}
        <View style={styles.dangerZoneCard}>
          <Text style={styles.dangerZoneTitle}>Zona de peligro</Text>
          <Text style={styles.dangerZoneSubtitle}>
            Si esta actividad ya no se llevará a cabo, puedes eliminarla definitivamente de la plataforma.
          </Text>
          <CustomButton
            title="🗑 Eliminar evento"
            onPress={handleOpenDeleteConfirm}
            variant="danger"
            disabled={isSaving || isDeleting}
            style={styles.deleteButton}
          />
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
                    formData.id_categoria === cat.id_categoria &&
                      styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      formData.id_categoria === cat.id_categoria &&
                        styles.categoryItemTextSelected,
                    ]}
                  >
                    {cat.nombre}
                  </Text>
                  {formData.id_categoria === cat.id_categoria && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN ANTES DE ELIMINAR (HU015) */}
      <Modal
        visible={showDeleteConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) setShowDeleteConfirmModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmModalCard}>
            <View style={styles.deleteWarningBadge}>
              <Text style={styles.deleteWarningIcon}>🗑</Text>
            </View>
            <Text style={styles.deleteModalTitle}>¿Estás seguro de eliminar este evento?</Text>
            <Text style={styles.deleteModalMessage}>
              Esta acción no se puede deshacer. El evento{formData.nombre ? ` "${formData.nombre}"` : ''} será eliminado de la plataforma Give & Go.
            </Text>

            <View style={styles.deleteModalActions}>
              <CustomButton
                title="Confirmar eliminación"
                onPress={handleConfirmDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
                variant="danger"
                style={styles.confirmDeleteBtn}
              />
              <CustomButton
                title="Cancelar"
                onPress={() => setShowDeleteConfirmModal(false)}
                disabled={isDeleting}
                variant="outline"
                style={styles.cancelDeleteBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ÉXITO DE ELIMINACIÓN (HU015) */}
      <Modal
        visible={deleteSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setDeleteSuccessModalVisible(false);
          if (onSuccess) onSuccess();
          else if (onBack) onBack();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.deleteSuccessIconBadge}>
              <Text style={styles.deleteSuccessIconText}>✓</Text>
            </View>
            <Text style={styles.successModalTitle}>Evento eliminado correctamente</Text>
            <Text style={styles.successModalMessage}>
              El evento ha sido eliminado de Give & Go.
            </Text>
            <CustomButton
              title="Aceptar"
              onPress={() => {
                setDeleteSuccessModalVisible(false);
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

      {/* MODAL DE ÉXITO DE ACTUALIZACIÓN (HU014) */}
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
            <Text style={styles.successModalTitle}>Evento actualizado correctamente.</Text>
            <Text style={styles.successModalMessage}>
              Los cambios en "{formData.nombre}" han sido guardados exitosamente en la plataforma Give & Go.
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    letterSpacing: 0.6,
  },
  idBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#E2E8F0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 8,
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
    marginBottom: 16,
  },
  cancelBtn: {
    marginTop: 12,
  },
  dangerZoneCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  dangerZoneTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9F1239',
    marginBottom: 4,
  },
  dangerZoneSubtitle: {
    fontSize: 12,
    color: '#881337',
    lineHeight: 18,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#E11D48',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
  deleteConfirmModalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  deleteWarningBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE4E6',
    borderWidth: 2,
    borderColor: '#FDA4AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteWarningIcon: {
    fontSize: 26,
  },
  deleteModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  deleteModalActions: {
    width: '100%',
  },
  confirmDeleteBtn: {
    width: '100%',
    backgroundColor: '#E11D48',
  },
  cancelDeleteBtn: {
    width: '100%',
    marginTop: 10,
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
  deleteSuccessIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    borderWidth: 3,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteSuccessIconText: {
    fontSize: 30,
    color: '#DC2626',
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
  errorCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    elevation: 2,
  },
  errorIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorIconText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#DC2626',
  },
  errorCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorCardMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  backFullBtn: {
    width: '100%',
  },
});
