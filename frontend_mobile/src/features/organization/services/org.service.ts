import { apiClient } from '../../../services/api/apiClient';
import {
  AdminEventItem,
  AdminDonationItem,
  AdminCategoryItem,
  AdminVerificationItem,
} from '../../admin/models/admin.models';

export interface OrgPostulacionItem {
  id: string;
  eventoId: string;
  eventoNombre: string;
  eventoFecha: string;
  eventoDireccion: string;
  ayudaOfrecida: string;
  organizacionNombre: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioCorreo: string;
  usuarioTelefono: string;
  tipoPostulacion: 'voluntario' | 'beneficiario';
  estadoPostulacion: 'pendiente' | 'aprobado' | 'rechazado' | 'confirmado' | 'cancelado';
  fechaPostulacion: string;
  observaciones?: string;
}

export interface OrgVolunteerAssoc {
  id: string;
  postulacionId?: string;
  eventoId?: string;
  usuarioId?: string;
  nombre: string;
  correo: string;
  telefono: string;
  eventoNombre: string;
  fechaPostulacion?: string;
  estado?: string;
  observaciones?: string;
}

export const isMyOrgEvent = (evtOrgId: string | number | undefined, user: any): boolean => {
  if (!user) return false;
  const rawEvt = String(evtOrgId || '');
  const cleanEvt = rawEvt.replace('org_', '').replace('usr_', '');
  const cleanUserId = String(user.id || '').replace('org_', '').replace('usr_', '');
  const cleanOrgId = user.organizacionId ? String(user.organizacionId).replace('org_', '').replace('usr_', '') : '';
  const cleanIdOrg = user.id_organizacion ? String(user.id_organizacion) : '';
  return (
    (cleanEvt !== '' && cleanEvt === cleanUserId) ||
    (cleanOrgId !== '' && cleanEvt === cleanOrgId) ||
    (cleanIdOrg !== '' && cleanEvt === cleanIdOrg) ||
    rawEvt === String(user.id) ||
    rawEvt === String(user.organizacionId)
  );
};

export const resolveOrgId = (user: any): string => {
  if (user?.organizacionId) return String(user.organizacionId);
  if (user?.id_organizacion) return `org_${user.id_organizacion}`;
  if (user?.id && String(user.id).startsWith('org_')) return String(user.id);
  return String(user?.id || user?.id_usuario || '');
};

export const orgService = {
  async getVerificationStatus(orgId: string | number): Promise<{
    verificada: boolean;
    estadoVerificacion: 'no_solicitado' | 'pendiente' | 'aprobada' | 'rechazada';
    activeRequest: AdminVerificationItem | null;
  }> {
    const res = await apiClient.get(`/verifications/org/${orgId}`);
    return res.data?.data || { verificada: false, estadoVerificacion: 'no_solicitado', activeRequest: null };
  },

  async requestVerification(payload: {
    organizacionId: string | number;
    nit: string;
    mensaje: string;
    documentos: string;
  }): Promise<{ success: boolean; message?: string; data?: AdminVerificationItem }> {
    const res = await apiClient.post('/verifications/request', payload);
    return res.data;
  },

  async getAllEvents(): Promise<AdminEventItem[]> {
    const res = await apiClient.get('/events');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async getCategories(): Promise<AdminCategoryItem[]> {
    const res = await apiClient.get('/categories');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async createEvent(payload: any): Promise<{ success: boolean; message?: string; data?: AdminEventItem }> {
    const res = await apiClient.post('/events', payload);
    return res.data;
  },

  async updateEvent(id: string | number, payload: any): Promise<{ success: boolean; message?: string; data?: AdminEventItem }> {
    const res = await apiClient.put(`/events/${id}`, payload);
    return res.data;
  },

  async deleteEvent(id: string | number): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  },

  async getOrgDonations(orgId: string | number): Promise<AdminDonationItem[]> {
    const res = await apiClient.get(`/donations/organization/${orgId}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async getOrgPostulaciones(orgId: string | number, tipo?: 'voluntario' | 'beneficiario'): Promise<OrgPostulacionItem[]> {
    const res = await apiClient.get(`/postulaciones/organizacion/${orgId}`, {
      params: tipo ? { tipo } : undefined,
    });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async getEventParticipants(eventId: string | number): Promise<any[]> {
    const res = await apiClient.get(`/events/${eventId}/participants`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async updatePostulacionStatus(
    postulacionId: string | number,
    estado: 'aprobado' | 'rechazado' | 'confirmado',
    observaciones?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.put(`/postulaciones/${postulacionId}/estado`, {
      estado_postulacion: estado,
      observaciones: observaciones || `Estado actualizado a ${estado} por la organización.`,
    });
    return res.data;
  },

  async deletePostulacion(postulacionId: string | number): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.delete(`/postulaciones/${postulacionId}`);
    return res.data;
  },

  async unregisterVolunteer(eventId: string | number, usuarioId: string | number): Promise<{ success: boolean; message?: string }> {
    const cleanUserId = String(usuarioId).replace('usr_', '').replace('org_', '');
    const res = await apiClient.post(`/events/${eventId}/unregister`, {
      usuarioId: cleanUserId,
    });
    return res.data;
  },
};

export default orgService;
