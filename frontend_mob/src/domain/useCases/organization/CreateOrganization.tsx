import { OrganizationRepository } from '../../../data/repositories/OrganizationRepository';
import { OrganizationRegisterEntity } from '../../entities/Organization';
import { OrganizationValidators } from './validators/OrganizationValidators';

export class CreateOrganizationUseCase {
  private repository: OrganizationRepository;

  constructor() {
    this.repository = new OrganizationRepository();
  }

  async execute(data: OrganizationRegisterEntity) {
    const validation = OrganizationValidators.validateOrganization(data);
    if (!validation.valid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const existing = await this.repository.list({ 
      search: data.email, 
      limit: 1 
    });
    
    if (existing.items.some(org => org.email === data.email)) {
      throw new Error('El email ya está registrado');
    }
    
    if (existing.items.some(org => org.nit === data.nit)) {
      throw new Error('El NIT ya está registrado');
    }

    return await this.repository.create(data);
  }
}