import { apiClient } from '../../../services/api/apiClient';
import { AdminDonationItem } from '../../admin/models/admin.models';

export interface VolunteerEventItem {
  id: string;
  id_evento?: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  barrio?: string;
  fecha: string;
  cupo: number;
  estado: 'activo' | 'finalizado' | 'cancelado';
  organizacionId: string;
  organizacionNombre?: string;
}

export const extractCleanUserId = (user: any): string => {
  const raw = user?.id_usuario ?? user?.usuarioId ?? user?.id ?? '';
  return String(raw).replace('usr_', '').replace('org_', '');
};

export const volunteerService = {
  async getEnrolledEvents(userId: string | number): Promise<VolunteerEventItem[]> {
    const cleanId = String(userId).replace('usr_', '').replace('org_', '');
    if (!cleanId) return [];
    const res = await apiClient.get(`/events/volunteer/${cleanId}`);
    const list = res.data?.data || [];
    return Array.isArray(list) ? list : [];
  },

  async unregisterEvent(eventId: string | number, userId: string | number): Promise<{ success: boolean; message?: string }> {
    const cleanUserId = String(userId).replace('usr_', '').replace('org_', '');
    const res = await apiClient.post(`/events/${eventId}/unregister`, {
      usuarioId: cleanUserId,
    });
    return res.data;
  },

  async getVolunteerDonations(userId: string | number): Promise<AdminDonationItem[]> {
    const cleanId = String(userId).replace('usr_', '').replace('org_', '');
    if (!cleanId) return [];
    const res = await apiClient.get(`/donations/volunteer/${cleanId}`);
    const list = res.data?.data || [];
    return Array.isArray(list) ? list : [];
  },
};

export default volunteerService;
