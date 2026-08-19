export interface User {
  id?: string | number;
  id_usuario?: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  rol?: string;
  tipo_documento?: string;
  num_documento?: string;
  ciudad?: string;
  departamento?: string;
  direccion?: string;
  session_token?: string;
  token?: string;
  fecha_registro?: string;
}
