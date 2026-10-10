import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListerDetailRiderStandingsUseCase } from './listerByEvent-riderStandings.use-case.js';
import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';

// ---------------------------------------------------------------------------
// Fixtures
// Les champs non utilisés par le use case (positionGenerale, pointsCumules...)
// sont là pour vérifier qu'ils sont bien conservés par le spread `...ligne`.
// Ajuste-les si ton entité RiderStandings a des noms différents.
// ---------------------------------------------------------------------------
const EVENT_ID = 'event-thailande';

const evenement = {
  id: EVENT_ID,
  nom: 'Grand Prix de Thaïlande',
  date: new Date('2026-03-01'),
  circuitId: 'circuit-buriram',
};

const pilotes = [
  { id: 'p1', nom: 'Bagnaia', prenom: 'Francesco' },
  { id: 'p2', nom: 'Martin', prenom: 'Jorge' },
  { id: 'p3', nom: 'Marquez', prenom: 'Marc' },
  { id: 'p4', nom: 'Quartararo', prenom: 'Fabio' }, // présent en base mais pas au classement
];

const classement = [
  { id: 'c1', piloteId: 'p2', eventId: EVENT_ID, positionGenerale: 1, pointsCumules: 37 },
  { id: 'c2', piloteId: 'p1', eventId: EVENT_ID, positionGenerale: 2, pointsCumules: 29 },
  { id: 'c3', piloteId: 'p3', eventId: EVENT_ID, positionGenerale: 3, pointsCumules: 22 },
];

// ---------------------------------------------------------------------------
// Mocks des ports (seules les méthodes utilisées par le use case sont mockées)
// ---------------------------------------------------------------------------
function creerMocks() {
  const riderStandingsRepository = {
    findByEventId: vi.fn(),
  };
  const riderRepository = {
    findAll: vi.fn(),
    findById: vi.fn(), // sert à vérifier qu'on ne l'appelle PAS (pas de N+1)
  };
  const raceEventRepository = {
    findById: vi.fn(),
  };

  const useCase = new ListerDetailRiderStandingsUseCase(
    riderStandingsRepository as unknown as RiderStandingsRepositoryPort,
    riderRepository as unknown as RiderRepositoryPort,
    raceEventRepository as unknown as RaceEventRepositoryPort,
  );

  return { useCase, riderStandingsRepository, riderRepository, raceEventRepository };
}

describe('ListerDetailRiderStandingsUseCase', () => {
  let mocks: ReturnType<typeof creerMocks>;

  beforeEach(() => {
    mocks = creerMocks();
    mocks.riderStandingsRepository.findByEventId.mockResolvedValue(classement);
    mocks.riderRepository.findAll.mockResolvedValue(pilotes);
    mocks.raceEventRepository.findById.mockResolvedValue(evenement);
  });

  it("enrichit chaque ligne avec le nom et le prénom du pilote", async () => {
    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat).toHaveLength(3);
    expect(resultat[0]).toMatchObject({ piloteId: 'p2', nom: 'Martin', prenom: 'Jorge' });
    expect(resultat[1]).toMatchObject({ piloteId: 'p1', nom: 'Bagnaia', prenom: 'Francesco' });
    expect(resultat[2]).toMatchObject({ piloteId: 'p3', nom: 'Marquez', prenom: 'Marc' });
  });

  it("ajoute à chaque ligne le nom, la date et le circuit de l'événement", async () => {
    const resultat = await mocks.useCase.execute(EVENT_ID);

    for (const ligne of resultat) {
      expect(ligne).toMatchObject({
        nomEvent: 'Grand Prix de Thaïlande',
        dateEvent: evenement.date,
        circuitEvent: 'circuit-buriram',
      });
    }
  });

  it("conserve les champs d'origine de la ligne de classement", async () => {
    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat[0]).toMatchObject({
      id: 'c1',
      eventId: EVENT_ID,
      positionGenerale: 1,
      pointsCumules: 37,
    });
  });

  it("conserve l'ordre renvoyé par le repository (le tri est la garantie du port)", async () => {
    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat.map((l) => l.piloteId)).toEqual(['p2', 'p1', 'p3']);
  });

  it("n'inclut pas les pilotes absents du classement", async () => {
    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat.some((l) => l.piloteId === 'p4')).toBe(false);
  });

  it("renvoie un tableau vide si le classement est vide", async () => {
    mocks.riderStandingsRepository.findByEventId.mockResolvedValue([]);

    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat).toEqual([]);
  });

  it("laisse nom et prénom à undefined si le pilote est introuvable, sans planter", async () => {
    mocks.riderStandingsRepository.findByEventId.mockResolvedValue([
      { id: 'c9', piloteId: 'pilote-inconnu', eventId: EVENT_ID, positionGenerale: 1, pointsCumules: 25 },
    ]);

    const resultat = await mocks.useCase.execute(EVENT_ID);

    expect(resultat).toHaveLength(1);
    expect(resultat[0].nom).toBeUndefined();
    expect(resultat[0].prenom).toBeUndefined();
    expect(resultat[0].nomEvent).toBe('Grand Prix de Thaïlande');
  });

  it("lève une erreur si l'événement n'existe pas", async () => {
    mocks.raceEventRepository.findById.mockResolvedValue(null);

    await expect(mocks.useCase.execute('event-fantome')).rejects.toThrow(
      "Aucun événement trouvé avec l'id event-fantome",
    );
  });

  it("interroge les repositories avec le bon eventId", async () => {
    await mocks.useCase.execute(EVENT_ID);

    expect(mocks.riderStandingsRepository.findByEventId).toHaveBeenCalledTimes(1);
    expect(mocks.riderStandingsRepository.findByEventId).toHaveBeenCalledWith(EVENT_ID);
    expect(mocks.raceEventRepository.findById).toHaveBeenCalledTimes(1);
    expect(mocks.raceEventRepository.findById).toHaveBeenCalledWith(EVENT_ID);
  });

  it("charge les pilotes en un seul appel findAll (pas de findById par ligne)", async () => {
    await mocks.useCase.execute(EVENT_ID);

    expect(mocks.riderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mocks.riderRepository.findById).not.toHaveBeenCalled();
  });

  it("propage l'erreur si le repository de classement échoue", async () => {
    mocks.riderStandingsRepository.findByEventId.mockRejectedValue(new Error('DB indisponible'));

    await expect(mocks.useCase.execute(EVENT_ID)).rejects.toThrow('DB indisponible');
  });
});
