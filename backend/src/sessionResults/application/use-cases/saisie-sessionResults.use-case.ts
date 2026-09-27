import type { SaisieSessionResultsPort, ResultatSaisi } from '../ports/in/saisie-sessionResults.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';
import { SessionResults } from '../../domaine/entities/sessionResults.entity.js';

export class SaisieSessionResultsUseCase implements SaisieSessionResultsPort {
  constructor(
    private readonly raceEventRepository: RaceEventRepositoryPort,
    private readonly riderRepository: RiderRepositoryPort,
    private readonly sessionResultsRepository: SessionResultsRepositoryPort,
  ) {}

  async execute(eventId: string, resultats: ResultatSaisi[]): Promise<SessionResults[]> {
    //  Vérification de l'existence et du statut de l'événement
    const evenement = await this.raceEventRepository.findById(eventId);

    if (!evenement) {
      throw new Error(`Aucun événement trouvé avec l'id ${eventId}`);
    }
    if (evenement.statut !== 'TERMINE') {
      throw new Error(`L'événement doit être terminé pour saisir ses résultats.`);
    }

   const entitesSession = resultats.map(
      (res) =>
        new SessionResults(
          undefined, 
          eventId,
          res.typeSession,
          res.statut,
          res.position,
          res.fimNumber,
        ),
    );

    
    return await this.sessionResultsRepository.saveAll(entitesSession);
  }
}