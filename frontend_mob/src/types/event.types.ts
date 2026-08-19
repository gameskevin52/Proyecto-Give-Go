/**
 * Tipos del módulo de Eventos de Give & Go Mobile.
 *
 * IMPORTANTE:
 * Estos tipos representan el contrato REAL que devuelve/recibe
 * el eventController.ts del backend.
 */

/**
 * Evento recibido desde el backend.
 *
 * GET /api/events/
 * GET /api/events/:id
 * POST /api/events/
 * PUT /api/events/:id
 */
export interface Evento {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  fecha: string;

  cupo: number;
  vacantesVoluntarios: number;
  vacantesBeneficiarios: number;

  ayudaOfrecida: string;
  estado: 'activo' | 'finalizado' | 'cancelado';

  organizacionId: string;
  organizacionNombre: string;

  barrio: string;
  localidad: string;
  ciudad: string;
  departamento: string;
  pais: string;

  punto_referencia: string;
  nombre_lugar: string;

  latitud: number | null;
  longitud: number | null;

  imagen: string;
}

/**
 * Payload REAL que espera el backend para crear un evento.
 *
 * POST /api/events/
 *
 * El backend busca la categoría utilizando:
 *   categoria
 *
 * y la organización utilizando:
 *   organizacionId
 */
export interface CreateEventDTO {
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  fecha: string;

  cupo: number;
  vacantesVoluntarios: number;
  vacantesBeneficiarios: number;

  ayudaOfrecida: string;

  organizacionId: string;

  estado?: 'activo' | 'finalizado' | 'cancelado';

  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;

  punto_referencia?: string;
  nombre_lugar?: string;

  latitud?: number | null;
  longitud?: number | null;

  imagen?: string;
}

/**
 * Payload REAL que espera el backend para actualizar.
 *
 * PUT /api/events/:id
 */
export interface UpdateEventDTO {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  direccion?: string;
  fecha?: string;

  cupo?: number;
  vacantesVoluntarios?: number;
  vacantesBeneficiarios?: number;

  ayudaOfrecida?: string;

  organizacionId?: string;

  estado?: 'activo' | 'finalizado' | 'cancelado';

  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;

  punto_referencia?: string;
  nombre_lugar?: string;

  latitud?: number | null;
  longitud?: number | null;

  imagen?: string;
}

/**
 * Categoría del evento.
 */
export interface EventCategory {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

/**
 * Respuesta estándar del backend.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

/**
 * Errores del formulario.
 */
export interface EventFormErrors {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  direccion?: string;
  fecha?: string;
  cupo?: string;
  vacantesVoluntarios?: string;
  vacantesBeneficiarios?: string;
  ayudaOfrecida?: string;
  ciudad?: string;
  general?: string;
}