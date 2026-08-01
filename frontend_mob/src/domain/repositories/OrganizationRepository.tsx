import { ApiOrganization } from '../sources/remote/api/ApiOrganization';
import {
  Organization,
  OrganizationRegisterRequest,
  OrganizationUpdateRequest,
  OrganizationListResponse,
} from '../sources/remote/models/Organization';
import { OrganizationHistory } from '../sources/remote/models/OrganizationHistory';

export class OrganizationRepository {
  // HU-009: Crear organización
  async create(data: OrganizationRegisterRequest): Promise<Organization> {
    const response = await ApiOrganization.post('/', data);
    return response.data;
  }

  // HU-010: Actualizar organización
  async update(id: string, data: OrganizationUpdateRequest): Promise<Organization> {
    const response = await ApiOrganization.put(`/${id}`, data);
    return response.data;
  }

  // HU-010: Obtener historial
  async getHistory(id: string): Promise<OrganizationHistory[]> {
    const response = await ApiOrganization.get(`/${id}/history`);
    return response.data;
  }

  // HU-011: Eliminar organización
  async delete(id: string, options?: { transferUsersTo?: string; motivo?: string }): Promise<void> {
    await ApiOrganization.delete(`/${id}`, { data: options });
  }

  // HU-012: Listar organizaciones
  async list(params: {
    search?: string;
    page?: number;
    limit?: number;
    estado?: string;
  }): Promise<OrganizationListResponse> {
    const response = await ApiOrganization.get('/', { params });
    return response.data;
  }

  // HU-012: Obtener detalle
  async getById(id: string): Promise<Organization> {
    const response = await ApiOrganization.get(`/${id}`);
    return response.data;
  }
}