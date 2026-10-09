import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListerRiderStandingsUseCase } from './lister-riderStandings.use-case.js';
import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';

// ---------------------------------------------------------------------------
// Fixtures
// Les champs non utilisés par le use case (positionGenerale, pointsCumules...)
// sont là pour vérifier qu'ils sont bien conservés par le spread `...ligne`.
// Ajuste-les si ton entité RiderStandings a des noms différents.
// ---------------------------------------------------------------------------
const EVENT_THAI = 'event-thailande';
const EVENT_ARG = 'event-argentine';

const evenements = [
  {
    id: EVENT_THAI,
    nom: 'Grand Prix de Thaïlande',
    date: new Date('2026-03-01'),
    circuitId: 'circuit-buriram',
  },
  {
    id: EVENT_ARG,
    nom: "Grand Prix d'Argentine",
    date: new Date('2026-03-15'),
    circuitId: 'circuit-termas',
  },
  {
    id: 'event-non-demande', // présent en base mais pas dans eventIds
    nom: 'Grand Prix des Amériques',
    date: new Date('2026-04-12'),
    circuitId: 'circuit-cota',
  },
];

const pilotes = [
  { id: 'p1', nom: 'Bagnaia', prenom: 'Francesco' },
  { id: 'p2', nom: 'Martin', prenom: 'Jorge' },
  { id: 'p3', nom: 'Marquez', prenom: 'Marc' },
  { id: 'p4', nom: 'Quartararo', prenom: 'Fabio' }, // présent en base mais pas au classement
];

// Classement sur deux événements, trié par le repository (event puis position)
const classement = [
  { id: 'c1', piloteId: 'p2', eventId: EVENT_THAI, positionGenerale: 1, pointsCumules: 37 },
  { id: 'c2', piloteId: 'p1', eventId: EVENT_THAI, positionGenerale: 2, pointsCumules: 29 },
  { id: 'c3', piloteId: 'p1', eventId: EVENT_ARG, positionGenerale: 1, pointsCumules: 54 },
  { id: 'c4', piloteId: 'p2', eventId: EVENT_ARG, positionGenerale: 2, pointsCumules: 50 },
];

// ---------------------------------------------------------------------------
// Mocks des ports (seules les méthodes utilisées par le use case sont mockées)
// ---------------------------------------------------------------------------
function creerMocks() {
  const riderStandingsRepository = {
    findByEventIds: vi.fn(),
  };
  const riderRepository = {
    findAll: vi.fn(),
    findById: vi.fn(), // sert à vérifier qu'on ne l'appelle PAS (pas de N+1)
  };
  const raceEventRepository = {
    findAll: vi.fn(),
    findById: vi.fn(), // idem
  };

  const useCase = new ListerRiderStandingsUseCase(
    riderStandingsRepository as unknown as RiderStandingsRepositoryPort,
    riderRepository as unknown as RiderRepositoryPort,
    raceEventRepository as unknown as RaceEventRepositoryPort,
  );

  return { useCase, riderStandingsRepository, riderRepository, raceEventRepository };
}

