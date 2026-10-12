import { describe, expect, it, vi } from 'vitest';
import { ListerTeamStandingsUseCase } from './lister-teamStandings.use-case.js';
import type { TeamStandingsRepositoryPort } from '../../domaine/ports/out/teamStandings-repository.port.js';
import type { TeamRepositoryPort } from '../../../teams/domaine/ports/out/team-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';

// --- Données de test -----------------------------------------------------------

const event1 = {
    id: 'event-1',
    nom: 'Grand Prix de Thaïlande',
    date: new Date('2026-03-01T15:00:00.000Z'),
};

const event2 = {
    id: 'event-2',
    nom: 'Grand Prix du Brésil',
    date: new Date('2026-03-22T00:00:00.000Z'),
};

// Event plus récent, mais sans aucun classement (pas encore couru / calculé)
const event3 = {
    id: 'event-3',
    nom: 'Grand Prix d\'Argentine',
    date: new Date('2026-04-05T00:00:00.000Z'),
};

const teamA = { id: 'team-A', nom: 'Aprilia Racing' };
const teamB = { id: 'team-B', nom: 'Ducati Lenovo Team' };

const ligne = (eventId: string, equipeId: string, pointsCumules: number, positionGenerale: number) => ({
    eventId,
    equipeId,
    pointsCumules,
    positionGenerale,
});

// --- Mise en place -------------------------------------------------------------

function preparer() {
    const teamStandingsRepository = {
        findAll: vi.fn().mockResolvedValue([
            ligne('event-1', 'team-A', 20, 1),
            ligne('event-1', 'team-B', 15, 2),
            ligne('event-2', 'team-A', 101, 1),
            ligne('event-2', 'team-B', 87, 2),
        ]),
    };
    const teamRepository = {
        findAll: vi.fn().mockResolvedValue([teamA, teamB]),
    };
    const raceEventRepository = {
        findAll: vi.fn().mockResolvedValue([event1, event2, event3]),
    };

    const useCase = new ListerTeamStandingsUseCase(
        teamStandingsRepository as unknown as TeamStandingsRepositoryPort,
        teamRepository as unknown as TeamRepositoryPort,
        raceEventRepository as unknown as RaceEventRepositoryPort,
    );

    return { useCase, teamStandingsRepository, teamRepository, raceEventRepository };
}

// --- Tests ---------------------------------------------------------------------

describe('ListerTeamStandingsUseCase', () => {
    it('retourne un tableau vide sans charger les équipes quand il n\'existe aucun classement', async () => {
        const { useCase, teamStandingsRepository, teamRepository } = preparer();
        teamStandingsRepository.findAll.mockResolvedValue([]);

        const resultat = await useCase.execute();

        expect(resultat).toEqual([]);
        expect(teamRepository.findAll).not.toHaveBeenCalled();
    });

    it('retourne un tableau vide si aucun classement ne correspond à un événement connu', async () => {
        const { useCase, teamStandingsRepository, teamRepository } = preparer();
        teamStandingsRepository.findAll.mockResolvedValue([ligne('event-inconnu', 'team-A', 10, 1)]);

        const resultat = await useCase.execute();

        expect(resultat).toEqual([]);
        expect(teamRepository.findAll).not.toHaveBeenCalled();
    });

    it('retient le dernier event ayant un classement, et ignore un event plus récent sans classement', async () => {
        const { useCase } = preparer();

        const resultat = await useCase.execute();

        expect(resultat).toHaveLength(2);
        expect(resultat.every((l) => l.eventId === 'event-2')).toBe(true);
        expect(resultat.every((l) => l.nomEvent === 'Grand Prix du Brésil')).toBe(true);
    });

    it('ne dépend pas de l\'ordre dans lequel les événements sont retournés', async () => {
        const { useCase, raceEventRepository } = preparer();
        raceEventRepository.findAll.mockResolvedValue([event3, event2, event1]);

        const resultat = await useCase.execute();

        expect(resultat.every((l) => l.eventId === 'event-2')).toBe(true);
    });

    it('trie les lignes par position générale croissante', async () => {
        const { useCase, teamStandingsRepository } = preparer();
        teamStandingsRepository.findAll.mockResolvedValue([
            ligne('event-2', 'team-B', 87, 2),
            ligne('event-2', 'team-A', 101, 1),
        ]);

        const resultat = await useCase.execute();

        expect(resultat.map((l) => l.equipeId)).toEqual(['team-A', 'team-B']);
        expect(resultat.map((l) => l.positionGenerale)).toEqual([1, 2]);
    });

    it('enrichit chaque ligne avec le nom de l\'équipe et les infos de l\'événement', async () => {
        const { useCase } = preparer();

        const resultat = await useCase.execute();

        expect(resultat[0]).toEqual({
            equipeId: 'team-A',
            eventId: 'event-2',
            pointsCumules: 101,
            positionGenerale: 1,
            nomEquipe: 'Aprilia Racing',
            nomEvent: 'Grand Prix du Brésil',
            dateEvent: new Date('2026-03-22T00:00:00.000Z'),
        });
    });

    it('laisse nomEquipe à undefined quand l\'équipe est introuvable', async () => {
        const { useCase, teamRepository } = preparer();
        teamRepository.findAll.mockResolvedValue([teamA]);

        const resultat = await useCase.execute();

        expect(resultat[0].nomEquipe).toBe('Aprilia Racing');
        expect(resultat[1].nomEquipe).toBeUndefined();
    });

    it('interroge chaque repository une seule fois', async () => {
        const { useCase, teamStandingsRepository, teamRepository, raceEventRepository } = preparer();

        await useCase.execute();

        expect(teamStandingsRepository.findAll).toHaveBeenCalledTimes(1);
        expect(raceEventRepository.findAll).toHaveBeenCalledTimes(1);
        expect(teamRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('propage l\'erreur si un repository échoue', async () => {
        const { useCase, teamRepository } = preparer();
        teamRepository.findAll.mockRejectedValue(new Error('Erreur base de données'));

        await expect(useCase.execute()).rejects.toThrow('Erreur base de données');
    });
});
