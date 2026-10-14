import type { ConnecterAdminPort } from '../ports/in/connecter-admin.port.js';
import type { VerifierAdminPort } from '../ports/in/verifier-admin.port.js';
import type { JetonServicePort, JetonEmis } from '../../domaine/ports/out/jeton-service.port.js';

/**
 * AUTHENTIFICATION : prouver qui on est (mot de passe), puis délivrer un jeton
 * qui portera le droit « admin » pour les requêtes suivantes.
 */
export class ConnecterAdminUseCase implements ConnecterAdminPort {
  constructor(
    private readonly verifierAdmin: VerifierAdminPort,
    private readonly jetonService: JetonServicePort,
  ) {}

  async execute(motDePasse: string): Promise<JetonEmis | null> {
    const motDePasseValide = await this.verifierAdmin.execute(motDePasse);
    if (!motDePasseValide) {
      return null;
    }
    return this.jetonService.emettre({ role: 'admin' });
  }
}
