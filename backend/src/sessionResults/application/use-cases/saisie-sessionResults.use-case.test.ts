import { describe, expect, it, vi } from 'vitest';
import { SaisieSessionResultsUseCase } from './saisie-sessionResults.use-case.js';
import type { ResultatSaisi } from '../ports/in/saisie-sessionResults.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';
import { RaceEvent } from '../../../raceEvent/domaine/entities/raceEvent.entity.js';
import { Rider } from '../../../riders/domaine/entities/rider.entity.js';

const EVENT_ID = 'event-1';

function creerEvenement(statut: 'PLANIFIE' | 'TERMINE' | 'ANNULE'): RaceEvent {
  return new RaceEvent(EVENT_ID, 'GP Test', 2026, new Date('2026-05-01'), statut, 'circuit-1');
}

// 20 pilotes avec des fimNumber '1' à '20', bornant les tests dans la fourchette 18-24
function creerPilotes(nombre: number): Rider[] {
  return Array.from({ length: nombre }, (_, i) =>
    new Rider(`rider-${i + 1}`, String(i + 1), `Nom${i + 1}`, `Prenom${i + 1}`, 'FR', new Date('1995-01-01'), 'photo.jpg'),
  );
}

function creerResultats(nombre: number): ResultatSaisi[] {
  return Array.from({ length: nombre }, (_, i) => ({
    typeSession: 'RACE' as const,
    statut: 'TERMINE' as const,
    position: i + 1,
    fimNumber: String(i + 1),
  }));
}

function creerRepositories(overrides?: {
  evenement?: RaceEvent | null;
  pilotes?: Rider[];
}) {
  const raceEventRepository: RaceEventRepositoryPort = {
    findAll: vi.fn(),
    findByDate: vi.fn(),
    createEvent: vi.fn(),
    findById: vi.fn(async () =>
      overrides && 'evenement' in overrides ? overrides.evenement! : creerEvenement('TERMINE'),
    ),
    updateEvent: vi.fn(),
    chercherDernierEventTermine: vi.fn(),
    chercherProchainEventPlanifie: vi.fn(),
  };

  const riderRepository: RiderRepositoryPort = {
    findAll: vi.fn(async () => overrides?.pilotes ?? creerPilotes(20)),
    findById: vi.fn(),
  };

  const sessionResultsRepository: SessionResultsRepositoryPort = {
    findAll: vi.fn(),
    saveAll: vi.fn(async (results) => results),
  };

  return { raceEventRepository, riderRepository, sessionResultsRepository };
}

describe('SaisieSessionResultsUseCase', () => {
  it("refuse la saisie si l'événement n'existe pas", async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories({ evenement: null });
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('Aucun événement trouvé');
  });

  it("refuse la saisie si l'événement n'est pas TERMINE", async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories({
      evenement: creerEvenement('PLANIFIE'),
    });
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('doit être terminé');
  });

  it('refuse un lot en dessous de la borne de plausibilité (moins de 18)', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories({
      pilotes: creerPilotes(17),
    });
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    await expect(useCase.execute(EVENT_ID, creerResultats(17))).rejects.toThrow('entre 18 et 24');
  });

  it('refuse un lot au-dessus de la borne de plausibilité (plus de 24)', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories({
      pilotes: creerPilotes(25),
    });
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    await expect(useCase.execute(EVENT_ID, creerResultats(25))).rejects.toThrow('entre 18 et 24');
  });

  it('refuse un lot mélangeant SPRINT et RACE', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories();
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    const resultats = creerResultats(20);
    resultats[0] = { ...resultats[0], typeSession: 'SPRINT' };

    await expect(useCase.execute(EVENT_ID, resultats)).rejects.toThrow('un seul type de session');
  });

  it('refuse un lot avec un numéro de course en double', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories();
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    const resultats = creerResultats(20);
    resultats[1] = { ...resultats[1], fimNumber: resultats[0].fimNumber };

    await expect(useCase.execute(EVENT_ID, resultats)).rejects.toThrow('Numéro de course en double');
  });

  it('refuse un lot avec une position en double', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories();
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    const resultats = creerResultats(20);
    resultats[1] = { ...resultats[1], position: resultats[0].position };

    await expect(useCase.execute(EVENT_ID, resultats)).rejects.toThrow('Position en double');
  });

  it('refuse un fimNumber inconnu du référentiel pilotes', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories({
      pilotes: creerPilotes(19), // pilote 20 absent, mais le lot en réclame 20
    });
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow(
      'Aucun pilote trouvé avec le numéro de course 20',
    );
  });

  it('résout chaque fimNumber en piloteId et enregistre le lot en un seul appel', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories();
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    const resultats = creerResultats(20);
    const resultat = await useCase.execute(EVENT_ID, resultats);

    expect(riderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(sessionResultsRepository.saveAll).toHaveBeenCalledTimes(1);
    expect(resultat).toHaveLength(20);
    expect(resultat[0].piloteId).toBe('rider-1');
    expect(resultat[0].eventId).toBe(EVENT_ID);
  });

  it('accepte un statut ABANDON/NON_PARTANT avec position null', async () => {
    const { raceEventRepository, riderRepository, sessionResultsRepository } = creerRepositories();
    const useCase = new SaisieSessionResultsUseCase(raceEventRepository, riderRepository, sessionResultsRepository);

    const resultats = creerResultats(20);
    resultats[19] = { ...resultats[19], statut: 'NON_PARTANT', position: null };

    const resultat = await useCase.execute(EVENT_ID, resultats);

    expect(resultat[19].statut).toBe('NON_PARTANT');
    expect(resultat[19].position).toBeNull();
  });
});
