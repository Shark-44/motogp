import { describe, expect, it, vi } from 'vitest';
import { CalculerTeamStandingsUseCase } from './calculer-TeamStandings.use-case.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../../sessionResults/domaine/ports/out/sessionResults-repository.port.js';
import type { TeamStandingsRepositoryPort } from '../../domaine/ports/out/teamStandings-repository.port.js';
import type { ContractRepositoryPort } from '../../../contract/domaine/ports/out/contract-repository.port.js';
import type { ReglementPointMotoGP } from '../../../motogpScoringRules/domaine/services/reglementPointMotoGP.service.js';
import type { DepartageClassement } from '../../../riderStandings/domaine/services/departage-classement.service.js';

// --- Fabriques de données ------------------------------------------------------

const creerEvenement = (id: string, date: string, surcharge: Record<string, unknown> = {}) => ({
    id,
    nom: `GP ${id}`,
    date: new Date(date),
    saison: 2026,
    statut: 'TERMINE',
    ...surcharge,
});

const creerResultat = (
    id: string,
    eventId: string,
    typeSession: 'SPRINT' | 'RACE',
    contratId: string,
) => ({
    id,
    eventId,
    typeSession,
    statut: 'TERMINE',
    position: 1,
    piloteId: `pilote-${contratId}`,
    contratId,
});

const creerContrat = (id: string, equipeId: string, role = 'officiel') => ({
    id,
    saison: 2026,
    role,
    equipeId,
    piloteId: `pilote-${id}`,
});

const resume = (classements: { equipeId: string; pointsCumules: number; positionGenerale: number }[]) =>
    classements.map((c) => [c.equipeId, c.pointsCumules, c.positionGenerale]);

// --- Mise en place (scénario par défaut : 1 event terminé, 2 équipes) ----------

function preparer() {
    const event1 = creerEvenement('event-1', '2026-03-01T15:00:00.000Z');

    const raceEventRepository = {
        findById: vi.fn().mockResolvedValue(event1),
        findAll: vi.fn().mockResolvedValue([event1]),
    };

    const sessionResultsRepository = {
        findByEventIds: vi.fn().mockResolvedValue([
            creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
            creerResultat('r2', 'event-1', 'RACE', 'c1'),
            creerResultat('r3', 'event-1', 'SPRINT', 'c2'),
            creerResultat('r4', 'event-1', 'RACE', 'c2'),
        ]),
    };

    const teamStandingsRepository = {
        saveAll: vi.fn(async (classements: unknown[]) => classements),
    };

    const contractRepository = {
        findByIds: vi.fn().mockResolvedValue([
            creerContrat('c1', 'team-A'),
            creerContrat('c2', 'team-B'),
        ]),
    };

    // Team A = 12 + 25 = 37 ; Team B = 9 + 20 = 29
    const reglementPoints = {
        calculer: vi.fn().mockReturnValue([
            { resultatId: 'r1', points: 12 },
            { resultatId: 'r2', points: 25 },
            { resultatId: 'r3', points: 9 },
            { resultatId: 'r4', points: 20 },
        ]),
    };

    const departage = {
        comparerTeam: vi.fn().mockReturnValue(0),
    };

    const useCase = new CalculerTeamStandingsUseCase(
        raceEventRepository as unknown as RaceEventRepositoryPort,
        sessionResultsRepository as unknown as SessionResultsRepositoryPort,
        teamStandingsRepository as unknown as TeamStandingsRepositoryPort,
        contractRepository as unknown as ContractRepositoryPort,
        reglementPoints as unknown as ReglementPointMotoGP,
        departage as unknown as DepartageClassement,
    );

    return {
        useCase,
        event1,
        raceEventRepository,
        sessionResultsRepository,
        teamStandingsRepository,
        contractRepository,
        reglementPoints,
        departage,
    };
}

// --- Tests ---------------------------------------------------------------------

