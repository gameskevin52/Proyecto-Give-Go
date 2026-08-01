export interface OrganizationEntity {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  email: string;
  descripcion: string;
  logo: string;
  estado: 'pendiente' | 'activa' | 'inactiva';
  fechaRegistro: Date;
  administradorId: string;
  proyectosActivos: number;
}

export interface OrganizationRegisterEntity {
  nombre: string;
  nit: string;
  direccion: string;
  email: string;
  password: string;
}

export interface OrganizationUpdateEntity {
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  logo?: string;
}