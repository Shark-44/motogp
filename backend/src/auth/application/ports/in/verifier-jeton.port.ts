import type { ContenuJeton } from '../../../domaine/ports/out/jeton-service.port.js';

export interface VerifierJetonPort {
  /** Retourne l'identité portée par le jeton, ou null s'il est invalide ou expiré. */
  execute(jeton: string): Promise<ContenuJeton | null>;
}
