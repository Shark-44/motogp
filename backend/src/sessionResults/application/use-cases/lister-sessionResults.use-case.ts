import type { ListerSessionResultsPort } from '../ports/in/lister-sessionResults.port.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';
import type { SessionResults } from '../../domaine/entities/sessionResults.entity.js';
// Use-case de lecture sans filtre — outil de vérification en phase d'étude,
// équivalent d'un console.log traversant toute la chaîne hexagonale (port → adaptateur → use-case).
// Pas un besoin fonctionnel de la carte : à remplacer par des lectures filtrées
// (findByEventId, findByPilote...) si un vrai besoin métier émerge.

export class ListerSessionResultUseCase implements ListerSessionResultsPort {
  constructor(private readonly resultatRepository: SessionResultsRepositoryPort) {}

  async execute(): Promise<SessionResults[]> {
    return this.resultatRepository.findAll();
  }
}
