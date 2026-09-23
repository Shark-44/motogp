import { describe, expect, it } from 'vitest';
import { ListerSessionResultUseCase } from './lister-sessionResults.use-case.js';
import { SessionResults } from '../../domaine/entities/sessionResults.entity.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';

describe('ListerCircuitsUseCase', () => {
  it('retourne les circuits fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: SessionResultsRepositoryPort = {
      findAll: async () => [new SessionResults('1', 'Le Mans', 'RACE' , 'TERMINE', 1, '1')],
    };

    const useCase = new ListerSessionResultUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].eventId).toBe('Le Mans');
  });
});
