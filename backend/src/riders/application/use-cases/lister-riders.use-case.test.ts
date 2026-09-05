import { describe, expect, it } from 'vitest';
import { ListerRidersUseCase } from './lister-riders.use-case.js';
import { Rider } from '../../domaine/entities/rider.entity.js';
import type { RiderRepositoryPort } from '../../domaine/ports/out/rider-repository.port.js';

describe('ListerRidersUseCase', () => {
  it('retourne les pilotes fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: RiderRepositoryPort = {
      findAll: async () => [new Rider('1', 'Quataro', 'Fabio', 'France',  new Date('2000-01-01'), 'photo')],
    };

    const useCase = new ListerRidersUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Quataro');
  });
});
