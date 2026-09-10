import { describe, expect, it, vi } from 'vitest';
import { ListerTeamsUseCase } from './lister-teams.use-case.js';
import { Team } from '../../domaine/entities/team.entity.js';
import type { TeamRepositoryPort } from '../../domaine/ports/out/team-repository.port.js';

describe('ListerTeamsUseCase', () => {
  it('retourne les equipes fournis par le port, sans base de données réelle', async () => {
    const fakeRepository: TeamRepositoryPort = {
      findAll: async () => [new Team('1', 'Ducati', 'Ducati','italie',true, 'logo')],
      findById: vi.fn(),
    };

    const useCase = new ListerTeamsUseCase(fakeRepository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Ducati');
  });
});
