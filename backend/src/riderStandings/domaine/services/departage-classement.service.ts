import type { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';

/**
 * Service de domaine pur : départage deux pilotes à égalité de points, en
 * comparant leur nombre de 1res places en RACE, puis de 2es places, puis de
 * 3es, et ainsi de suite — uniquement les résultats de course (RACE),
 * jamais les sprints.
 *
 * Comparateur au sens de Array.sort : un résultat négatif signifie que
 * piloteIdA doit être classé devant piloteIdB, positif l'inverse, 0 une
 * égalité totale (aucun niveau de la cascade ne les départage).
 */
export class DepartageClassement {
  comparer(piloteIdA: string, piloteIdB: string, resultats: SessionResults[]): number {
    const resultatsRace = resultats.filter(
      (r) => r.typeSession === 'RACE' && r.statut === 'TERMINE' && r.position !== null,
    );

    const profilA = this.profilPositions(piloteIdA, resultatsRace);
    const profilB = this.profilPositions(piloteIdB, resultatsRace);

    const meilleurePositionConnue = Math.max(0, ...resultatsRace.map((r) => r.position as number));

    for (let position = 1; position <= meilleurePositionConnue; position++) {
      const diff = (profilB.get(position) ?? 0) - (profilA.get(position) ?? 0);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  private profilPositions(piloteId: string, resultatsRace: SessionResults[]): Map<number, number> {
    const profil = new Map<number, number>();
    for (const r of resultatsRace) {
      if (r.piloteId === piloteId) {
        const position = r.position as number;
        profil.set(position, (profil.get(position) ?? 0) + 1);
      }
    }
    return profil;
  }
}
