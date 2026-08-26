/**
 * Tipos del módulo de Eventos
 * Give & Go Mobile
 *
 * Contrato del backend:
 *
 * GET    /api/events/
 * GET    /api/events/:id
 * POST   /api/events/
 * PUT    /api/events/:id
 * DELETE /api/events/:id
 */

/**
 * Evento recibido desde el backend.
 *
 * El backend utiliza estos nombres en las respuestas.
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
 * DTO utilizado para CREAR eventos.
 *
 * POST /api/events/
 *
 * Estos nombres corresponden al contrato
 * que espera actualmente el backend.
 */
export interface CreateEventDTO {
  nombre: string;
  id_categoria: number;
  descripcion: string;
  direccion: string;
  fecha: string;

  cupo: number;
  vacantes_voluntarios: number;
  vacantes_beneficiarios: number;

  ayuda_ofrecida: string;

  organizacion_id: number;

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
 * DTO utilizado para ACTUALIZAR eventos.
 *
 * PUT /api/events/:id
 */
export interface UpdateEventDTO {
  nombre: string;
  id_categoria: number;
  descripcion: string;
  direccion: string;
  fecha: string;

  cupo: number;
  vacantes_voluntarios: number;
  vacantes_beneficiarios: number;

  ayuda_ofrecida: string;

  organizacion_id: number;

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
 * Categoría de evento.
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
 * Errores de formularios.
 *
 * Se utilizan los mismos nombres
 * que los campos de los DTO.
 */
export interface EventFormErrors {
  nombre?: string;
  id_categoria?: string;
  descripcion?: string;
  direccion?: string;
  fecha?: string;

  cupo?: string;
  vacantes_voluntarios?: string;
  vacantes_beneficiarios?: string;

  ayuda_ofrecida?: string;

  organizacion_id?: string;

  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;

  punto_referencia?: string;
  nombre_lugar?: string;

  latitud?: string;
  longitud?: string;

  imagen?: string;

  general?: string;
}