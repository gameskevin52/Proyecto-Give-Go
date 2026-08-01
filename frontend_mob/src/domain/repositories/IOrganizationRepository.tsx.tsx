import {
  OrganizationEntity,
  OrganizationRegisterEntity,
  OrganizationUpdateEntity,
} from '../entities/Organization';
import { OrganizationHistory } from '../../data/sources/remote/models/OrganizationHistory';
import { OrganizationListResponse } from '../../data/sources/remote/models/Organization';

export interface IOrganizationRepository {
  create(data: OrganizationRegisterEntity): Promise<OrganizationEntity>;
  update(id: string, data: OrganizationUpdateEntity): Promise<OrganizationEntity>;
  getHistory(id: string): Promise<OrganizationHistory[]>;
  delete(id: string, options?: { transferUsersTo?: string; motivo?: string }): Promise<void>;
  list(params: { search?: string; page?: number; limit?: number; estado?: string }): Promise<OrganizationListResponse>;
  getById(id: string): Promise<OrganizationEntity>;
}