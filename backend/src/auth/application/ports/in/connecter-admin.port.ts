import type { JetonEmis } from '../../../domaine/ports/out/jeton-service.port.js';

export interface ConnecterAdminPort {
  /** Retourne un jeton si le mot de passe est valide, sinon null. */
  execute(motDePasse: string): Promise<JetonEmis | null>;
}
