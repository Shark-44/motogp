// domaine/services/contract-validator.service.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ContractValidatorService } from './service-contract.js';
import { Contract } from '../entities/contract.entity.js';
import { RaceEvent } from '../../../raceEvent/domaine/entities/raceEvent.entity.js';
import type { ContractRepositoryPort } from '../ports/out/contract-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { CircuitRepositoryPort } from '../../../circuits/domaine/ports/out/circuit-repository.port.js';

describe('ContractValidatorService', () => {
  let fakeContractRepository: ContractRepositoryPort;
  let fakeRaceEventRepository: RaceEventRepositoryPort;
  let fakeCircuitRepository: CircuitRepositoryPort;
  let service: ContractValidatorService;

  beforeEach(() => {
    fakeContractRepository = {
      findAll: vi.fn(),
      create: vi.fn(),
      findActiveContractForRider: vi.fn(),
      findNbreContratByTeam: vi.fn(),
      findLastContractForRider: vi.fn(),
      findAllContractsForRider: vi.fn(),
    } as unknown as ContractRepositoryPort;

    fakeRaceEventRepository = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      findById: vi.fn(),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
      chercherDernierEventTermine: vi.fn(),
      chercherProchainEventPlanifie: vi.fn(),
    } as unknown as RaceEventRepositoryPort;

    fakeCircuitRepository = {} as unknown as CircuitRepositoryPort;

    service = new ContractValidatorService(
      fakeContractRepository,
      fakeRaceEventRepository,
      fakeCircuitRepository,
    );
  });

  describe('validerDisponibilite', () => {
    it('lève une erreur si le pilote a déjà un contrat actif sur la période', async () => {
      const contratExistant = new Contract('c1', 2026, 'officiel', new Date('2026-01-01'), new Date('2026-12-31'), 'pilote-1', 'equipe-1');
      fakeContractRepository.findActiveContractForRider = vi.fn().mockResolvedValue(contratExistant);

      await expect(
        service.validerDisponibilite('pilote-1', new Date('2026-01-01'), new Date('2026-12-31')),
      ).rejects.toThrow('Le pilote a déjà un contrat actif sur cette période.');
    });

    it("ne lève pas d'erreur si aucun contrat actif n'existe", async () => {
      fakeContractRepository.findActiveContractForRider = vi.fn().mockResolvedValue(null);

      await expect(
        service.validerDisponibilite('pilote-1', new Date('2026-01-01'), new Date('2026-12-31')),
      ).resolves.not.toThrow();
    });
  });

  describe('validerFenetreSignature', () => {
    it("lève une erreur si l'ancien contrat s'est terminé après le dernier événement terminé", async () => {
      const dernierEvent = new RaceEvent('e1', 'GP Test', 2026, new Date('2026-06-01'), 'TERMINE', 'circuit-1');
      const dernierContrat = new Contract('c1', 2026, 'officiel', new Date('2026-01-01'), new Date('2026-07-01'), 'pilote-1', 'equipe-1');

      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(dernierEvent);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(null);
      fakeContractRepository.findLastContractForRider = vi.fn().mockResolvedValue(dernierContrat);

      await expect(
        service.validerFenetreSignature('pilote-1', new Date('2026-07-05')),
      ).rejects.toThrow(/dernier événement terminé/);
    });

    it('lève une erreur si la date de début dépasse le prochain événement planifié', async () => {
      const prochainEvent = new RaceEvent('e2', 'GP Futur', 2026, new Date('2026-08-01'), 'PLANIFIE', 'circuit-1');

      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(null);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(prochainEvent);
      fakeContractRepository.findLastContractForRider = vi.fn().mockResolvedValue(null);

      await expect(
        service.validerFenetreSignature('pilote-1', new Date('2026-08-01')),
      ).rejects.toThrow(/prochain événement planifié/);
    });

    it('ne lève pas d\'erreur si la fenêtre est respectée', async () => {
      const dernierEvent = new RaceEvent('e1', 'GP Passé', 2026, new Date('2026-05-01'), 'TERMINE', 'circuit-1');
      const prochainEvent = new RaceEvent('e2', 'GP Futur', 2026, new Date('2026-08-01'), 'PLANIFIE', 'circuit-1');

      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(dernierEvent);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(prochainEvent);
      fakeContractRepository.findLastContractForRider = vi.fn().mockResolvedValue(null);

      await expect(
        service.validerFenetreSignature('pilote-1', new Date('2026-06-01')),
      ).resolves.not.toThrow();
    });
  });

  describe('validerRestrictionRemplacant', () => {
    it("ne fait rien si le rôle n'est pas remplaçant", async () => {
      await expect(
        service.validerRestrictionRemplacant('pilote-1', 'equipe-1', 'officiel'),
      ).resolves.not.toThrow();
      expect(fakeContractRepository.findAllContractsForRider).not.toHaveBeenCalled();
    });

    it('lève une erreur si le pilote remplaçant a déjà couru pour une autre équipe', async () => {
      const historique = [
        new Contract('c1', 2026, 'remplacant', new Date('2026-01-01'), new Date('2026-12-31'), 'pilote-1', 'equipe-A'),
      ];
      fakeContractRepository.findAllContractsForRider = vi.fn().mockResolvedValue(historique);

      await expect(
        service.validerRestrictionRemplacant('pilote-1', 'equipe-B', 'remplacant'),
      ).rejects.toThrow(/plusieurs équipes/);
    });

    it("n'échoue pas si l'historique concerne la même équipe", async () => {
      const historique = [
        new Contract('c1', 2026, 'remplacant', new Date('2026-01-01'), new Date('2026-12-31'), 'pilote-1', 'equipe-A'),
      ];
      fakeContractRepository.findAllContractsForRider = vi.fn().mockResolvedValue(historique);

      await expect(
        service.validerRestrictionRemplacant('pilote-1', 'equipe-A', 'remplacant'),
      ).resolves.not.toThrow();
    });
  });

  describe('validerPlafondRole', () => {
    it('lève une erreur si le plafond du rôle est atteint', async () => {
      fakeContractRepository.findNbreContratByTeam = vi.fn().mockResolvedValue([
        new Contract('c1', 2026, 'officiel', new Date(), new Date(), 'p1', 'equipe-1'),
        new Contract('c2', 2026, 'officiel', new Date(), new Date(), 'p2', 'equipe-1'),
      ]);

      await expect(
        service.validerPlafondRole('equipe-1', 'officiel'),
      ).rejects.toThrow(/nombre maximum de contrats/);
    });

    it("ne lève pas d'erreur si le plafond n'est pas atteint", async () => {
      fakeContractRepository.findNbreContratByTeam = vi.fn().mockResolvedValue([]);

      await expect(
        service.validerPlafondRole('equipe-1', 'officiel'),
      ).resolves.not.toThrow();
    });
  });

  describe('validerNouvelleDateFin', () => {
    it('lève une erreur si la nouvelle date de fin est antérieure au dernier événement terminé', async () => {
      const dernierEvent = new RaceEvent('e1', 'GP Test', 2026, new Date('2026-06-01'), 'TERMINE', 'circuit-1');
      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(dernierEvent);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(null);

      await expect(
        service.validerNouvelleDateFin(new Date('2026-05-01')),
      ).rejects.toThrow(/antérieure au dernier événement terminé/);
    });

    it('lève une erreur si la nouvelle date de fin dépasse le prochain événement planifié', async () => {
      const prochainEvent = new RaceEvent('e2', 'GP Futur', 2026, new Date('2026-08-01'), 'PLANIFIE', 'circuit-1');
      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(null);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(prochainEvent);

      await expect(
        service.validerNouvelleDateFin(new Date('2026-08-01')),
      ).rejects.toThrow(/prochain événement planifié/);
    });

    it("ne lève pas d'erreur si la date de fin est dans la fenêtre valide", async () => {
      const dernierEvent = new RaceEvent('e1', 'GP Passé', 2026, new Date('2026-05-01'), 'TERMINE', 'circuit-1');
      const prochainEvent = new RaceEvent('e2', 'GP Futur', 2026, new Date('2026-08-01'), 'PLANIFIE', 'circuit-1');
      fakeRaceEventRepository.chercherDernierEventTermine = vi.fn().mockResolvedValue(dernierEvent);
      fakeRaceEventRepository.chercherProchainEventPlanifie = vi.fn().mockResolvedValue(prochainEvent);

      await expect(
        service.validerNouvelleDateFin(new Date('2026-07-01')),
      ).resolves.not.toThrow();
    });
  });
});