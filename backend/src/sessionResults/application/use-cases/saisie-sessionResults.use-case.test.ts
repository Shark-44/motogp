import { describe, expect, it, vi } from 'vitest';
import { SaisieSessionResultsUseCase } from './saisie-sessionResults.use-case.js';
import type { ResultatSaisi } from '../ports/in/saisie-sessionResults.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../domaine/ports/out/sessionResults-repository.port.js';
import type { ContractRepositoryPort } from '../../../contract/domaine/ports/out/contract-repository.port.js';
import type { EvenementsPublisherPort } from '../ports/out/evenements-publisher.port.js';
import { RaceEvent } from '../../../raceEvent/domaine/entities/raceEvent.entity.js';
import { Rider } from '../../../riders/domaine/entities/rider.entity.js';
import { Contract } from '../../../contract/domaine/entities/contract.entity.js';

const EVENT_ID = 'event-1';

function creerEvenement(statut: 'PLANIFIE' | 'TERMINE' | 'ANNULE'): RaceEvent {
  return new RaceEvent(EVENT_ID, 'GP Test', 2026, new Date('2026-05-01'), statut, 'circuit-1');
}

function creerPilotes(nombre: number): Rider[] {
  return Array.from({ length: nombre }, (_, i) =>
    new Rider(`rider-${i + 1}`, String(i + 1), `Nom${i + 1}`, `Prenom${i + 1}`, 'FR', new Date('1995-01-01'), 'photo.jpg'),
  );
}

function creerResultats(
  nombre: number,
  typeSession: 'SPRINT' | 'RACE' = 'RACE',
): ResultatSaisi[] {
  return Array.from({ length: nombre }, (_, i) => ({
    typeSession,
    statut: 'TERMINE' as const,
    position: i + 1,
    fimNumber: String(i + 1),
  }));
}

// Tous les ports sont simulés : le cas d'usage est testé seul, sans base ni réseau.
function preparer(overrides?: {
  evenement?: RaceEvent | null;
  pilotes?: Rider[];
  contratActif?: boolean;
}) {
  const pilotes = overrides?.pilotes ?? creerPilotes(20);

  const raceEventRepository: RaceEventRepositoryPort = {
    findAll: vi.fn(),
    findByDate: vi.fn(),
    createEvent: vi.fn(),
    findById: vi.fn(async () =>
      overrides && 'evenement' in overrides ? overrides.evenement! : creerEvenement('TERMINE'),
    ),
    updateEvent: vi.fn(),
    chercherDernierEventTermine: vi.fn(),
    chercherProchainEventPlanifie: vi.fn(),
    findIncompletedEvents: vi.fn().mockResolvedValue([]),
  };

  // Le cas d'usage retrouve chaque pilote par son numéro FIM.
  const riderRepository: RiderRepositoryPort = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByFimNumber: vi.fn(async (fimNumber: string) =>
      pilotes.find((pilote) => pilote.fimNumber === fimNumber) ?? null,
    ),
  };

  const sessionResultsRepository: SessionResultsRepositoryPort = {
    findAll: vi.fn(),
    saveAll: vi.fn(async (results) => results),
    findByEventIds: vi.fn(),
  };

  const contractRepository: ContractRepositoryPort = {
    findAll: vi.fn(),
    create: vi.fn(),
    findActiveContractForRider: vi.fn(),
    findNbreContratByTeam: vi.fn(),
    findLastContractForRider: vi.fn(),
    findAllContractsForRider: vi.fn(),
    updateFinContrat: vi.fn(),
    findActiveContractForRiderAtEvent: vi.fn(async (piloteId: string) =>
      overrides?.contratActif === false
        ? null
        : new Contract(`contract-${piloteId}`, 2026, 'officiel', new Date('2026-01-01'), new Date('2026-12-31'), piloteId, 'team-1'),
    ),
    findByIds: vi.fn(),
  };

  // Le bus d'événements : le cas d'usage annonce, sans savoir qui écoute.
  const evenements: EvenementsPublisherPort = {
    publier: vi.fn(async () => undefined),
  };

  const useCase = new SaisieSessionResultsUseCase(
    raceEventRepository,
    riderRepository,
    sessionResultsRepository,
    contractRepository,
    evenements,
  );

  return { useCase, sessionResultsRepository, riderRepository, contractRepository, evenements };
}

