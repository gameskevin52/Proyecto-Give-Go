export interface Event {
  id_eventos?: number;

  nombre_eventos: string;

  categoria_eventos: string;

  descripcion_eventos: string;

  fecha_evento: string;

  estado_evento: 0 | 1;

  id_Organizaciones: number;
}