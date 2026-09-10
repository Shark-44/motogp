//application/use-cases/creer-contract-case.ts

import type { CreerContractPort } from '../ports/in/creer-contract.port.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';
import type { Contract, RoleContract } from '../../domaine/entities/contract.entity.js';

export class CreerContractUseCase implements CreerContractPort {
  constructor(private readonly contractRepository: ContractRepositoryPort) {}

  async execute(piloteId: string, equipeId: string, saison: number, role: RoleContract): Promise<Contract> {
    return this.contractRepository.create(piloteId, equipeId, saison, role);
  }
}