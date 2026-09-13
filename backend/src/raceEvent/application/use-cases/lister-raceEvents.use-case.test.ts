import { describe, expect, it } from 'vitest';
import { ListerRaceEventsUseCase } from './lister-raceEvents.use-case.js';
import { RaceEvent } from '../../domaine/entities/raceEvent.entity.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

describe('ListerCircuitsUseCase', () => {
  it('retourne les circuits fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: RaceEventRepositoryPort = {
      findAll: async () => [new RaceEvent('1', 'Le Mans', 2026 , new Date('2000-01-01'), 'TERMINE','01')],
    };

    const useCase = new ListerRaceEventsUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Le Mans');
  });
});
