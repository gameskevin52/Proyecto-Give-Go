import apiClient from '../../../config/api';
import {
  AdminStats,
  AdminUserItem,
  AdminAuditItem,
  CreateUserPayload,
  AdminOrgItem,
  AdminVerificationItem,
  AdminEventItem,
  AdminDonationItem,
  AdminCategoryItem,
} from '../models/admin.models';

const normalizeUser = (u: any): AdminUserItem => {
  const rawId = u.id || u.id_usuario || Math.random().toString();
  const rawRole = String(u.rol || 'Voluntario').toLowerCase();
  
  let formattedRole: AdminUserItem['rol'] = 'Voluntario';
  if (rawRole.includes('admin')) formattedRole = 'Admin';
  else if (rawRole.includes('benef')) formattedRole = 'Beneficiario';
  else if (rawRole.includes('org')) formattedRole = 'Organizacion';
  else formattedRole = 'Voluntario';

  const estadoNorm =
    u.estado === 1 || u.estado === 'activo' || u.estado === '1'
      ? 'activo'
      : 'inactivo';

  return {
    id: String(rawId),
    id_usuario: u.id_usuario || rawId,
    nombre1: u.nombre1 || u.nombre || 'Usuario',
    nombre2: u.nombre2 || '',
    apellido1: u.apellido1 || '',
    apellido2: u.apellido2 || '',
    correo: u.correo || u.email || '',
    rol: formattedRole,
    estado: estadoNorm,
    telefono: u.telefono || '+57 300 000 0000',
    barrio: u.barrio || 'Kennedy Central',
    direccion: u.direccion || '',
    localidad: u.localidad || 'Kennedy',
    ciudad: u.ciudad || 'Bogotá',
    fecha_registro: u.fecha_registro || u.fechaRegistro || '2026-08-10',
  };
};

