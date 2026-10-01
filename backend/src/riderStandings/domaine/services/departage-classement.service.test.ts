import { describe, expect, it } from 'vitest';
import { DepartageClassement } from './departage-classement.service.js';
import { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';

describe('DepartageClassement', () => {
  const service = new DepartageClassement();

  it('classe devant le pilote avec le plus de victoires en RACE', () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'RACE', 'TERMINE', 1, 'rider-A', 'contrat-1'),
      new SessionResults('r2', 'event-2', 'RACE', 'TERMINE', 2, 'rider-B', 'contrat-1'),
    ];

    expect(service.comparer('rider-A', 'rider-B', resultats)).toBeLessThan(0);
    expect(service.comparer('rider-B', 'rider-A', resultats)).toBeGreaterThan(0);
  });

  it('ignore les victoires en SPRINT pour le départage', () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'SPRINT', 'TERMINE', 1, 'rider-A', 'contrat-1'), // ignoré
      new SessionResults('r2', 'event-1', 'RACE', 'TERMINE', 5, 'rider-A', 'contrat-1'),
      new SessionResults('r3', 'event-1', 'RACE', 'TERMINE', 2, 'rider-B', 'contrat-1'),
    ];

    // rider-A n'a aucune victoire en RACE malgré sa victoire au sprint ;
    // rider-B est 2e en RACE, donc mieux classé que rider-A à ce niveau.
    expect(service.comparer('rider-A', 'rider-B', resultats)).toBeGreaterThan(0);
  });

  it('descend au 2e niveau si le nombre de victoires est identique', () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'RACE', 'TERMINE', 1, 'rider-A', 'contrat-1'),
      new SessionResults('r2', 'event-2', 'RACE', 'TERMINE', 3, 'rider-A', 'contrat-1'), // A : 1 victoire, 0 deuxième, 1 troisième
      new SessionResults('r3', 'event-1', 'RACE', 'TERMINE', 1, 'rider-B', 'contrat-1'),
      new SessionResults('r4', 'event-2', 'RACE', 'TERMINE', 2, 'rider-B', 'contrat-1'), // B : 1 victoire, 1 deuxième
    ];

    // Même nombre de victoires (1 chacun) ; B a une 2e place que A n'a pas -> B devant.
    expect(service.comparer('rider-A', 'rider-B', resultats)).toBeGreaterThan(0);
  });

  it('descend jusqu\'au niveau qui départage, quel que soit son rang', () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'RACE', 'TERMINE', 1, 'rider-A', 'contrat-1'),
      new SessionResults('r2', 'event-2', 'RACE', 'TERMINE', 4, 'rider-A', 'contrat-1'),
      new SessionResults('r3', 'event-1', 'RACE', 'TERMINE', 1, 'rider-B', 'contrat-1'),
      new SessionResults('r4', 'event-2', 'RACE', 'TERMINE', 5, 'rider-B', 'contrat-1'),
    ];

    // Même nombre de 1res (1) ; aucune 2e ni 3e chez aucun des deux ;
    // A a une 4e place, B n'en a aucune -> A devant, même en descendant à ce niveau.
    expect(service.comparer('rider-A', 'rider-B', resultats)).toBeLessThan(0);
  });

  it('renvoie 0 pour deux pilotes strictement à égalité à tous les niveaux', () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'RACE', 'TERMINE', 2, 'rider-A', 'contrat-1'),
      new SessionResults('r2', 'event-1', 'RACE', 'TERMINE', 2, 'rider-B', 'contrat-1'),
    ];

    expect(service.comparer('rider-A', 'rider-B', resultats)).toBe(0);
  });

  it('renvoie 0 pour deux pilotes sans aucun résultat en RACE (0 point de comparaison)', () => {
    const resultats = [new SessionResults('r1', 'event-1', 'SPRINT', 'TERMINE', 1, 'rider-A', 'contrat-1')];

    expect(service.comparer('rider-A', 'rider-B', resultats)).toBe(0);
  });
});
