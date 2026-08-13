export type ScreenType = 'DASHBOARD' | 'EVENTOS' | 'MAPA' | 'DONAR' | 'REGISTRO';

export interface Organizacion {
  idOrganizacion: number;
  nombre: string;
  nit: string;
  direccion: string;
  telefono: string;
  correo: string;
  password?: string;
  categoria: string;
  barrio: string;
  localidad: string;
  ciudad: string;
  departamento: string;
  pais: string;
  fechaRegistro: number;
  estadoVerificacion: 'pendiente' | 'verificado' | 'rechazado';
  verificada: number;
}

export interface Evento {
  idEvento: number;
  idOrganizacion: number;
  nombre: string;
  tipo: string;
  fecha: string;
  hora: string;
  sitio: string;
  participantes: number;
  cupoMaximo: number;
  estado: string;
  descripcion: string;
}

export interface Donacion {
  idDonacion: number;
  idOrganizacion: number;
  donante: string;
  monto: number;
  tipo: string;
  fecha: number;
  mensaje: string;
}
