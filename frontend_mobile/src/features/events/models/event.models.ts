export interface Evento {
  id_evento: number;
  id?: string | number;
  id_organizacion?: number;
  nombre_organizacion?: string;
  organizacionNombre?: string;
  organizacion_verificada?: boolean;
  id_categoria: number;
  categoriaId?: string | number;
  nombre_categoria?: string;
  categoria?: string;
  titulo: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha?: string;
  fecha_fin?: string;
  hora_inicio?: string;
  hora_fin?: string;
  cupo_maximo?: number;
  cupo?: number;
  cupos_disponibles?: number;
  cupos_ocupados?: number;
  vacantes_voluntarios?: number;
  vacantesVoluntarios?: number;
  vacantes_beneficiarios?: number;
  vacantesBeneficiarios?: number;
  ayuda_ofrecida?: string;
  ayudaOfrecida?: string;
  nombre_lugar?: string;
  punto_referencia?: string;
  direccion?: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  latitud?: number | null;
  longitud?: number | null;
  estado: string | number;
  imagen_url?: string;
  imagen?: string;
}

export interface Postulacion {
  id_postulacion: number;
  id_evento: number;
  id_usuario: number;
  tipo: 'voluntario' | 'beneficiario';
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado';
  fecha_registro: string;
  evento_titulo?: string;
  usuario_nombre?: string;
}
