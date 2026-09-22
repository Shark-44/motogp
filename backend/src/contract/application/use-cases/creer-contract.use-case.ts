import type { CreerContractPort } from '../ports/in/creer-contract.port.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { TeamRepositoryPort } from '../../../teams/domaine/ports/out/team-repository.port.js';
import type { Contract, RoleContract } from '../../domaine/entities/contract.entity.js';
import type { ContractValidatorService } from '../../domaine/services/service-contract.js';

export class CreerContractUseCase implements CreerContractPort {
  constructor(
    private readonly contractRepository: ContractRepositoryPort,
    private readonly riderRepository: RiderRepositoryPort,
    private readonly teamRepository: TeamRepositoryPort,
    private readonly contractValidator: ContractValidatorService,
  ) {}

  async execute(piloteId: string, equipeId: string, saison: number, role: RoleContract, dateDebut: Date, dateFin: Date): Promise<Contract> {
    const pilote = await this.riderRepository.findById(piloteId);
    const equipe = await this.teamRepository.findById(equipeId);

    if (!pilote) throw new Error(`Aucun pilote trouvé avec l'id ${piloteId}`);
    if (!equipe) throw new Error(`Aucune équipe trouvée avec l'id ${equipeId}`);

    await this.contractValidator.validerDisponibilite(piloteId, dateDebut, dateFin);
    await this.contractValidator.validerFenetreSignature(piloteId, dateDebut);
    await this.contractValidator.validerPlafondRole(equipeId, role);
    await this.contractValidator.validerRestrictionRemplacant(piloteId, equipeId, role);

    return this.contractRepository.create(piloteId, equipeId, saison, role, dateDebut, dateFin);
  }
}