import type { SaisieSessionResultsPort, ResultatSaisi } from '../ports/in/saisie-sessionResults.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';
import type { ContractRepositoryPort } from '../../../contract/domaine/ports/out/contract-repository.port.js';
import { SessionResults } from '../../domaine/entities/sessionResults.entity.js';

export class SaisieSessionResultsUseCase implements SaisieSessionResultsPort {
  constructor(
    private readonly raceEventRepository: RaceEventRepositoryPort,
    private readonly riderRepository: RiderRepositoryPort,
    private readonly sessionResultsRepository: SessionResultsRepositoryPort,
    private readonly contractRepository: ContractRepositoryPort, // <- Dépendance ajoutée
  ) {}

  async execute(eventId: string, resultats: ResultatSaisi[]): Promise<SessionResults[]> {
    const evenement = await this.raceEventRepository.findById(eventId);

    if (!evenement) {
      throw new Error(`Aucun événement trouvé avec l'id ${eventId}`);
    }
    if (evenement.statut !== 'TERMINE') {
      throw new Error(`L'événement doit être terminé pour saisir ses résultats.`);
    }

    // Résolution asynchrone pour chaque résultat (fimNumber -> rider -> contract)
    const entitesSession = await Promise.all(
      resultats.map(async (res) => {
        // 1. Récupérer le pilote via son fimNumber
        const rider = await this.riderRepository.findByFimNumber(res.fimNumber);
        if (!rider) {
          throw new Error(`Pilote inconnu avec le numéro FIM ${res.fimNumber}`);
        }

        // 2. Récupérer le contrat actif du pilote pour cet événement
        const contract = await this.contractRepository.findActiveContractForRiderAtEvent(
          rider.id,
          eventId
        );
        if (!contract) {
          throw new Error(
            `Aucun contrat actif trouvé pour le pilote ${rider.id} lors de l'événement ${eventId}`
          );
        }

        // 3. Instancier l'entité avec le contratId résolu
        return new SessionResults(
          undefined,
          eventId,
          res.typeSession,
          res.statut,
          res.position,
          rider.id,      // piloteId
          contract.id    // contratId résolu !
        );
      })
    );

    return await this.sessionResultsRepository.saveAll(entitesSession);
  }
}