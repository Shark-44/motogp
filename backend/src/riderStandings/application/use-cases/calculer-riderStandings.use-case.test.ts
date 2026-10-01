import { describe, expect, it, vi } from 'vitest';
import { CalculerRiderStandingsUseCase } from './calculer-riderStandings.use-case.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../../sessionResults/domaine/ports/out/sessionResults-repository.port.js';
import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import { RaceEvent } from '../../../raceEvent/domaine/entities/raceEvent.entity.js';
import { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';

const ROUND_1 = new RaceEvent('event-1', 'GP Qatar', 2026, new Date('2026-03-01'), 'TERMINE', 'circuit-1');
const ROUND_2 = new RaceEvent('event-2', 'GP Argentine', 2026, new Date('2026-03-15'), 'TERMINE', 'circuit-2');

// Les deux sessions saisies pour un round, avec des positions par défaut sans
// incidence sur les tests qui ne portent pas sur le calcul des points.
function sessionsCompletes(eventId: string, piloteId = 'rider-x'): SessionResults[] {
  return [
    new SessionResults(`${eventId}-sprint`, eventId, 'SPRINT', 'TERMINE', 1, piloteId, 'contrat-1'),
    new SessionResults(`${eventId}-race`, eventId, 'RACE', 'TERMINE', 1, piloteId, 'contrat-1'),
  ];
}

function creerRepositories(overrides?: {
  events?: RaceEvent[];
  evenementCible?: RaceEvent | null;
  resultats?: SessionResults[];
}) {
  const raceEventRepository: RaceEventRepositoryPort = {
    findAll: vi.fn(async () => overrides?.events ?? [ROUND_1, ROUND_2]),
    findByDate: vi.fn(),
    createEvent: vi.fn(),
    findById: vi.fn(async () =>
      overrides && 'evenementCible' in overrides ? overrides.evenementCible! : ROUND_2,
    ),
    updateEvent: vi.fn(),
    chercherDernierEventTermine: vi.fn(),
    chercherProchainEventPlanifie: vi.fn(),
  };

  const sessionResultsRepository: SessionResultsRepositoryPort = {
    findAll: vi.fn(),
    findByEventIds: vi.fn(async () => overrides?.resultats ?? []),
    saveAll: vi.fn(),
  };

  const riderStandingsRepository: RiderStandingsRepositoryPort = {
    findAll: vi.fn(),
    saveAll: vi.fn(async (classements) => classements),
  };

  return { raceEventRepository, sessionResultsRepository, riderStandingsRepository };
}

describe('CalculerClassementPiloteUseCase', () => {
  it("refuse le calcul si l'événement n'existe pas", async () => {
    const repos = creerRepositories({ evenementCible: null });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('Aucun événement trouvé');
  });

  it("refuse le calcul si l'événement n'est pas TERMINE", async () => {
    const repos = creerRepositories({
      evenementCible: new RaceEvent('event-2', 'GP Argentine', 2026, new Date('2026-03-15'), 'PLANIFIE', 'circuit-2'),
    });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('après un événement terminé');
  });

  it("refuse le calcul si aucun résultat n'a été saisi pour l'événement ciblé", async () => {
    // Round 1 complet, mais rien pour le round 2 ciblé
    const resultats = sessionsCompletes('event-1');
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('Incohérence');
    expect(repos.riderStandingsRepository.saveAll).not.toHaveBeenCalled();
  });

  it("refuse le calcul si un round TERMINE intermédiaire n'a pas ses résultats saisis", async () => {
    // Round 2 (ciblé) complet, mais round 1 (intermédiaire) jamais saisi
    const resultats = sessionsCompletes('event-2');
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('Incohérence');
    expect(repos.riderStandingsRepository.saveAll).not.toHaveBeenCalled();
  });

  it('refuse le calcul si un round a sa RACE mais pas son SPRINT', async () => {
    const resultats = [
      ...sessionsCompletes('event-1'),
      new SessionResults('event-2-race', 'event-2', 'RACE', 'TERMINE', 1, 'rider-x', 'contrat-1'),
      // pas de SPRINT pour event-2
    ];
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('Sprint');
  });

  it('refuse le calcul si un round a son SPRINT mais pas sa RACE', async () => {
    const resultats = [
      ...sessionsCompletes('event-1'),
      new SessionResults('event-2-sprint', 'event-2', 'SPRINT', 'TERMINE', 1, 'rider-x', 'contrat-1'),
      // pas de RACE pour event-2
    ];
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).rejects.toThrow('Course');
  });

  it('n\'exige pas les résultats d\'un round ANNULE', async () => {
    const roundAnnule = new RaceEvent('event-0', 'GP Annulé', 2026, new Date('2026-02-15'), 'ANNULE', 'circuit-0');
    const resultats = sessionsCompletes('event-1').concat(sessionsCompletes('event-2'));
    const repos = creerRepositories({ events: [roundAnnule, ROUND_1, ROUND_2], resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await expect(useCase.execute('event-2')).resolves.toBeDefined();
  });

  it("ne prend en compte que les rounds de la même saison, jusqu'à celui ciblé inclus", async () => {
    const roundSaisonSuivante = new RaceEvent('event-3', 'GP 2027', 2027, new Date('2027-03-01'), 'TERMINE', 'circuit-3');
    const resultats = sessionsCompletes('event-1').concat(sessionsCompletes('event-2'));
    const repos = creerRepositories({ events: [ROUND_1, ROUND_2, roundSaisonSuivante], resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    await useCase.execute('event-2');

    expect(repos.sessionResultsRepository.findByEventIds).toHaveBeenCalledWith(['event-1', 'event-2']);
  });

  it('cumule les points de deux rounds pour un même pilote', async () => {
    const resultats = [
      new SessionResults('e1-sprint', 'event-1', 'SPRINT', 'TERMINE', 1, 'rider-1', 'contrat-1'), // 12
      new SessionResults('e1-race', 'event-1', 'RACE', 'TERMINE', 1, 'rider-1', 'contrat-1'), // 25
      new SessionResults('e2-sprint', 'event-2', 'SPRINT', 'TERMINE', 5, 'rider-1', 'contrat-1'), // 5
      new SessionResults('e2-race', 'event-2', 'RACE', 'TERMINE', 2, 'rider-1', 'contrat-1'), // 20
      new SessionResults('e2-race-r2', 'event-2', 'RACE', 'TERMINE', 1, 'rider-2', 'contrat-1'), // 25
    ];
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    const classement = await useCase.execute('event-2');

    const rider1 = classement.find((c) => c.piloteId === 'rider-1');
    const rider2 = classement.find((c) => c.piloteId === 'rider-2');
    expect(rider1?.pointsCumules).toBe(62); // 12 + 25 + 5 + 20
    expect(rider2?.pointsCumules).toBe(25);
  });

  it('classe les pilotes par points décroissants', async () => {
    const resultats = [
      new SessionResults('r1', 'event-2', 'RACE', 'TERMINE', 1, 'rider-1', 'contrat-1'), // 25
      new SessionResults('r2', 'event-2', 'RACE', 'TERMINE', 2, 'rider-2', 'contrat-1'), // 20
      new SessionResults('r3', 'event-2', 'RACE', 'TERMINE', 3, 'rider-3', 'contrat-1'), // 16
      new SessionResults('r4', 'event-2', 'SPRINT', 'TERMINE', 1, 'rider-1', 'contrat-1'), // session SPRINT présente pour satisfaire la garde
    ];
    const repos = creerRepositories({ events: [ROUND_2], resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    const classement = await useCase.execute('event-2');

    expect(classement.map((c) => c.piloteId)).toEqual(['rider-1', 'rider-2', 'rider-3']);
    expect(classement.map((c) => c.positionGenerale)).toEqual([1, 2, 3]);
  });

  it('attribue le même rang à deux pilotes strictement ex-aequo (points et profil RACE identiques)', async () => {
    const resultats = [
      new SessionResults('e1-sprint', 'event-1', 'SPRINT', 'TERMINE', 1, 'rider-1', 'contrat-1'),
      new SessionResults('e1-race-1', 'event-1', 'RACE', 'TERMINE', 1, 'rider-1', 'contrat-1'), // 25, 1 victoire
      new SessionResults('e1-race-3', 'event-1', 'RACE', 'TERMINE', 2, 'rider-3', 'contrat-1'), // 20, 1x 2e place
      new SessionResults('e2-sprint', 'event-2', 'SPRINT', 'TERMINE', 1, 'rider-1', 'contrat-1'),
      new SessionResults('e2-race-2', 'event-2', 'RACE', 'TERMINE', 2, 'rider-2', 'contrat-1'), // 20, 1x 2e place
    ];
    const repos = creerRepositories({ resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    const classement = await useCase.execute('event-2');
    const parPilote = new Map(classement.map((c) => [c.piloteId, c]));

    expect(parPilote.get('rider-2')?.pointsCumules).toBe(20);
    expect(parPilote.get('rider-3')?.pointsCumules).toBe(20);
    expect(parPilote.get('rider-1')?.positionGenerale).toBe(1);
    expect(parPilote.get('rider-2')?.positionGenerale).toBe(2);
    expect(parPilote.get('rider-3')?.positionGenerale).toBe(2);
  });

  it('départage deux pilotes à points égaux par leur nombre de victoires en RACE (pas en SPRINT)', async () => {
    const resultats = [
      new SessionResults('r1', 'event-1', 'RACE', 'TERMINE', 1, 'rider-2', 'contrat-1'), // 25, 1 victoire RACE
      new SessionResults('r2', 'event-1', 'SPRINT', 'TERMINE', 1, 'rider-3', 'contrat-1'), // 12 (une victoire, mais en SPRINT : ignorée du départage)
      new SessionResults('r3', 'event-1', 'RACE', 'TERMINE', 4, 'rider-3', 'contrat-1'), // 13 -> total 25, 0 victoire RACE
    ];
    const repos = creerRepositories({
      events: [ROUND_1],
      evenementCible: ROUND_1,
      resultats,
    });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    const classement = await useCase.execute('event-1');
    const parPilote = new Map(classement.map((c) => [c.piloteId, c]));

    expect(parPilote.get('rider-2')?.pointsCumules).toBe(25);
    expect(parPilote.get('rider-3')?.pointsCumules).toBe(25);
    // Même total de points, mais rider-2 a une victoire en RACE : il passe devant.
    // La victoire au sprint de rider-3 ne compte pas pour ce départage.
    expect(parPilote.get('rider-2')?.positionGenerale).toBe(1);
    expect(parPilote.get('rider-3')?.positionGenerale).toBe(2);
  });

  it('enregistre le classement pour ce round via le repository', async () => {
    const resultats = sessionsCompletes('event-2', 'rider-1');
    const repos = creerRepositories({ events: [ROUND_2], resultats });
    const useCase = new CalculerRiderStandingsUseCase(
      repos.raceEventRepository,
      repos.sessionResultsRepository,
      repos.riderStandingsRepository,
    );

    const classement = await useCase.execute('event-2');

    expect(repos.riderStandingsRepository.saveAll).toHaveBeenCalledTimes(1);
    expect(classement[0].eventId).toBe('event-2');
  });
});
