export interface LoginPayload {
  correo: string;
  password: string;
}

export interface RegisterVolunteerPayload {
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  tipo_documento?: string;
  num_documento?: string;
  fecha_nacimiento?: string;
  correo: string;
  password: string;
  telefono: string;
  direccion?: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  rol: 'Voluntario' | 'voluntario';
}

export interface RegisterBeneficiaryPayload {
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  tipo_documento?: string;
  num_documento?: string;
  fecha_nacimiento?: string;
  correo: string;
  password: string;
  telefono: string;
  direccion?: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  rol: 'Beneficiario' | 'beneficiario';
}

export interface RegisterOrganizationPayload {
  nombre: string;
  direccion: string;
  correo: string;
  password: string;
  telefono?: string;
  descripcion?: string;
  nit?: string;
  representante_legal?: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  categoria?: string;
  latitud?: number | null;
  longitud?: number | null;
}

export interface ForgotPasswordPayload {
  correo: string;
  nuevaPassword?: string;
}

