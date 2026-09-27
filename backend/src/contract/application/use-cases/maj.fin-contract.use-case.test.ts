import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MajFinContractUseCase } from './maj.fin-contract.use-case.js';
import { Contract, RoleContract } from '../../domaine/entities/contract.entity.js';
import type { ContractRepositoryPort } from '../../domaine/ports/out/contract-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { ContractValidatorService } from '../../domaine/services/service-contract.js';
import { Rider } from '../../../riders/domaine/entities/rider.entity.js';

describe('MajFinContractUseCase', () => {
  let mockContractRepo: ContractRepositoryPort;
  let mockRiderRepo: RiderRepositoryPort;
  let mockContractValidator: ContractValidatorService;

  beforeEach(() => {
    mockContractRepo = {
      findAll: vi.fn(),
      create: vi.fn(),
      findActiveContractForRider: vi.fn(),
      findNbreContratByTeam: vi.fn(),
      findLastContractForRider: vi.fn(),
      findAllContractsForRider: vi.fn(),
      updateFinContrat: vi.fn().mockImplementation(
        async (id: string, nouvelleDateFin: Date) =>
          new Contract(id, 2026, 'officiel' as RoleContract, new Date('2026-01-01'), nouvelleDateFin, 'rider-44', 'team-ducati')
      ),
    };

    mockRiderRepo = {
      findById: vi.fn(),
      findAll: vi.fn(),
    };

    mockContractValidator = {
      validerNouvelleDateFin: vi.fn().mockResolvedValue(true),
    } as unknown as ContractValidatorService;
  });

  it('met à jour la date de fin lorsque le pilote et le contrat actif existent', async () => {
    // Garde-fou 1 : Le pilote existe
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(
      new Rider('rider-44', '44', 'Espargaró', 'Pol', 'ES', new Date('1991-06-10'), 'photo')
    );

    // Garde-fou 2 : Le contrat actif existe
    const contratExistant = new Contract(
      'contract-101',
      2026,
      'officiel' as RoleContract,
      new Date('2026-01-01'),
      new Date('2026-12-01'),
      'rider-44',
      'team-ducati'
    );
    vi.mocked(mockContractRepo.findActiveContractForRider).mockResolvedValue(contratExistant);

    // L'ordre des arguments correspond à ton constructeur : (ContractRepo, Validator, RiderRepo)
    const useCase = new MajFinContractUseCase(mockContractRepo, mockContractValidator, mockRiderRepo);

    const dateDebut = new Date('2026-01-01');
    const dateFin = new Date('2026-12-01');
    const nouvelleDateFin = new Date('2026-10-31');

    const result = await useCase.execute('rider-44', dateDebut, dateFin, nouvelleDateFin);

    expect(result).toBeInstanceOf(Contract);
    expect(result.id).toBe('contract-101');
    expect(result.dateFin).toEqual(nouvelleDateFin);

    expect(mockRiderRepo.findById).toHaveBeenCalledWith('rider-44');
    expect(mockContractRepo.findActiveContractForRider).toHaveBeenCalledWith('rider-44', dateDebut, dateFin);
    expect(mockContractValidator.validerNouvelleDateFin).toHaveBeenCalledWith(nouvelleDateFin);
    expect(mockContractRepo.updateFinContrat).toHaveBeenCalledWith('contract-101', nouvelleDateFin);
  });

  it('lève une erreur si le pilote n\'existe pas (Garde-fou #1)', async () => {
    // Le pilote n'existe pas
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(null);

    const useCase = new MajFinContractUseCase(mockContractRepo, mockContractValidator, mockRiderRepo);

    await expect(
      useCase.execute('rider-inconnu', new Date('2026-01-01'), new Date('2026-12-01'), new Date('2026-10-31'))
    ).rejects.toThrow('Pilote introuvable : rider-inconnu');

    // On vérifie que la chaîne s'arrête net : aucun appel au repo contrat ni au validateur
    expect(mockContractRepo.findActiveContractForRider).not.toHaveBeenCalled();
    expect(mockContractValidator.validerNouvelleDateFin).not.toHaveBeenCalled();
    expect(mockContractRepo.updateFinContrat).not.toHaveBeenCalled();
  });

  it('lève une erreur si aucun contrat actif n\'est trouvé pour ce pilote', async () => {
    // Le pilote existe...
    vi.mocked(mockRiderRepo.findById).mockResolvedValue(
      new Rider('rider-44', '44', 'Espargaró', 'Pol', 'ES', new Date('1991-06-10'), 'photo')
    );
    // ...mais pas de contrat actif trouvé
    vi.mocked(mockContractRepo.findActiveContractForRider).mockResolvedValue(null);

    const useCase = new MajFinContractUseCase(mockContractRepo, mockContractValidator, mockRiderRepo);

    await expect(
      useCase.execute('rider-44', new Date('2026-01-01'), new Date('2026-12-01'), new Date('2026-10-31'))
    ).rejects.toThrow('Aucun contrat actif trouvé pour le pilote rider-44');

    expect(mockContractValidator.validerNouvelleDateFin).not.toHaveBeenCalled();
    expect(mockContractRepo.updateFinContrat).not.toHaveBeenCalled();
  });
});