import { apiClient } from '../../../services/api/apiClient';
import { SolicitudAyuda, CreateSolicitudPayload } from '../models/beneficiary.models';

export interface BeneficiaryEventItem {
  id: string;
  id_evento?: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  barrio?: string;
  fecha: string;
  cupo: number;
  vacantesBeneficiarios?: number;
  ayudaOfrecida?: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  organizacionId: string;
  organizacionNombre?: string;
}

export interface BeneficiaryPostulacionItem {
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
  tipoPostulacion: 'beneficiario' | 'voluntario';
  estadoPostulacion: 'pendiente' | 'aprobado' | 'rechazado' | 'confirmado' | 'cancelado';
  fechaPostulacion: string;
  fechaAprobacion?: string | null;
  fechaConfirmacion?: string | null;
  observaciones?: string;
}

export const extractBeneficiaryUserId = (user: any): string => {
  const raw = user?.id_usuario ?? user?.usuarioId ?? user?.id ?? '';
  return String(raw).replace('usr_', '').replace('org_', '');
};

export const beneficiaryService = {
  async getActiveEvents(): Promise<BeneficiaryEventItem[]> {
    const res = await apiClient.get('/events');
    const list = res.data?.data || [];
    if (!Array.isArray(list)) return [];
    return list.filter((e: any) => {
      if (e.estado !== 'activo') return false;
      const aud = String(e.publicoObjetivo || e.publico_objetivo || '').toLowerCase();
      if (aud === 'voluntarios') return false;
      const vacBen = e.vacantesBeneficiarios ?? e.vacantes_beneficiarios;
      const vacVol = e.vacantesVoluntarios ?? e.vacantes_voluntarios;
      if (vacBen !== undefined && Number(vacBen) <= 0 && Number(vacVol || 0) > 0 && aud !== 'beneficiarios') {
        return false;
      }
      return true;
    });
  },

  async getMyPostulaciones(userId: string | number): Promise<BeneficiaryPostulacionItem[]> {
    const cleanId = String(userId).replace('usr_', '').replace('org_', '');
    if (!cleanId) return [];
    const res = await apiClient.get(`/postulaciones/usuario/${cleanId}`, {
      params: { tipo: 'beneficiario' },
    });
    const list = res.data?.data || [];
    return Array.isArray(list) ? list : [];
  },

  async applyToEvent(payload: {
    id_evento: string | number;
    id_usuario: string | number;
    observaciones?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const cleanUserId = String(payload.id_usuario).replace('usr_', '').replace('org_', '');
    const res = await apiClient.post('/postulaciones', {
      id_evento: payload.id_evento,
      id_usuario: cleanUserId,
      tipo_postulacion: 'beneficiario',
      observaciones: payload.observaciones || 'Postulación registrada por el beneficiario.',
    });
    return res.data;
  },

  async confirmAttendance(postulacionId: string | number): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.put(`/postulaciones/${postulacionId}/estado`, {
      estado_postulacion: 'confirmado',
      observaciones: 'Asistencia confirmada por el beneficiario.',
    });
    return res.data;
  },

  async withdrawPostulacion(postulacionId: string | number): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.delete(`/postulaciones/${postulacionId}`);
    return res.data;
  },
};

export const beneficiaryFeatureService = {
  async getMyRequests(): Promise<SolicitudAyuda[]> {
    const res = await apiClient.get('/requests/me');
    const list = res.data?.data || [];
    return Array.isArray(list) ? list : [];
  },

  async createRequest(payload: CreateSolicitudPayload): Promise<{ success: boolean; data?: SolicitudAyuda; message?: string }> {
    const res = await apiClient.post('/requests', payload);
    return res.data;
  },
};

export default beneficiaryService;
