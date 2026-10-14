import { createHash, timingSafeEqual } from 'node:crypto';
import type { VerifierAdminPort } from '../ports/in/verifier-admin.port.js';

// Le SHA-256 sert uniquement à obtenir deux buffers de même longueur,
// exigence de timingSafeEqual (doc Node.js : https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b).
// Ce n'est PAS du hachage de mot de passe : ce sera le rôle du futur module d'authentification.
const empreinte = (valeur: string): Buffer => createHash('sha256').update(valeur).digest();

/**
 * Implémentation PROVISOIRE : un seul mot de passe admin, injecté depuis l'extérieur.
 * À remplacer par une autre implémentation de VerifierAdminPort quand le module
 * d'authentification hexagonal sera construit.
 */
export class VerifierAdminUseCase implements VerifierAdminPort {
  private readonly empreinteAttendue: Buffer;

  constructor(motDePasseAttendu: string) {
    if (!motDePasseAttendu) {
      throw new Error("Le mot de passe admin attendu ne peut pas être vide.");
    }
    this.empreinteAttendue = empreinte(motDePasseAttendu);
  }

  async execute(motDePasse: string): Promise<boolean> {
    return timingSafeEqual(empreinte(motDePasse), this.empreinteAttendue);
  }
}
