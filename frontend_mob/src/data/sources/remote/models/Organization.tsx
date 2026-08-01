export interface Organization {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  email: string;
  descripcion?: string;
  logo?: string;
  estado: 'pendiente' | 'activa' | 'inactiva';
  fechaRegistro: Date;
  administradorId: string;
  proyectosActivos?: number;
}

export interface OrganizationRegisterRequest {
  nombre: string;
  nit: string;
  direccion: string;
  email: string;
  password: string;
}

export interface OrganizationUpdateRequest {
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  logo?: string;
}

export interface OrganizationListResponse {
  items: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}