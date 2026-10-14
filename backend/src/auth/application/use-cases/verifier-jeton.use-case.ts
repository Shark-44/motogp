import type { VerifierJetonPort } from '../ports/in/verifier-jeton.port.js';
import type { JetonServicePort, ContenuJeton } from '../../domaine/ports/out/jeton-service.port.js';

/**
 * AUTORISATION : à chaque requête protégée, on ne revérifie plus le mot de passe,
 * seulement l'authenticité du jeton et le rôle qu'il porte.
 */
export class VerifierJetonUseCase implements VerifierJetonPort {
  constructor(private readonly jetonService: JetonServicePort) {}

  async execute(jeton: string): Promise<ContenuJeton | null> {
    return this.jetonService.verifier(jeton);
  }
}