describe('SaisieSessionResultsUseCase', () => {
  describe('refus de la saisie', () => {
    it("refuse la saisie si l'événement n'existe pas", async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer({ evenement: null });

      await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('Aucun événement trouvé');
      expect(sessionResultsRepository.saveAll).not.toHaveBeenCalled();
      expect(evenements.publier).not.toHaveBeenCalled();
    });

    it("refuse la saisie si l'événement n'est pas TERMINE", async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer({
        evenement: creerEvenement('PLANIFIE'),
      });

      await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('doit être terminé');
      expect(sessionResultsRepository.saveAll).not.toHaveBeenCalled();
      expect(evenements.publier).not.toHaveBeenCalled();
    });

    it('refuse un numéro FIM inconnu du référentiel pilotes', async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer({ pilotes: creerPilotes(19) });

      await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow(
        'Pilote inconnu avec le numéro FIM 20',
      );
      expect(sessionResultsRepository.saveAll).not.toHaveBeenCalled();
      expect(evenements.publier).not.toHaveBeenCalled();
    });

    it("refuse un pilote sans contrat actif à l'événement", async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer({ contratActif: false });

      await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('Aucun contrat actif trouvé');
      expect(sessionResultsRepository.saveAll).not.toHaveBeenCalled();
      expect(evenements.publier).not.toHaveBeenCalled();
    });

    it('refuse un ABANDON avec une position (règle de l\'entité : un non-classé n\'a pas de position)', async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer();

      const resultats = creerResultats(20);
      resultats[19] = { ...resultats[19], statut: 'ABANDON', position: 20 };

      await expect(useCase.execute(EVENT_ID, resultats)).rejects.toThrow('ne peut pas avoir de position');
      expect(sessionResultsRepository.saveAll).not.toHaveBeenCalled();
      expect(evenements.publier).not.toHaveBeenCalled();
    });
  });

  describe('enregistrement', () => {
    it('résout chaque numéro FIM en pilote et en contrat, et enregistre le lot en un seul appel', async () => {
      const { useCase, sessionResultsRepository } = preparer();

      const resultat = await useCase.execute(EVENT_ID, creerResultats(20));

      expect(sessionResultsRepository.saveAll).toHaveBeenCalledTimes(1);
      expect(resultat).toHaveLength(20);
      expect(resultat[0].piloteId).toBe('rider-1');
      expect(resultat[0].contratId).toBe('contract-rider-1');
      expect(resultat[0].eventId).toBe(EVENT_ID);
    });

    it('accepte un statut ABANDON ou NON_PARTANT avec une position null', async () => {
      const { useCase } = preparer();

      const resultats = creerResultats(20);
      resultats[18] = { ...resultats[18], statut: 'ABANDON', position: null };
      resultats[19] = { ...resultats[19], statut: 'NON_PARTANT', position: null };

      const resultat = await useCase.execute(EVENT_ID, resultats);

      expect(resultat[18].statut).toBe('ABANDON');
      expect(resultat[18].position).toBeNull();
      expect(resultat[19].statut).toBe('NON_PARTANT');
      expect(resultat[19].position).toBeNull();
    });
  });

  describe("annonce « résultats enregistrés »", () => {
    it("publie un événement avec l'événement de course et le type de session saisi", async () => {
      const { useCase, evenements } = preparer();

      await useCase.execute(EVENT_ID, creerResultats(20, 'RACE'));

      expect(evenements.publier).toHaveBeenCalledTimes(1);
      expect(evenements.publier).toHaveBeenCalledWith({ eventId: EVENT_ID, typeSession: 'RACE' });
    });

    it('publie le type SPRINT pour une saisie de sprint', async () => {
      const { useCase, evenements } = preparer();

      await useCase.execute(EVENT_ID, creerResultats(20, 'SPRINT'));

      expect(evenements.publier).toHaveBeenCalledWith({ eventId: EVENT_ID, typeSession: 'SPRINT' });
    });

    it("publie seulement après l'enregistrement, jamais avant", async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer();

      await useCase.execute(EVENT_ID, creerResultats(20));

      const ordreEnregistrement = vi.mocked(sessionResultsRepository.saveAll).mock.invocationCallOrder[0];
      const ordreAnnonce = vi.mocked(evenements.publier).mock.invocationCallOrder[0];
      expect(ordreEnregistrement).toBeLessThan(ordreAnnonce);
    });

    it("ne publie rien si l'enregistrement échoue", async () => {
      const { useCase, sessionResultsRepository, evenements } = preparer();
      sessionResultsRepository.saveAll = vi.fn().mockRejectedValue(new Error('base indisponible'));

      await expect(useCase.execute(EVENT_ID, creerResultats(20))).rejects.toThrow('base indisponible');
      expect(evenements.publier).not.toHaveBeenCalled();
    });
  });

  // Règles que l'ancien fichier de test décrivait, mais que le cas d'usage actuel ne vérifie pas.
  // Elles restent ici pour ne pas être perdues : à implémenter dans le cas d'usage, ou à retirer.
  describe('règles de lot décrites mais non implémentées', () => {
    it.todo('refuse un lot hors des bornes de plausibilité (entre 18 et 24 pilotes)');
    it.todo('refuse un lot mélangeant SPRINT et RACE (un seul type de session par lot)');
    it.todo('refuse un lot avec un numéro de course en double');
    it.todo('refuse un lot avec une position en double');
  });
});