describe('CalculerTeamStandingsUseCase', () => {
    describe('garde-fous', () => {
        it('lève une erreur si l\'événement est introuvable', async () => {
            const { useCase, raceEventRepository, teamStandingsRepository } = preparer();
            raceEventRepository.findById.mockResolvedValue(undefined);

            await expect(useCase.execute('event-inconnu')).rejects.toThrow(
                "Aucun événement trouvé avec l'id event-inconnu",
            );
            expect(teamStandingsRepository.saveAll).not.toHaveBeenCalled();
        });

        it('lève une erreur si l\'événement n\'est pas terminé', async () => {
            const { useCase, event1, raceEventRepository, teamStandingsRepository } = preparer();
            raceEventRepository.findById.mockResolvedValue({ ...event1, statut: 'A_VENIR' });

            await expect(useCase.execute('event-1')).rejects.toThrow(/événement terminé/);
            expect(teamStandingsRepository.saveAll).not.toHaveBeenCalled();
        });

        it('lève une erreur si un événement terminé n\'a aucun résultat de Sprint', async () => {
            const { useCase, sessionResultsRepository, teamStandingsRepository } = preparer();
            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r2', 'event-1', 'RACE', 'c1'),
                creerResultat('r4', 'event-1', 'RACE', 'c2'),
            ]);

            await expect(useCase.execute('event-1')).rejects.toThrow(/Sprint/);
            expect(teamStandingsRepository.saveAll).not.toHaveBeenCalled();
        });

        it('lève une erreur si un événement terminé n\'a aucun résultat de Course', async () => {
            const { useCase, sessionResultsRepository, teamStandingsRepository } = preparer();
            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r3', 'event-1', 'SPRINT', 'c2'),
            ]);

            await expect(useCase.execute('event-1')).rejects.toThrow(/Course/);
            expect(teamStandingsRepository.saveAll).not.toHaveBeenCalled();
        });
    });

    describe('périmètre des événements pris en compte', () => {
        it('ne retient que les événements de la même saison, jusqu\'à la date de l\'événement demandé', async () => {
            const { useCase, raceEventRepository, sessionResultsRepository } = preparer();

            const event2025 = creerEvenement('event-2025', '2025-11-01T00:00:00.000Z', { saison: 2025 });
            const event1 = creerEvenement('event-1', '2026-03-01T15:00:00.000Z');
            const event2 = creerEvenement('event-2', '2026-03-22T00:00:00.000Z');
            const event3 = creerEvenement('event-3', '2026-04-05T00:00:00.000Z');

            raceEventRepository.findById.mockResolvedValue(event2);
            raceEventRepository.findAll.mockResolvedValue([event2025, event1, event2, event3]);
            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r2', 'event-1', 'RACE', 'c1'),
                creerResultat('r3', 'event-2', 'SPRINT', 'c2'),
                creerResultat('r4', 'event-2', 'RACE', 'c2'),
            ]);

            await useCase.execute('event-2');

            expect(sessionResultsRepository.findByEventIds).toHaveBeenCalledWith(['event-1', 'event-2']);
        });
    });

    describe('calcul du classement', () => {
        it('agrège les points par équipe et classe par points décroissants', async () => {
            const { useCase } = preparer();

            const classements = await useCase.execute('event-1');

            expect(resume(classements)).toEqual([
                ['team-A', 37, 1],
                ['team-B', 29, 2],
            ]);
        });

        it('rattache chaque ligne sauvegardée à l\'événement demandé', async () => {
            const { useCase, teamStandingsRepository } = preparer();

            const classements = await useCase.execute('event-1');

            expect(teamStandingsRepository.saveAll).toHaveBeenCalledTimes(1);
            expect(classements.every((c) => c.eventId === 'event-1')).toBe(true);
        });

        it('demande les contrats une seule fois, sans doublon d\'identifiant', async () => {
            const { useCase, contractRepository } = preparer();

            await useCase.execute('event-1');

            expect(contractRepository.findByIds).toHaveBeenCalledTimes(1);
            expect(contractRepository.findByIds).toHaveBeenCalledWith(['c1', 'c2']);
        });

        it('additionne les points de deux pilotes de la même équipe', async () => {
            const { useCase, sessionResultsRepository, contractRepository, reglementPoints } = preparer();

            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r2', 'event-1', 'RACE', 'c1'),
                creerResultat('r5', 'event-1', 'RACE', 'c1b'),
            ]);
            contractRepository.findByIds.mockResolvedValue([
                creerContrat('c1', 'team-A'),
                creerContrat('c1b', 'team-A'),
            ]);
            reglementPoints.calculer.mockReturnValue([
                { resultatId: 'r1', points: 12 },
                { resultatId: 'r2', points: 25 },
                { resultatId: 'r5', points: 16 },
            ]);

            const classements = await useCase.execute('event-1');

            expect(resume(classements)).toEqual([['team-A', 53, 1]]);
        });

        it('exclut les contrats wildcard du classement des équipes', async () => {
            const { useCase, sessionResultsRepository, contractRepository, reglementPoints } = preparer();

            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r2', 'event-1', 'RACE', 'c1'),
                creerResultat('r5', 'event-1', 'RACE', 'c-wild'),
            ]);
            contractRepository.findByIds.mockResolvedValue([
                creerContrat('c1', 'team-A'),
                creerContrat('c-wild', 'team-W', 'wildcard'),
            ]);
            reglementPoints.calculer.mockReturnValue([
                { resultatId: 'r1', points: 12 },
                { resultatId: 'r2', points: 25 },
                { resultatId: 'r5', points: 25 },
            ]);

            const classements = await useCase.execute('event-1');

            expect(resume(classements)).toEqual([['team-A', 37, 1]]);
        });

        it('ignore un résultat dont le contrat est introuvable', async () => {
            const { useCase, sessionResultsRepository, reglementPoints } = preparer();

            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r2', 'event-1', 'RACE', 'c1'),
                creerResultat('r5', 'event-1', 'RACE', 'contrat-fantome'),
            ]);
            reglementPoints.calculer.mockReturnValue([
                { resultatId: 'r1', points: 12 },
                { resultatId: 'r2', points: 25 },
                { resultatId: 'r5', points: 25 },
            ]);

            const classements = await useCase.execute('event-1');

            expect(resume(classements)).toEqual([['team-A', 37, 1]]);
        });
    });

    describe('départage et rangs', () => {
        it('utilise le départage quand deux équipes ont le même nombre de points', async () => {
            const { useCase, reglementPoints, departage } = preparer();

            reglementPoints.calculer.mockReturnValue([
                { resultatId: 'r1', points: 20 },
                { resultatId: 'r2', points: 0 },
                { resultatId: 'r3', points: 20 },
                { resultatId: 'r4', points: 0 },
            ]);
            // Team B passe devant Team A
            departage.comparerTeam.mockImplementation((a: string, b: string) =>
                a === 'team-B' ? -1 : b === 'team-B' ? 1 : 0,
            );

            const classements = await useCase.execute('event-1');

            expect(departage.comparerTeam).toHaveBeenCalled();
            expect(resume(classements)).toEqual([
                ['team-B', 20, 1],
                ['team-A', 20, 2],
            ]);
        });

        it('attribue le même rang aux ex æquo parfaits et saute le rang suivant', async () => {
            const { useCase, sessionResultsRepository, contractRepository, reglementPoints } = preparer();

            sessionResultsRepository.findByEventIds.mockResolvedValue([
                creerResultat('r1', 'event-1', 'SPRINT', 'c1'),
                creerResultat('r2', 'event-1', 'RACE', 'c2'),
                creerResultat('r3', 'event-1', 'SPRINT', 'c3'),
                creerResultat('r4', 'event-1', 'RACE', 'c3'),
            ]);
            contractRepository.findByIds.mockResolvedValue([
                creerContrat('c1', 'team-A'),
                creerContrat('c2', 'team-B'),
                creerContrat('c3', 'team-C'),
            ]);
            reglementPoints.calculer.mockReturnValue([
                { resultatId: 'r1', points: 30 },
                { resultatId: 'r2', points: 30 },
                { resultatId: 'r3', points: 4 },
                { resultatId: 'r4', points: 6 },
            ]);
            // départage toujours à 0 (valeur par défaut du mock) => A et B sont ex æquo

            const classements = await useCase.execute('event-1');

            expect(resume(classements)).toEqual([
                ['team-A', 30, 1],
                ['team-B', 30, 1],
                ['team-C', 10, 3],
            ]);
        });
    });

    it('retourne ce que le repository a sauvegardé', async () => {
        const { useCase, teamStandingsRepository } = preparer();
        const sauvegarde = [{ equipeId: 'team-X' }];
        teamStandingsRepository.saveAll.mockResolvedValue(sauvegarde);

        const resultat = await useCase.execute('event-1');

        expect(resultat).toBe(sauvegarde);
    });
});
