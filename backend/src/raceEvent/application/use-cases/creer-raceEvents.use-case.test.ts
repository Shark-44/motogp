// application/use-cases/creer-raceEvents.use-case.test.ts
import { describe, expect, it, vi } from 'vitest';
import { CreerRaceEventsUseCase } from './creer-raceEvents.use-case.js';
import { RaceEvent } from '../../domaine/entities/raceEvent.entity.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

describe('CreerRaceEventsUseCase', () => {
  it('crée un événement quand aucune date en conflit n\'existe', async () => {
    // On simule un repository : findByDate ne trouve rien (aucun conflit),
    // createEvent renvoie un RaceEvent construit à partir de ce qu'on lui donne.
    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn().mockResolvedValue(null),
      createEvent: vi.fn().mockImplementation(
        async (nom, saison, date, statut, circuitId) =>
          new RaceEvent('1', nom, saison, date, statut, circuitId),
      ),
      findById: vi.fn(),
      updateEvent: vi.fn(),
    };

    const useCase = new CreerRaceEventsUseCase(fakeRepository);
    const date = new Date('2026-05-10');

    const result = await useCase.execute('GP de France', 2026, date, 'PLANIFIE', 'circuit-lemans');

    expect(result).toBeInstanceOf(RaceEvent);
    expect(result.nom).toBe('GP de France');
    expect(fakeRepository.createEvent).toHaveBeenCalledWith(
      'GP de France', 2026, date, 'PLANIFIE', 'circuit-lemans',
    );
  });

  it('lève une erreur si un événement existe déjà à cette date', async () => {
    const date = new Date('2026-05-10');
    const evenementExistant = new RaceEvent('1', 'GP existant', 2026, date, 'PLANIFIE', 'circuit-x');

    const fakeRepository: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn().mockResolvedValue(evenementExistant),
      createEvent: vi.fn(),
      findById: vi.fn(),
      updateEvent: vi.fn(),
    };

    const useCase = new CreerRaceEventsUseCase(fakeRepository);

    await expect(
      useCase.execute('GP de France', 2026, date, 'PLANIFIE', 'circuit-lemans'),
    ).rejects.toThrow('Un événement est déjà prévu à cette date : GP existant');

    // Vérifie que createEvent n'a jamais été appelé : la garde a bien arrêté le flux
    expect(fakeRepository.createEvent).not.toHaveBeenCalled();
  });
});