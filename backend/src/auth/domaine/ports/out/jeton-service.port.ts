export type RoleAuth = 'admin';

export interface ContenuJeton {
  role: RoleAuth;
}

export interface JetonEmis {
  jeton: string;
  expireDansSecondes: number;
}

/**
 * Port de SORTIE : ce dont l'application a besoin pour fabriquer et lire un jeton,
 * sans savoir comment il est fabriqué (JWT aujourd'hui, autre chose demain).
 */
export interface JetonServicePort {
  emettre(contenu: ContenuJeton): JetonEmis;
  /** Retourne le contenu si le jeton est authentique et non expiré, sinon null. */
  verifier(jeton: string): ContenuJeton | null;
}
