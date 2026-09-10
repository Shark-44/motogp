import type { Contract, RoleContract } from '../../entities/contract.entity.js';

export interface ContractRepositoryPort {
  findAll(): Promise<Contract[]>;
  create(riderId: string, teamId: string, saison: number, role: RoleContract): Promise<Contract>;
}
