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
* Se mantienen tanto los nombres normalizados
* utilizados por la aplicación como los nombres
* que actualmente puede devolver el backend.
  */
  export interface Evento {
  id: string;
  id_evento?: string;

nombre: string;

categoria: string;
id_categoria?: number;
categoria_nombre?: string;

descripcion: string;
direccion: string;
fecha: string;

cupo: number;

vacantesVoluntarios: number;
vacantesBeneficiarios: number;

vacantes_voluntarios?: number;
vacantes_beneficiarios?: number;

ayudaOfrecida: string;
ayuda_ofrecida?: string;

estado: 'activo' | 'finalizado' | 'cancelado';

organizacionId: string;
organizacionNombre: string;

organizacion_id?: string | number;
organizacion_nombre?: string;

barrio: string;
localidad: string;
ciudad: string;
departamento: string;
pais: string;

punto_referencia: string;
nombre_lugar: string;

latitud: number | null;
longitud: number | null;

imagen?: string;
}

/**

* DTO utilizado para CREAR eventos.
*
* POST /api/events/
*
* Estos son los nombres que espera actualmente
* el backend.
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

* Datos utilizados internamente por el formulario
* de creación de eventos.
*
* IMPORTANTE:
* Estos nombres son únicamente para el formulario.
* Antes de enviarlos al backend se transforman
* al formato de CreateEventDTO.
  */
  export interface CreateEventFormData {
  nombre: string;
  categoria: string;

descripcion: string;
direccion: string;
fecha: string;

cupo: number | string;

vacantesVoluntarios: number | string;
vacantesBeneficiarios: number | string;

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

* DTO utilizado para ACTUALIZAR eventos.
*
* PUT /api/events/:id
*
* Estos son los nombres que espera actualmente
* el backend.
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

* Datos utilizados internamente por el formulario
* de edición de eventos.
*
* El formulario utiliza nombres camelCase y permite
* strings porque los valores provienen de TextInput.
  */
  export interface UpdateEventFormData {
  nombre: string;
  categoria: string;

descripcion: string;
direccion: string;
fecha: string;

cupo: number | string;

vacantesVoluntarios: number | string;
vacantesBeneficiarios: number | string;

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
* Se contemplan tanto los nombres utilizados
* internamente por los formularios como los
* nombres del backend.
  */
  export interface EventFormErrors {
  nombre?: string;

categoria?: string;
id_categoria?: string;

descripcion?: string;
direccion?: string;
fecha?: string;

cupo?: string;

vacantesVoluntarios?: string;
vacantesBeneficiarios?: string;

vacantes_voluntarios?: string;
vacantes_beneficiarios?: string;

ayudaOfrecida?: string;
ayuda_ofrecida?: string;

organizacionId?: string;
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
