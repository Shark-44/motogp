import type { MajFinContractPort } from '../ports/in/maj.fin-contract.port.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';
import type { Contract } from '../../domaine/entities/contract.entity.js';
import type { ContractValidatorService } from '../../domaine/services/service-creer-contract.js';


export class MajFinContractUseCase implements MajFinContractPort {
  constructor(
    private readonly contractRepository: ContractRepositoryPort,
    private readonly contractValidator: ContractValidatorService,
  ) {}

  async execute(piloteId: string, dateDebut: Date, dateFin: Date, nouvelleDateFin: Date): Promise<Contract> {
    const contrat = await this.contractRepository.findActiveContractForRider(piloteId, dateDebut, dateFin);
    if (!contrat) throw new Error(`Aucun contrat actif trouvé pour le pilote ${piloteId}`);

    await this.contractValidator.validerNouvelleDateFin(nouvelleDateFin);

    // On passe ici l'identifiant du contrat récupéré
    return this.contractRepository.updateFinContrat(contrat.id, nouvelleDateFin);
  }
}