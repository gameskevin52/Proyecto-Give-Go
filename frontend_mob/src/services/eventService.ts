/**
 * Servicio de Eventos - Give & Go Mobile
 *
 * Este archivo adapta Mobile al contrato REAL del backend.
 *
 * Backend:
 * GET    /api/events/
 * GET    /api/events/:id
 * POST   /api/events/
 * PUT    /api/events/:id
 * DELETE /api/events/:id
 */

import { apiRequest } from './api';
import {
  CreateEventDTO,
  UpdateEventDTO,
  Evento,
  ApiResponse,
} from '../types/event.types';

/**
 * Respuesta estándar del backend.
 */
interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

/**
 * HU017
 * Listar todos los eventos.
 *
 * GET /api/events/
 */
export async function getAllEvents(): Promise<BackendResponse<Evento[]>> {
  return apiRequest<BackendResponse<Evento[]>>('/events/');
}

/**
 * HU013
 * Crear evento.
 *
 * POST /api/events/
 *
 * Los nombres enviados aquí deben coincidir
 * con los que recibe eventController.ts.
 */
export async function createEvent(
  eventData: CreateEventDTO
): Promise<BackendResponse<Evento>> {
  return apiRequest<BackendResponse<Evento>>('/events/', {
    method: 'POST',
    body: JSON.stringify({
      ...eventData,
      fecha: eventData.fecha.replace(' ', 'T'),
    }),
  });
}

/**
 * HU016
 * Consultar evento por ID.
 *
 * GET /api/events/:id
 */
export async function getEventById(
  id: number
): Promise<BackendResponse<Evento>> {
  return apiRequest<BackendResponse<Evento>>(`/events/${id}`);
}

/**
 * HU014
 * Actualizar evento.
 *
 * PUT /api/events/:id
 */
export async function updateEvent(
  id: number,
  eventData: UpdateEventDTO
): Promise<BackendResponse<Evento>> {
  return apiRequest<BackendResponse<Evento>>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

/**
 * HU015
 * Eliminar evento.
 *
 * DELETE /api/events/:id
 */
export async function deleteEvent(
  id: number
): Promise<BackendResponse<{ id: string }>> {
  return apiRequest<BackendResponse<{ id: string }>>(
    `/events/${id}`,
    {
      method: 'DELETE',
    }
  );
}