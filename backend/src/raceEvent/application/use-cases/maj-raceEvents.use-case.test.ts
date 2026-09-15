// application/use-cases/maj-raceEvents.use-case.test.ts
import { describe, expect, it, vi } from 'vitest';
import { MajRaceEventsUseCase } from './maj-raceEvents.use-case.js';
import { RaceEvent } from '../../domaine/entities/raceEvent.entity.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

describe('MajRaceEventsUseCase', () => {
  it('passe un événement passé et non terminé au statut TERMINE', async () => {
    const dateDejaPassee = new Date('2020-01-01');
    const evenementExistant = new RaceEvent('1', 'GP Test', 2026, dateDejaPassee, 'PLANIFIE', 'circuit-1');

    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      findById: vi.fn().mockResolvedValue(evenementExistant),
      createEvent: vi.fn(),
      updateEvent: vi.fn().mockImplementation(async (raceEvent: RaceEvent) => raceEvent),
    };

    const useCase = new MajRaceEventsUseCase(fakeRepository);
    const result = await useCase.execute('1');

    expect(result.statut).toBe('TERMINE');
    expect(fakeRepository.updateEvent).toHaveBeenCalled();
  });

  it('lève une erreur si l\'événement n\'existe pas', async () => {
    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
    };

    const useCase = new MajRaceEventsUseCase(fakeRepository);

    await expect(useCase.execute('id-inconnu')).rejects.toThrow('Aucun evenement pour : id-inconnu');
    expect(fakeRepository.updateEvent).not.toHaveBeenCalled();
  });

  it('lève une erreur si l\'événement n\'a pas encore eu lieu', async () => {
    const dateFuture = new Date('2099-01-01');
    const evenementFutur = new RaceEvent('1', 'GP Futur', 2026, dateFuture, 'PLANIFIE', 'circuit-1');

    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      findById: vi.fn().mockResolvedValue(evenementFutur),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
    };

    const useCase = new MajRaceEventsUseCase(fakeRepository);

    await expect(useCase.execute('1')).rejects.toThrow(/n'a pas encore eu lieu/);
    expect(fakeRepository.updateEvent).not.toHaveBeenCalled();
  });

  it('lève une erreur si l\'événement est déjà TERMINE', async () => {
    const dateDejaPassee = new Date('2020-01-01');
    const evenementTermine = new RaceEvent('1', 'GP Fini', 2026, dateDejaPassee, 'TERMINE', 'circuit-1');

    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      findById: vi.fn().mockResolvedValue(evenementTermine),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
    };

    const useCase = new MajRaceEventsUseCase(fakeRepository);

    await expect(useCase.execute('1')).rejects.toThrow('L\'evenement est déjà : TERMINE');
    expect(fakeRepository.updateEvent).not.toHaveBeenCalled();
  });
});