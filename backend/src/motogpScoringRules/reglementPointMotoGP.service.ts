import type { SessionResults } from '../sessionResults/domaine/entities/sessionResults.entity.js';

export interface AttributionPoints {
  resultatId: string;
  piloteId: string;
  points: number;
}

/**
 * Service de domaine pur (sans repository, sans DB) : attribue les points
 * d'un résultat de session selon le règlement officiel MotoGP.
 *
 * Barème RACE (top 15) : 25/20/16/13/11/10/9/8/7/6/5/4/3/2/1
 * Barème SPRINT (top 9) : 12/9/7/6/5/4/3/2/1
 * DNF / NON_PARTANT / hors barème : 0 point.
 */
export class ReglementPointMotoGP {
  private static readonly BAREME_RACE: Readonly<Record<number, number>> = {
    1: 25, 2: 20, 3: 16, 4: 13, 5: 11,
    6: 10, 7: 9, 8: 8, 9: 7, 10: 6,
    11: 5, 12: 4, 13: 3, 14: 2, 15: 1,
  };

  private static readonly BAREME_SPRINT: Readonly<Record<number, number>> = {
    1: 12, 2: 9, 3: 7, 4: 6, 5: 5,
    6: 4, 7: 3, 8: 2, 9: 1,
  };

  calculer(resultats: SessionResults[]): AttributionPoints[] {
    return resultats.map((resultat) => ({
      resultatId: this.exigerId(resultat),
      piloteId: resultat.piloteId,
      points: this.pointsPourUnResultat(resultat),
    }));
  }

  private pointsPourUnResultat(resultat: SessionResults): number {
    if (resultat.statut !== 'TERMINE' || resultat.position === null) {
      return 0;
    }
    const bareme = resultat.typeSession === 'RACE' ? ReglementPointMotoGP.BAREME_RACE : ReglementPointMotoGP.BAREME_SPRINT;
    return bareme[resultat.position] ?? 0;
  }

  private exigerId(resultat: SessionResults): string {
    if (!resultat.id) {
      throw new Error('Impossible de calculer les points : le résultat doit être persisté (id manquant).');
    }
    return resultat.id;
  }
}
