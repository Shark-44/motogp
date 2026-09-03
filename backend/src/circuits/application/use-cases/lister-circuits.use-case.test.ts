import { describe, expect, it } from 'vitest';
import { ListerCircuitsUseCase } from './lister-circuits.use-case.js';
import { Circuit } from '../../domaine/entities/circuit.entity.js';
import type { CircuitRepositoryPort } from '../../domaine/ports/out/circuit-repository.port.js';

describe('ListerCircuitsUseCase', () => {
  it('retourne les circuits fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: CircuitRepositoryPort = {
      findAll: async () => [new Circuit('1', 'Le Mans', 'France',  4.185, 14,'photo')],
    };

    const useCase = new ListerCircuitsUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Le Mans');
  });
});