export const AdminService = {
  // ==========================================
  // DASHBOARD & AUDITORÍAS
  // ==========================================
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const [usersRes, eventsRes, donationsRes, verifRes] = await Promise.all([
        apiClient.get('/users').catch(() => ({ data: { data: [] } })),
        apiClient.get('/events').catch(() => ({ data: { data: [] } })),
        apiClient.get('/donations').catch(() => ({ data: { data: [] } })),
        apiClient.get('/verifications').catch(() => ({ data: { data: [] } })),
      ]);

      const users = Array.isArray(usersRes.data?.data) ? usersRes.data.data : [];
      const events = Array.isArray(eventsRes.data?.data) ? eventsRes.data.data : [];
      const donations = Array.isArray(donationsRes.data?.data) ? donationsRes.data.data : [];
      const verifs = Array.isArray(verifRes.data?.data) ? verifRes.data.data : [];

      const pendingVerifs = verifs.filter((v: any) => v.estado === 'pendiente');

      return {
        totalUsers: users.length,
        totalEvents: events.length,
        totalDonations: donations.length,
        pendingVerifications: pendingVerifs.length,
      };
    } catch (e) {
      console.warn('Error in getDashboardStats:', e);
      return {
        totalUsers: 0,
        totalEvents: 0,
        totalDonations: 0,
        pendingVerifications: 0,
      };
    }
  },

  async getRecentAudits(): Promise<AdminAuditItem[]> {
    try {
      const res = await apiClient.get('/audits');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      console.warn('Error fetching audits:', e);
      return [];
    }
  },

  // ==========================================
  // 1. USUARIOS
  // ==========================================
  async getAllUsers(): Promise<AdminUserItem[]> {
    try {
      const res = await apiClient.get('/users');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map(normalizeUser);
      }
      return [];
    } catch (e) {
      console.warn('Error fetching all users in admin:', e);
      return [];
    }
  },

  async getUserById(id: string | number): Promise<AdminUserItem | null> {
    try {
      const res = await apiClient.get(`/users/${id}`);
      if (res.data?.data) {
        return normalizeUser(res.data.data);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async createUser(payload: CreateUserPayload): Promise<{ success: boolean; data?: AdminUserItem; message?: string }> {
    try {
      const res = await apiClient.post('/users', {
        ...payload,
        password: payload.password || 'User123*',
        estado: payload.estado === 'inactivo' ? 0 : 1,
      });

      if (res.data?.success) {
        return {
          success: true,
          data: normalizeUser(res.data.data),
          message: res.data.message || 'Usuario registrado exitosamente',
        };
      }
      return { success: false, message: res.data?.message || 'Error al registrar usuario' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear usuario';
      return { success: false, message: msg };
    }
  },

  async updateUser(id: string | number, data: Partial<AdminUserItem> & { password?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/users/${id}`, data);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Usuario actualizado correctamente' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async deleteUser(id: string | number): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.delete(`/users/${id}`);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Usuario eliminado correctamente' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  // ==========================================
  // 2. ORGANIZACIONES
  // ==========================================
  async getAllOrganizations(): Promise<AdminOrgItem[]> {
    try {
      const res = await apiClient.get('/organizations');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((o: any) => ({
          id: String(o.id || o.id_organizacion),
          nombre: o.nombre || 'Organización',
          direccion: o.direccion || '',
          correo: o.correo || '',
          telefono: o.telefono || '',
          logo: o.logo,
          verificada: Boolean(o.verificada),
          estadoVerificacion: o.estadoVerificacion || (o.verificada ? 'aprobada' : 'no_solicitado'),
          nit: o.nit || '',
          localidad: o.localidad || 'Kennedy',
          barrio: o.barrio || '',
          totalEventos: o.totalEventos || 0,
          totalDonaciones: o.totalDonaciones || 0,
        }));
      }
      return [];
    } catch (e) {
      console.warn('Error fetching organizations:', e);
      return [];
    }
  },

  async getOrganizationById(id: string): Promise<AdminOrgItem | null> {
    try {
      const res = await apiClient.get(`/organizations/${id}`);
      if (res.data?.data) {
        const o = res.data.data;
        return {
          id: String(o.id || o.id_organizacion),
          nombre: o.nombre,
          direccion: o.direccion,
          correo: o.correo,
          telefono: o.telefono,
          logo: o.logo,
          verificada: Boolean(o.verificada),
          estadoVerificacion: o.estadoVerificacion,
          nit: o.nit,
          localidad: o.localidad,
          barrio: o.barrio,
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async createOrganization(payload: {
    nombre: string;
    direccion: string;
    correo: string;
    password?: string;
    telefono?: string;
    nit?: string;
  }): Promise<{ success: boolean; data?: AdminOrgItem; message?: string }> {
    try {
      const res = await apiClient.post('/organizations', {
        ...payload,
        password: payload.password || 'Org123456*',
      });
      if (res.data?.success) {
        return { success: true, data: res.data.data, message: 'Organización registrada exitosamente' };
      }
      return { success: false, message: res.data?.message || 'Error al registrar organización' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async updateOrganization(id: string, payload: Partial<AdminOrgItem>): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/organizations/${id}`, payload);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Organización actualizada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async deleteOrganization(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.delete(`/organizations/${id}`);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Organización eliminada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  // ==========================================
  // 3. SOLICITUDES DE VERIFICACIÓN
  // ==========================================
  async getAllVerifications(): Promise<AdminVerificationItem[]> {
    try {
      const res = await apiClient.get('/verifications');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((v: any) => ({
          id: String(v.id || `ver_${v.id_solicitud}`),
          id_solicitud: v.id_solicitud,
          organizacionId: String(v.organizacionId || `org_${v.id_organizacion}`),
          id_organizacion: v.id_organizacion,
          nombreOrganizacion: v.nombreOrganizacion || 'Organización',
          correoOrganizacion: v.correoOrganizacion || '',
          nit: v.nit || '',
          mensaje: v.mensaje || '',
          documentos: v.documentos || '',
          estado: v.estado || 'pendiente',
          respuestaAdmin: v.respuestaAdmin || '',
          fechaSolicitud: v.fechaSolicitud || new Date().toISOString(),
          fechaRespuesta: v.fechaRespuesta,
        }));
      }
      return [];
    } catch (e) {
      console.warn('Error fetching verifications:', e);
      return [];
    }
  },

  async getVerificationById(id: string): Promise<AdminVerificationItem | null> {
    try {
      const res = await apiClient.get(`/verifications/${id}`);
      if (res.data?.data) {
        return res.data.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async createVerification(payload: {
    organizacionId: string;
    nit?: string;
    mensaje?: string;
    documentos?: string;
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const res = await apiClient.post('/verifications/request', payload);
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Solicitud de verificación creada con éxito',
        data: res.data?.data,
      };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async respondVerification(
    id: string,
    estado: 'aprobada' | 'rechazada',
    respuestaAdmin?: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/verifications/${id}/respond`, {
        estado,
        respuestaAdmin,
      });
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || `Solicitud ${estado} con éxito`,
      };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async updateVerification(
    id: string,
    payload: { nit?: string; mensaje?: string; documentos?: string; estado?: string; respuestaAdmin?: string }
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/verifications/${id}`, payload);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Solicitud actualizada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async deleteVerification(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.delete(`/verifications/${id}`);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Solicitud eliminada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  // ==========================================
  // 4. EVENTOS
  // ==========================================
  async getAllEvents(): Promise<AdminEventItem[]> {
    try {
      const res = await apiClient.get('/events');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((e: any) => ({
          id: String(e.id || e.id_evento),
          id_evento: e.id_evento,
          nombre: e.nombre || 'Evento',
          categoria: e.categoria || 'Social',
          descripcion: e.descripcion || '',
          direccion: e.direccion || '',
          fecha: e.fecha || new Date().toISOString(),
          cupo: Number(e.cupo) || 0,
          vacantes_voluntarios: e.vacantes_voluntarios,
          vacantes_beneficiarios: e.vacantes_beneficiarios,
          ayuda_ofrecida: e.ayuda_ofrecida,
          estado: (e.estado === 1 || e.estado === 'activo') ? 'activo' : (e.estado === 'finalizado' ? 'finalizado' : 'cancelado'),
          organizacionId: String(e.organizacionId || e.organizacion_id || 'org_1'),
          organizacionNombre: e.organizacionNombre,
          imagen: e.imagen,
          barrio: e.barrio,
          localidad: e.localidad,
        }));
      }
      return [];
    } catch (e) {
      console.warn('Error fetching events:', e);
      return [];
    }
  },

  async getEventById(id: string): Promise<AdminEventItem | null> {
    try {
      const res = await apiClient.get(`/events/${id}`);
      return res.data?.data || null;
    } catch (e) {
      return null;
    }
  },

  async getEventParticipants(id: string): Promise<any[]> {
    try {
      const res = await apiClient.get(`/events/${id}/participants`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      return [];
    }
  },

  async createEvent(payload: {
    nombre: string;
    categoria: string;
    descripcion: string;
    direccion: string;
    fecha: string;
    cupo: number;
    estado?: string;
    organizacionId: string;
    vacantes_voluntarios?: number;
    vacantes_beneficiarios?: number;
    ayuda_ofrecida?: string;
    imagen?: string;
  }): Promise<{ success: boolean; data?: AdminEventItem; message?: string }> {
    try {
      const res = await apiClient.post('/events', payload);
      if (res.data?.success) {
        return { success: true, data: res.data.data, message: 'Evento creado exitosamente' };
      }
      return { success: false, message: res.data?.message || 'Error al crear evento' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async updateEvent(id: string, payload: Partial<AdminEventItem>): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/events/${id}`, payload);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Evento actualizado' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async deleteEvent(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.delete(`/events/${id}`);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Evento eliminado' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  // ==========================================
  // 5. DONACIONES (Estricto: No update, No delete)
  // ==========================================
  async getAllDonations(): Promise<AdminDonationItem[]> {
    try {
      const res = await apiClient.get('/donations');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((d: any) => ({
          id: String(d.id || d.id_donacion),
          categoria: d.categoria || 'General',
          tipo: d.tipo || (d.monetaria ? 'monetaria' : 'objeto'),
          fecha: d.fecha || new Date().toISOString(),
          usuarioId: String(d.usuarioId || d.usuario_id || 'usr_1'),
          usuarioNombre: d.usuarioNombre || 'Donante',
          organizacionId: String(d.organizacionId || d.organizacion_id || 'org_1'),
          organizacionNombre: d.organizacionNombre || 'Organización',
          monetaria: d.monetaria,
          objeto: d.objeto,
        }));
      }
      return [];
    } catch (e) {
      console.warn('Error fetching donations:', e);
      return [];
    }
  },

  async getDonationById(id: string): Promise<AdminDonationItem | null> {
    try {
      const res = await apiClient.get(`/donations/${id}`);
      return res.data?.data || null;
    } catch (e) {
      return null;
    }
  },

  async createMonetaryDonation(payload: {
    donation: {
      categoria: string;
      usuarioId: string;
      organizacionId: string;
    };
    monetary: {
      valor: number;
      metodoPago?: string;
      cuenta?: string;
    };
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const res = await apiClient.post('/donations/monetary', payload);
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Donación monetaria registrada con éxito',
        data: res.data?.data,
      };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async createObjectDonation(payload: {
    donation: {
      categoria: string;
      usuarioId: string;
      organizacionId: string;
    };
    objectDetail: {
      categoria: string;
      cantidad: number;
      descripcion: string;
    };
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const res = await apiClient.post('/donations/object', payload);
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Donación de objeto registrada con éxito',
        data: res.data?.data,
      };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  // ==========================================
  // 6. CATEGORÍAS
  // ==========================================
  async getAllCategories(): Promise<AdminCategoryItem[]> {
    try {
      const res = await apiClient.get('/categories');
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((c: any) => ({
          id: String(c.id || c.id_categoria),
          id_categoria: c.id_categoria,
          nombre: c.nombre || 'Categoría',
          descripcion: c.descripcion || '',
          estado: (c.estado === 1 || c.estado === 'activo' || c.estado === '1') ? 'activo' : 'inactivo',
        }));
      }
      return [];
    } catch (e) {
      console.warn('Error fetching categories:', e);
      return [];
    }
  },

  async getCategoryById(id: string): Promise<AdminCategoryItem | null> {
    try {
      const res = await apiClient.get(`/categories/${id}`);
      return res.data?.data || null;
    } catch (e) {
      return null;
    }
  },

  async createCategory(payload: {
    nombre: string;
    descripcion: string;
    estado?: string;
  }): Promise<{ success: boolean; data?: AdminCategoryItem; message?: string }> {
    try {
      const res = await apiClient.post('/categories', payload);
      if (res.data?.success) {
        return { success: true, data: res.data.data, message: 'Categoría creada con éxito' };
      }
      return { success: false, message: res.data?.message || 'Error al crear categoría' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async updateCategory(id: string, payload: Partial<AdminCategoryItem>): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.put(`/categories/${id}`, payload);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Categoría actualizada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.delete(`/categories/${id}`);
      return { success: res.data?.success ?? true, message: res.data?.message || 'Categoría eliminada' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },
};

export default AdminService;

