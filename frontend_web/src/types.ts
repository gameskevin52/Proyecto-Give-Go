export type UserRole = 'admin' | 'voluntario' | 'beneficiario' | 'organizacion';

export interface Usuario {
  id: string;
  rol: UserRole;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  correo: string;
  password?: string;
  estado: 'activo' | 'inactivo';
}

export interface Organizacion {
  id: string;
  nombre: string;
  direccion: string;
  correo: string;
  password?: string;
}

export interface Evento {
  id: string;
  nombre: string;
  categoria: string; // id de la categoria o nombre
  descripcion: string;
  fecha: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  organizacionId: string;
}

export interface SeguimientoEvento {
  eventoId: string;
  usuarioId: string;
  fechaRegistro: string;
}

export interface Donacion {
  id: string;
  categoria: string; // e.g., 'Alimentos', 'Salud', 'Educación', 'Económico'
  tipo: 'monetaria' | 'objeto';
  fecha: string;
  usuarioId: string; // ID del voluntario donante
  organizacionId: string; // ID de la organización destino
}

export interface DonacionMonetaria {
  id: string;
  metodo: string; // 'transferencia' | 'tarjeta' | 'paypal'
  cuenta: string;
  valor: number;
  donacionId: string;
}

export interface DonacionObjeto {
  id: string;
  categoria: string;
  descripcion: string;
  cantidad: number;
  donacionId: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}

export interface Solicitud {
  id: string;
  beneficiarioId: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  fecha: string;
}
