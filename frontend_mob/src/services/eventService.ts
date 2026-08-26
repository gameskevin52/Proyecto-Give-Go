/**
 * Servicio de Eventos - Give & Go Mobile
 *
 * CONTRATO REAL DEL BACKEND
 *
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
} from '../types/event.types';

/**
 * Respuesta estándar del backend.
 */
export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

/**
 * HU017
 * Obtener todos los eventos.
 *
 * GET /api/events/
 */
export async function getAllEvents(): Promise<BackendResponse<Evento[]>> {
  return apiRequest<BackendResponse<Evento[]>>('/events/');
}

/**
 * HU016
 * Obtener un evento por su ID.
 *
 * GET /api/events/:id
 */
export async function getEventById(
  id: string
): Promise<BackendResponse<Evento>> {
  return apiRequest<BackendResponse<Evento>>(`/events/${id}`);
}

/**
 * HU013
 * Crear un evento.
 *
 * POST /api/events/
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
 * HU014
 * Actualizar un evento.
 *
 * PUT /api/events/:id
 */
export async function updateEvent(
  id: string,
  eventData: UpdateEventDTO
): Promise<BackendResponse<Evento>> {
  return apiRequest<BackendResponse<Evento>>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

/**
 * HU015
 * Eliminar un evento.
 *
 * DELETE /api/events/:id
 */
export async function deleteEvent(
  id: string
): Promise<BackendResponse<{ id: string }>> {
  return apiRequest<BackendResponse<{ id: string }>>(`/events/${id}`, {
    method: 'DELETE',
  });
}