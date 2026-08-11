import React, { useState } from 'react';
import { 
  Type, 
  MapPin, 
  Users, 
  Send, 
  RotateCcw, 
  Calendar, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { CustomInput } from '../components/common/CustomInput';
import { CustomTextArea } from '../components/common/CustomTextArea';
import { CustomSelect } from '../components/common/CustomSelect';
import { DatePicker } from '../components/common/DatePicker';
import { TimePicker } from '../components/common/TimePicker';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { Toast, ToastMessage } from '../components/common/Toast';
import { createEvent, validateEventPayload } from '../services/eventService';
import { CreateEventDTO, EventCategory, FormErrors, EventItem } from '../types/event';

interface CreateEventScreenProps {
  onNavigateToDashboard: () => void;
  onNavigateToMyEvents: () => void;
  onNavigateToDetail: (event: EventItem) => void;
}

const CATEGORY_OPTIONS: { label: string; value: EventCategory }[] = [
  { label: 'Voluntariado General', value: 'Voluntariado' },
  { label: 'Deporte y Recreación', value: 'Deporte' },
  { label: 'Cultura y Arte', value: 'Cultura y Arte' },
  { label: 'Educación y Capacitación', value: 'Educación' },
  { label: 'Salud y Bienestar', value: 'Salud y Bienestar' },
  { label: 'Medio Ambiente y Ecología', value: 'Medio Ambiente' },
  { label: 'Donación y Colecta', value: 'Donación y Colecta' },
  { label: 'Comunidad e Integración', value: 'Comunidad' },
];

const INITIAL_FORM_STATE: CreateEventDTO = {
  title: '',
  description: '',
  category: '',
  date: '',
  time: '09:00',
  location: '',
  totalCapacity: '',
};

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onNavigateToDashboard,
  onNavigateToMyEvents,
  onNavigateToDetail,
}) => {
  const [formData, setFormData] = useState<CreateEventDTO>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time handler with on-the-fly field validation
  const handleChange = (
    field: keyof CreateEventDTO,
    value: string | number
  ) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    // Validate on change if field was touched
    if (touched[field]) {
      const fieldErrors = validateEventPayload(updatedForm);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field],
      }));
    }
  };

  const handleBlur = (field: keyof CreateEventDTO) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validateEventPayload(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: currentErrors[field],
    }));
  };

  // Action: Publicar Evento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to reveal errors
    const allTouched: Record<string, boolean> = {
      title: true,
      description: true,
      category: true,
      date: true,
      time: true,
      location: true,
      totalCapacity: true,
    };
    setTouched(allTouched);

    const validationErrors = validateEventPayload(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setToast({
        id: `err-${Date.now()}`,
        type: 'error',
        title: 'Formulario incompleto o inválido',
        message: 'Por favor, corrige los campos indicados en rojo antes de publicar.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await createEvent(formData);

      if (response.success && response.data) {
        setToast({
          id: `succ-${Date.now()}`,
          type: 'success',
          title: '¡Evento publicado!',
          message: response.message,
        });

        const createdEvent = response.data;

        // Redirect after short delay so user sees success toast
        setTimeout(() => {
          onNavigateToDetail(createdEvent);
        }, 1200);
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        setToast({
          id: `err-api-${Date.now()}`,
          type: 'error',
          title: 'Error de publicación',
          message: response.message || 'No se pudo registrar el evento.',
        });
      }
    } catch (err) {
      setToast({
        id: `err-catch-${Date.now()}`,
        type: 'error',
        title: 'Error de servidor',
        message: 'Ocurrió un fallo en la conexión con la API de Give&Go.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Cancelar
  const handleCancel = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setToast({
      id: `info-cancel-${Date.now()}`,
      type: 'info',
      title: 'Formulario limpiado',
      message: 'Se han restablecido todos los campos.',
    });
  };

  return (
    <div id="create-event-screen" className="min-h-screen bg-gray-50/50 pb-28 pt-2">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header reutilizable */}
      <Header
        title="Crear Nuevo Evento"
        subtitle="Registra la información completa para publicar en Give&Go"
        showBackButton={true}
        onBackClick={onNavigateToDashboard}
        rightAction={
          <button
            type="button"
            onClick={onNavigateToMyEvents}
            className="text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 py-1.5 px-3 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            Mis Eventos
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {/* Card Contenedor Principal */}
        <Card id="create-event-form-card" className="border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 pb-5 mb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Información del Evento
              </h2>
              <p className="text-xs text-gray-500">
                HU 013: Todos los campos marcados con (*) son obligatorios.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* 1. Nombre del Evento */}
            <CustomInput
              id="event-title-input"
              label="Nombre del evento"
              placeholder="Ej: Colecta Solidaria de Invierno Give&Go"
              required={true}
              icon={<Type className="w-4 h-4" />}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={errors.title}
              helperText="Mínimo 5 caracteres."
            />

            {/* 2. Categoría */}
            <CustomSelect
              id="event-category-select"
              label="Categoría"
              required={true}
              options={CATEGORY_OPTIONS}
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as EventCategory)}
              onBlur={() => handleBlur('category')}
              error={errors.category}
            />

            {/* 3. Descripción */}
            <CustomTextArea
              id="event-description-input"
              label="Descripción del evento"
              placeholder="Describe detalladamente el objetivo del evento, requisitos para los asistentes y actividades a realizar..."
              required={true}
              minChars={20}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={errors.description}
            />

            {/* 4. Fecha y Hora en cuadrícula de 2 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                id="event-date-picker"
                label="Fecha del evento"
                required={true}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
                helperText="No puede ser anterior a la fecha actual."
              />

              <TimePicker
                id="event-time-picker"
                label="Hora de inicio"
                required={true}
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                error={errors.time}
              />
            </div>

            {/* 5. Ubicación */}
            <CustomInput
              id="event-location-input"
              label="Ubicación"
              placeholder="Ej: Av. Principal #123, Centro Comunitario Norte"
              required={true}
              icon={<MapPin className="w-4 h-4" />}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              error={errors.location}
            />

            {/* 6. Cupos Disponibles */}
            <CustomInput
              id="event-capacity-input"
              type="number"
              min="1"
              step="1"
              label="Cupos disponibles"
              placeholder="Ej: 50"
              required={true}
              icon={<Users className="w-4 h-4" />}
              value={formData.totalCapacity}
              onChange={(e) => handleChange('totalCapacity', e.target.value)}
              onBlur={() => handleBlur('totalCapacity')}
              error={errors.totalCapacity}
              helperText="Debe ser un número entero mayor que cero."
            />

            {/* Info Box */}
            <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 flex items-start gap-3 mt-2">
              <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-900 leading-relaxed">
                Al hacer clic en <strong className="font-semibold text-red-700">"Publicar Evento"</strong>, se consumirá la API de Give&Go para almacenar el registro. La comunidad de voluntarios podrá inscribirse inmediatamente.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100 mt-2">
              <PrimaryButton
                id="publish-event-button"
                type="submit"
                isLoading={isLoading}
                icon={<Send className="w-4 h-4" />}
                className="order-1 sm:order-2"
              >
                Publicar Evento
              </PrimaryButton>

              <SecondaryButton
                id="cancel-event-button"
                type="button"
                onClick={handleCancel}
                icon={<RotateCcw className="w-4 h-4" />}
                className="order-2 sm:order-1"
              >
                Cancelar
              </SecondaryButton>
            </div>
          </form>
        </Card>

        {/* Resumen explicativo de requerimientos de HU 013 */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-4 text-xs text-gray-500 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>HU 013 - Registro de Evento con Validaciones y Servicio API</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="text-red-600 hover:underline font-semibold"
          >
            Volver al Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};
