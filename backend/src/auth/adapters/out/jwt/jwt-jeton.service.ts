import jwt from 'jsonwebtoken';
import type {
  JetonServicePort,
  ContenuJeton,
  JetonEmis,
  RoleAuth,
} from '../../../domaine/ports/out/jeton-service.port.js';

const ROLES_VALIDES: readonly string[] = ['admin'];

/**
 * Adaptateur de sortie : implémente le port avec un JWT signé HS256 (paquet jsonwebtoken).
 * Le secret et la durée sont injectés depuis le bootstrap, jamais lus ici.
 */
export class JwtJetonService implements JetonServicePort {
  constructor(
    private readonly secret: string,
    private readonly dureeSecondes: number = 3600,
  ) {
    if (secret.length < 32) {
      throw new Error('JWT_SECRET doit contenir au moins 32 caractères.');
    }
    if (!Number.isInteger(dureeSecondes) || dureeSecondes <= 0) {
      throw new Error('La durée de validité du jeton doit être un entier positif (secondes).');
    }
  }

  emettre(contenu: ContenuJeton): JetonEmis {
    const jeton = jwt.sign({ role: contenu.role }, this.secret, {
      algorithm: 'HS256',
      expiresIn: this.dureeSecondes,
    });
    return { jeton, expireDansSecondes: this.dureeSecondes };
  }

  verifier(jeton: string): ContenuJeton | null {
    try {
      // On impose l'algorithme attendu : un jeton "alg: none" ou signé autrement est refusé.
      const decode = jwt.verify(jeton, this.secret, { algorithms: ['HS256'] });

      if (
        typeof decode === 'string' ||
        typeof decode.role !== 'string' ||
        !ROLES_VALIDES.includes(decode.role)
      ) {
        return null;
      }
      return { role: decode.role as RoleAuth };
    } catch {
      // Signature fausse, jeton expiré, format invalide...
      return null;
    }
  }
}
