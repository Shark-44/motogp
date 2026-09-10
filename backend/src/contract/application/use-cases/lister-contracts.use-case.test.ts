// application/use-cases/lister-contracts.use-case.test.ts

import { describe, expect, it } from 'vitest';
import { ListerContractsUseCase } from './lister-contracts.use-case.js';
import { Contract } from '../../domaine/entities/contract.entity.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';

describe('ListerContractsUseCase', () => {
  it('retourne les contrats fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: ContractRepositoryPort = {
      findAll: async () => [new Contract('1', 2026, 'officiel', '1', '1')],
      create: async (piloteId, equipeId, saison, role) => new Contract('1', saison, role, piloteId, equipeId),
    };

    const useCase = new ListerContractsUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].saison).toBe(2026);
  });
});