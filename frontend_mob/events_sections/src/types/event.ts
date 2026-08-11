export type EventCategory = 
  | 'Voluntariado'
  | 'Deporte'
  | 'Cultura y Arte'
  | 'Educación'
  | 'Salud y Bienestar'
  | 'Medio Ambiente'
  | 'Donación y Colecta'
  | 'Comunidad';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  totalCapacity: number;
  registeredCount: number;
  status: 'Publicado' | 'Borrador' | 'Finalizado' | 'Cancelado';
  createdAt: string;
  organizationName: string;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  category: EventCategory | '';
  date: string;
  time: string;
  location: string;
  totalCapacity: number | string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  totalCapacity?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: FormErrors;
}
