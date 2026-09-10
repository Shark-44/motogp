import { describe, expect, it } from 'vitest';
import { CreerContractUseCase } from './creer-contract.use-case.js';
import { Contract, RoleContract } from '../../domaine/entities/contract.entity.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';

describe('CreerContractUseCase', () => {
  it('crée un contrat via le port, sans base de données réelle', async () => {
    const fakeRepository: ContractRepositoryPort = {
      findAll: async () => [],
      create: async (piloteId: string, equipeId: string, saison: number, role: RoleContract ) => {
        return new Contract('1', saison, role, piloteId, equipeId);
      },
    };

    const useCase = new CreerContractUseCase(fakeRepository);
    
    const result = await useCase.execute('rider-44', 'team-ducati', 2026, 'officiel' as const);

    expect(result).toBeInstanceOf(Contract);
    expect(result.id).toBe('1');
    expect(result.saison).toBe(2026);
    expect(result.role).toBe('officiel');
  });
});