import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreerContractUseCase } from './creer-contract.use-case.js';
import { Contract, RoleContract } from '../../domaine/entities/contract.entity.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { TeamRepositoryPort } from '../../../teams/domaine/ports/out/team-repository.port.js';
import { Rider } from '../../../riders/domaine/entities/rider.entity.js';
import { Team } from '../../../teams/domaine/entities/team.entity.js';

describe('CreerContractUseCase', () => {
  let mockContractRepo: ContractRepositoryPort;
  let mockRiderRepo: RiderRepositoryPort;
  let mockTeamRepo: TeamRepositoryPort;

  beforeEach(() => {
    mockContractRepo = {
      findAll: vi.fn(),
      create: vi.fn().mockImplementation(
        async (piloteId: string, equipeId: string, saison: number, role: RoleContract) =>
          new Contract('1', saison, role, piloteId, equipeId)
      ),
    };

    mockRiderRepo = {
      findById: vi.fn(),
      findAll: vi.fn(),
    };

    mockTeamRepo = {
      findById: vi.fn(),
      findAll: vi.fn(),
    };
  });

  it('crée un contrat lorsque le pilote et l\'équipe existent', async () => {
    
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(
      new Rider('rider-44', 'Espargaró', 'Pol', 'ES',new Date('1991-06-10'), 'photo') 
    );
    vi.mocked(mockTeamRepo.findById).mockResolvedValue(
      new Team('team-ducati', 'Ducati Lenovo Team', 'Italy', 'Ducati', true, 'logo') 
    );

    const useCase = new CreerContractUseCase(mockContractRepo, mockRiderRepo, mockTeamRepo);

    
    const result = await useCase.execute('rider-44', 'team-ducati', 2026, 'officiel');

    
    expect(result).toBeInstanceOf(Contract);
    expect(result.id).toBe('1');
    expect(result.saison).toBe(2026);
    expect(result.role).toBe('officiel');
    expect(mockContractRepo.create).toHaveBeenCalledWith('rider-44', 'team-ducati', 2026, 'officiel');
  });

  it('lève une erreur si le pilote n\'existe pas', async () => {
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(null);
    vi.mocked(mockTeamRepo.findById).mockResolvedValue(
      new Team('team-ducati', 'Ducati Lenovo Team', 'Italy', 'Ducati', true, 'logo')
    );

    const useCase = new CreerContractUseCase(mockContractRepo, mockRiderRepo, mockTeamRepo);

    await expect(
      useCase.execute('rider-inconnu', 'team-ducati', 2026, 'officiel')
    ).rejects.toThrow("Aucun pilote trouvé avec l'id rider-inconnu");

    expect(mockContractRepo.create).not.toHaveBeenCalled();
  });

  it('lève une erreur si l\'équipe n\'existe pas', async () => {
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(
      new Rider('rider-44', 'Espargaró', 'Pol', 'ES',new Date('1991-06-10'), 'photo')
    );
    vi.mocked(mockTeamRepo.findById).mockResolvedValue(null);

    const useCase = new CreerContractUseCase(mockContractRepo, mockRiderRepo, mockTeamRepo);

    await expect(
      useCase.execute('rider-44', 'team-inconnue', 2026, 'officiel')
    ).rejects.toThrow("Aucune équipe trouvée avec l'id team-inconnue");

    expect(mockContractRepo.create).not.toHaveBeenCalled();
  });
});