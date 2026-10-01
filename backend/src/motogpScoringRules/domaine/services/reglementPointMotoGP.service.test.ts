import { describe, expect, it } from 'vitest';
import { ReglementPointMotoGP } from './reglementPointMotoGP.service.js';
import { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';

function creerResultat(
  id: string,
  typeSession: 'RACE' | 'SPRINT',
  statut: 'TERMINE' | 'ABANDON' | 'NON_PARTANT',
  position: number | null,
  piloteId = 'rider-1',
): SessionResults {
  return new SessionResults(id, 'event-1', typeSession, statut, position, piloteId);
}

describe('ReglementPointMotoGP', () => {
  const service = new ReglementPointMotoGP();

  it('attribue le barème RACE complet (1 à 15)', () => {
    const bareme = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const resultats = bareme.map((_, i) => creerResultat(`r${i + 1}`, 'RACE', 'TERMINE', i + 1));

    const attributions = service.calculer(resultats);

    expect(attributions.map((a) => a.points)).toEqual(bareme);
  });

  it('attribue le barème SPRINT complet (1 à 9)', () => {
    const bareme = [12, 9, 7, 6, 5, 4, 3, 2, 1];
    const resultats = bareme.map((_, i) => creerResultat(`r${i + 1}`, 'SPRINT', 'TERMINE', i + 1));

    const attributions = service.calculer(resultats);

    expect(attributions.map((a) => a.points)).toEqual(bareme);
  });

  it('attribue 0 point au-delà du top 15 en RACE', () => {
    const resultat = creerResultat('r16', 'RACE', 'TERMINE', 16);

    expect(service.calculer([resultat])[0].points).toBe(0);
  });

  it('attribue 0 point au-delà du top 9 en SPRINT', () => {
    const resultat = creerResultat('r10', 'SPRINT', 'TERMINE', 10);

    expect(service.calculer([resultat])[0].points).toBe(0);
  });

  it('attribue 0 point à un ABANDON', () => {
    const resultat = creerResultat('r1', 'RACE', 'ABANDON', null);

    expect(service.calculer([resultat])[0].points).toBe(0);
  });

  it('attribue 0 point à un NON_PARTANT', () => {
    const resultat = creerResultat('r1', 'SPRINT', 'NON_PARTANT', null);

    expect(service.calculer([resultat])[0].points).toBe(0);
  });

  it('associe chaque attribution à son resultatId et son piloteId', () => {
    const resultat = creerResultat('resultat-42', 'RACE', 'TERMINE', 1, 'rider-42');

    const [attribution] = service.calculer([resultat]);

    expect(attribution.resultatId).toBe('resultat-42');
    expect(attribution.piloteId).toBe('rider-42');
    expect(attribution.points).toBe(25);
  });

  it("refuse de calculer les points d'un résultat non persisté (id manquant)", () => {
    const resultat = new SessionResults(undefined, 'event-1', 'RACE', 'TERMINE', 1, 'rider-1');

    expect(() => service.calculer([resultat])).toThrow('doit être persisté');
  });

  it('traite un lot mixte RACE/SPRINT sans confondre les barèmes', () => {
    const resultats = [
      creerResultat('r1', 'RACE', 'TERMINE', 1),
      creerResultat('r2', 'SPRINT', 'TERMINE', 1),
    ];

    const attributions = service.calculer(resultats);

    expect(attributions[0].points).toBe(25);
    expect(attributions[1].points).toBe(12);
  });
});
