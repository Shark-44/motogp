import type { Contract} from '../../entities/contract.entity.js';

export interface ContractRepositoryPort {
  findAll(): Promise<Contract[]>;
}
