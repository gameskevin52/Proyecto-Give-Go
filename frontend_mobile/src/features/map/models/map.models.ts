export interface MapLocationItem {
  id: string | number;
  tipo: 'organizacion' | 'evento';
  titulo: string;
  subtitulo?: string;
  categoria: string;
  direccion: string;
  barrio?: string;
  localidad?: string;
  ciudad?: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  correo?: string;
  verificada?: boolean;
  cupos_disponibles?: number;
  fecha?: string;
  hora?: string;
  ayuda_ofrecida?: string;
  distanciaKm?: number;
}
