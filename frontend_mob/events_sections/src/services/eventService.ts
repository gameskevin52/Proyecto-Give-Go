import { EventItem, CreateEventDTO, ApiResponse, FormErrors } from '../types/event';

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    title: 'Colecta Anual de Alimentos Give&Go',
    description: 'Jornada masiva de recolección y embalaje de víveres no perecibles para comedores comunitarios en la zona norte.',
    category: 'Donación y Colecta',
    date: '2026-08-15',
    time: '09:00',
    location: 'Plaza Principal de la Ciudad, Sector Centro',
    totalCapacity: 50,
    registeredCount: 32,
    status: 'Publicado',
    createdAt: new Date().toISOString(),
    organizationName: 'Fundación Give&Go',
  },
  {
    id: 'evt-102',
    title: 'Taller de Alfabetización Digital para Adultos Mayores',
    description: 'Capacitación práctica en el uso de smartphones, aplicaciones de mensajería y trámites en línea para la tercera edad.',
    category: 'Educación',
    date: '2026-08-20',
    time: '15:30',
    location: 'Centro Comunitario Esperanza, Av. Libertad 450',
    totalCapacity: 25,
    registeredCount: 18,
    status: 'Publicado',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    organizationName: 'Fundación Give&Go',
  },
  {
    id: 'evt-103',
    title: 'Jornada Ecológica: Reforestación del Parque Central',
    description: 'Actividad de siembra de 200 árboles nativos y limpieza de áreas verdes con voluntarios de la comunidad.',
    category: 'Medio Ambiente',
    date: '2026-08-28',
    time: '08:00',
    location: 'Parque Ecologico Metropolitano, Entrada 2',
    totalCapacity: 100,
    registeredCount: 85,
    status: 'Publicado',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    organizationName: 'Fundación Give&Go',
  }
];

const STORAGE_KEY = 'giveandgo_events_v1';

const getStoredEvents = (): EventItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events from localStorage:', error);
    return INITIAL_EVENTS;
  }
};

const saveStoredEvents = (events: EventItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

/**
 * Validates backend rules for creating an event
 */
export const validateEventPayload = (dto: CreateEventDTO): FormErrors => {
  const errors: FormErrors = {};

  // Nombre del evento
  if (!dto.title || !dto.title.trim()) {
    errors.title = 'El nombre del evento es obligatorio.';
  } else if (dto.title.trim().length < 5) {
    errors.title = 'El nombre debe contener mínimo 5 caracteres.';
  }

  // Descripción
  if (!dto.description || !dto.description.trim()) {
    errors.description = 'La descripción es obligatoria.';
  } else if (dto.description.trim().length < 20) {
    errors.description = 'La descripción debe contener mínimo 20 caracteres.';
  }

  // Categoría
  if (!dto.category) {
    errors.category = 'Debe seleccionar una categoría.';
  }

  // Fecha
  if (!dto.date) {
    errors.date = 'La fecha del evento es obligatoria.';
  } else {
    const selectedDate = new Date(`${dto.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      errors.date = 'Ingrese una fecha válida.';
    } else if (selectedDate < today) {
      errors.date = 'La fecha no puede ser anterior a la fecha actual.';
    }
  }

  // Hora
  if (!dto.time) {
    errors.time = 'La hora del evento es obligatoria.';
  }

  // Ubicación
  if (!dto.location || !dto.location.trim()) {
    errors.location = 'La ubicación no puede quedar vacía.';
  }

  // Cupos disponibles
  const capacityNum = Number(dto.totalCapacity);
  if (dto.totalCapacity === '' || dto.totalCapacity === undefined || dto.totalCapacity === null) {
    errors.totalCapacity = 'Los cupos son obligatorios.';
  } else if (isNaN(capacityNum) || capacityNum <= 0) {
    errors.totalCapacity = 'Los cupos deben ser un número mayor que cero.';
  } else if (!Number.isInteger(capacityNum)) {
    errors.totalCapacity = 'Los cupos deben ser un número entero.';
  }

  return errors;
};

/**
 * Servicio API para crear un evento en el backend de Give&Go.
 * Cumple la especificación de la HU 013 (createEvent).
 */
export const createEvent = async (dto: CreateEventDTO): Promise<ApiResponse<EventItem>> => {
  // Simulamos el retraso de red de la API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validaciones del servidor
  const validationErrors = validateEventPayload(dto);
  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      message: 'Existen errores de validación en la solicitud.',
      errors: validationErrors,
    };
  }

  try {
    const currentEvents = getStoredEvents();

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category as any,
      date: dto.date,
      time: dto.time,
      location: dto.location.trim(),
      totalCapacity: Number(dto.totalCapacity),
      registeredCount: 0,
      status: 'Publicado',
      createdAt: new Date().toISOString(),
      organizationName: 'Fundación Give&Go',
    };

    const updatedEvents = [newEvent, ...currentEvents];
    saveStoredEvents(updatedEvents);

    return {
      success: true,
      data: newEvent,
      message: '¡Evento registrado y publicado exitosamente en Give&Go!',
    };
  } catch (err) {
    console.error('API Error in createEvent:', err);
    return {
      success: false,
      message: 'Ocurrió un error inesperado al conectar con el servidor de Give&Go.',
    };
  }
};

/**
 * Obtener todos los eventos
 */
export const getEvents = async (): Promise<ApiResponse<EventItem[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const events = getStoredEvents();
  return {
    success: true,
    data: events,
    message: 'Eventos obtenidos correctamente.',
  };
};

/**
 * Obtener detalle de un evento por ID
 */
export const getEventById = async (id: string): Promise<ApiResponse<EventItem>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const events = getStoredEvents();
  const found = events.find((e) => e.id === id);

  if (!found) {
    return {
      success: false,
      message: 'El evento solicitado no existe.',
    };
  }

  return {
    success: true,
    data: found,
    message: 'Detalle del evento obtenido correctamente.',
  };
};

/**
 * Eliminar / Cancelar evento
 */
export const deleteEvent = async (id: string): Promise<ApiResponse<boolean>> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const events = getStoredEvents();
  const filtered = events.filter((e) => e.id !== id);
  saveStoredEvents(filtered);

  return {
    success: true,
    data: true,
    message: 'Evento eliminado correctamente.',
  };
};
