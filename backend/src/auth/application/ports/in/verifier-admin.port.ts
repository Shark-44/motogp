export interface VerifierAdminPort {
  /**
   * Indique si le mot de passe fourni donne l'accès admin.
   * Le middleware ne connaît que ce contrat : l'implémentation derrière
   * (mot de passe unique aujourd'hui, comptes + JWT demain) peut changer
   * sans toucher aux routes.
   */
  execute(motDePasse: string): Promise<boolean>;
}
