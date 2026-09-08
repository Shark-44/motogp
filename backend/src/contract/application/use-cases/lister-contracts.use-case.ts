import type { ListerContractsPort } from '../ports/in/lister-contracts.port.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';

export class ListerContractsUseCase implements ListerContractsPort {
  constructor(private readonly contractRepository: ContractRepositoryPort) {}

  async execute() {
    return this.contractRepository.findAll();
  }
}
