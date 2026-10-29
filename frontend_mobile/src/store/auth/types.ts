export interface User {
  id_usuario: number;
  id?: number | string;
  rol: 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion' | 'admin' | 'voluntario' | 'beneficiario' | 'organizacion';
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  foto?: string;
  estado: number;
  verificada?: boolean;
  organizacionId?: string | number;
  id_organizacion?: number;
  nit?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (correo: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerOrganization: (orgData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

