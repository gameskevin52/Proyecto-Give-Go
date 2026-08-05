export type UserRole = 'Voluntario' | 'Beneficiario' | 'Organizacion' | 'Admin';

export type DocumentType = 'CC' | 'CE' | 'Pasaporte' | 'NIT' | 'PEP';

export interface UsuarioForm {
  rol: UserRole;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  tipo_documento: DocumentType;
  num_documento: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  password: string;
  confirmPassword: string;
  direccion: string;
  barrio: string;
  localidad: string;
  ciudad: string;
  departamento: string;
  pais: string;
  codigo_postal: string;
  foto: string;
  biografia: string;
  sitio_web: string;
  mision: string;
  vision: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export interface UsuarioDB {
  id_usuario: number;
  rol: UserRole;
  nombre1: string;
  nombre2?: string | null;
  apellido1: string;
  apellido2?: string | null;
  tipo_documento?: string | null;
  num_documento?: string | null;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
  correo: string;
  password_cifrada: string;
  direccion?: string | null;
  barrio?: string | null;
  localidad?: string | null;
  ciudad: string;
  departamento: string;
  pais: string;
  codigo_postal?: string | null;
  foto?: string | null;
  biografia?: string | null;
  sitio_web?: string | null;
  mision?: string | null;
  vision?: string | null;
  estado: number;
  fecha_registro: string;
}
