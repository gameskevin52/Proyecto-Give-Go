export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalDonations: number;
  pendingVerifications: number;
}

export type SupportedRole = 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion' | 'admin' | 'voluntario' | 'beneficiario' | 'organizacion';

export interface AdminUserItem {
  id: string | number;
  id_usuario?: number | string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  correo: string;
  rol: SupportedRole;
  estado: number | string;
  telefono?: string;
  barrio?: string;
  direccion?: string;
  localidad?: string;
  ciudad?: string;
  fecha_registro?: string;
  fechaRegistro?: string;
}

export interface CreateUserPayload {
  rol: 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion' | 'admin' | 'voluntario' | 'beneficiario' | 'organizacion';
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo: string;
  password?: string;
  estado?: number | string;
  barrio?: string;
  direccion?: string;
}

export interface AdminAuditItem {
  id_audit: number;
  fecha: string;
  accion: string;
  nombre_usuario: string;
  rol_usuario: string;
}

export interface AdminOrgItem {
  id: string;
  nombre: string;
  direccion: string;
  correo: string;
  telefono?: string;
  password?: string;
  logo?: string;
  verificada?: boolean | number;
  estadoVerificacion?: 'no_solicitado' | 'pendiente' | 'aprobada' | 'rechazada';
  nit?: string;
  localidad?: string;
  barrio?: string;
  totalEventos?: number;
  totalDonaciones?: number;
}

export interface AdminVerificationItem {
  id: string;
  id_solicitud?: number;
  organizacionId: string;
  id_organizacion?: number;
  nombreOrganizacion: string;
  correoOrganizacion: string;
  nit: string;
  mensaje: string;
  documentos: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  respuestaAdmin?: string;
  fechaSolicitud: string;
  fechaRespuesta?: string | null;
}

export interface AdminEventItem {
  id: string;
  id_evento?: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  fecha: string;
  cupo: number;
  vacantes_voluntarios?: number;
  vacantes_beneficiarios?: number;
  ayuda_ofrecida?: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  organizacionId: string;
  organizacionNombre?: string;
  imagen?: string;
  barrio?: string;
  localidad?: string;
}

export interface AdminDonationItem {
  id: string;
  categoria: string;
  tipo: 'monetaria' | 'objeto';
  fecha: string;
  usuarioId: string;
  usuarioNombre?: string;
  organizacionId: string;
  organizacionNombre?: string;
  monetaria?: {
    valor: number;
    metodoPago?: string;
    cuenta?: string;
  };
  objeto?: {
    categoria: string;
    cantidad: number;
    descripcion: string;
  };
}

export interface AdminCategoryItem {
  id: string;
  id_categoria?: number;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}


