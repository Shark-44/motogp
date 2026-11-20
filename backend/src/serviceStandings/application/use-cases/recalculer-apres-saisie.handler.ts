import type { ResultatsSessionEnregistres } from '../../../sessionResults/domaine/events/resultats-session-enregistres.event.js';
import type { SessionResultsRepositoryPort } from '../../../sessionResults/domaine/ports/out/sessionResults-repository.port.js';
import type { ServiceStandingsPort } from '../ports/in/serviceStandings.port.js';

export class RecalculerApresSaisieHandler {
  constructor(
    private readonly sessionResultsRepository: SessionResultsRepositoryPort,
    private readonly declencherStandings: ServiceStandingsPort,
  ) {}

  async handle(evenement: ResultatsSessionEnregistres): Promise<void> {
    const resultats = await this.sessionResultsRepository.findByEventIds([evenement.eventId]);
    const sessions = new Set(resultats.map((r) => r.typeSession));
    if (!sessions.has('SPRINT') || !sessions.has('RACE')) return; // il manque une session
    await this.declencherStandings.execute(evenement.eventId);
  }
}