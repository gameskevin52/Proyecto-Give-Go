import {OrganizationRepository} from '../../../data/repositories/OrganizationRepository';
import {OrganizationUpdateEntity} from '../../entities/Organization';

export class UpdateOrganizationUseCase{
    private repository: OrganizationRepository;

    constructor(){
        this.repository = new OrganizationRepository();

    }
    async execute(id:string, data: OrganizationUpdateEntity){
        return await this.repository.update(id, data);
    }
}