describe('ListerRiderStandingsUseCase', () => {
  let mocks: ReturnType<typeof creerMocks>;

  beforeEach(() => {
    mocks = creerMocks();
    mocks.riderStandingsRepository.findByEventIds.mockResolvedValue(classement);
    mocks.riderRepository.findAll.mockResolvedValue(pilotes);
    mocks.raceEventRepository.findAll.mockResolvedValue(evenements);
  });

  it("enrichit chaque ligne avec le nom et le prénom du pilote", async () => {
    const resultat = await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(resultat).toHaveLength(4);
    expect(resultat[0]).toMatchObject({ piloteId: 'p2', nom: 'Martin', prenom: 'Jorge' });
    expect(resultat[1]).toMatchObject({ piloteId: 'p1', nom: 'Bagnaia', prenom: 'Francesco' });
    expect(resultat[2]).toMatchObject({ piloteId: 'p1', nom: 'Bagnaia', prenom: 'Francesco' });
    expect(resultat[3]).toMatchObject({ piloteId: 'p2', nom: 'Martin', prenom: 'Jorge' });
  });

  it("associe à chaque ligne les détails de SON événement (plusieurs événements)", async () => {
    const resultat = await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(resultat[0]).toMatchObject({
      eventId: EVENT_THAI,
      nomEvent: 'Grand Prix de Thaïlande',
      dateEvent: evenements[0].date,
      circuitEvent: 'circuit-buriram',
    });
    expect(resultat[2]).toMatchObject({
      eventId: EVENT_ARG,
      nomEvent: "Grand Prix d'Argentine",
      dateEvent: evenements[1].date,
      circuitEvent: 'circuit-termas',
    });
  });

  it("conserve les champs d'origine de la ligne de classement", async () => {
    const resultat = await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(resultat[0]).toMatchObject({
      id: 'c1',
      eventId: EVENT_THAI,
      positionGenerale: 1,
      pointsCumules: 37,
    });
  });

  it("conserve l'ordre renvoyé par le repository (le tri est la garantie du port)", async () => {
    const resultat = await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(resultat.map((l) => l.id)).toEqual(['c1', 'c2', 'c3', 'c4']);
  });

  it("n'inclut ni les pilotes absents du classement ni les événements non demandés", async () => {
    const resultat = await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(resultat.some((l) => l.piloteId === 'p4')).toBe(false);
    expect(resultat).not.toContainEqual(
      expect.objectContaining({ nomEvent: 'Grand Prix des Amériques' }),
    );
  });

  it("renvoie un tableau vide si le classement est vide", async () => {
    mocks.riderStandingsRepository.findByEventIds.mockResolvedValue([]);

    const resultat = await mocks.useCase.execute([EVENT_THAI]);

    expect(resultat).toEqual([]);
  });

  it("renvoie un tableau vide si aucun eventId n'est fourni", async () => {
    mocks.riderStandingsRepository.findByEventIds.mockResolvedValue([]);

    const resultat = await mocks.useCase.execute([]);

    expect(resultat).toEqual([]);
    expect(mocks.riderStandingsRepository.findByEventIds).toHaveBeenCalledWith([]);
  });

  it("laisse nom et prénom à undefined si le pilote est introuvable, sans planter", async () => {
    mocks.riderStandingsRepository.findByEventIds.mockResolvedValue([
      { id: 'c9', piloteId: 'pilote-inconnu', eventId: EVENT_THAI, positionGenerale: 1, pointsCumules: 25 },
    ]);

    const resultat = await mocks.useCase.execute([EVENT_THAI]);

    expect(resultat).toHaveLength(1);
    expect(resultat[0]).toMatchObject({ nomEvent: 'Grand Prix de Thaïlande' });
    expect(resultat[0]).toHaveProperty('nom', undefined);
    expect(resultat[0]).toHaveProperty('prenom', undefined);
  });

  it("laisse les champs événement à undefined si l'événement est introuvable, sans lever d'erreur", async () => {
    mocks.riderStandingsRepository.findByEventIds.mockResolvedValue([
      { id: 'c9', piloteId: 'p1', eventId: 'event-fantome', positionGenerale: 1, pointsCumules: 25 },
    ]);

    const resultat = await mocks.useCase.execute(['event-fantome']);

    expect(resultat).toHaveLength(1);
    expect(resultat[0]).toMatchObject({ nom: 'Bagnaia', prenom: 'Francesco' });
    expect(resultat[0]).toHaveProperty('nomEvent', undefined);
    expect(resultat[0]).toHaveProperty('dateEvent', undefined);
    expect(resultat[0]).toHaveProperty('circuitEvent', undefined);
  });

  it("transmet les eventIds tels quels au repository de classement", async () => {
    const ids = [EVENT_THAI, EVENT_ARG];

    await mocks.useCase.execute(ids);

    expect(mocks.riderStandingsRepository.findByEventIds).toHaveBeenCalledTimes(1);
    expect(mocks.riderStandingsRepository.findByEventIds).toHaveBeenCalledWith(ids);
  });

  it("charge pilotes et événements en un seul findAll chacun (pas de findById par ligne)", async () => {
    await mocks.useCase.execute([EVENT_THAI, EVENT_ARG]);

    expect(mocks.riderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mocks.raceEventRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mocks.riderRepository.findById).not.toHaveBeenCalled();
    expect(mocks.raceEventRepository.findById).not.toHaveBeenCalled();
  });

  it("propage l'erreur si le repository de classement échoue", async () => {
    mocks.riderStandingsRepository.findByEventIds.mockRejectedValue(new Error('DB indisponible'));

    await expect(mocks.useCase.execute([EVENT_THAI])).rejects.toThrow('DB indisponible');
  });
});
