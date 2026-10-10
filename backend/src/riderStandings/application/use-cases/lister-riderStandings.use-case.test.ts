import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListerRiderStandingsUseCase } from './lister-riderStandings.use-case.js';
import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { CircuitRepositoryPort } from '../../../circuits/domaine/ports/out/circuit-repository.port.js';

// --- Données de test ---------------------------------------------------------

const circuit = {
    id: 'circuit-1',
    nom: 'Chang International Circuit',
    pays: 'Thaïlande',
};

const evenement = {
    id: 'event-1',
    nom: 'Grand Prix de Thaïlande',
    date: new Date('2026-03-01T15:00:00.000Z'),
    circuitId: 'circuit-1',
};

const pilote = {
    id: 'pilote-1',
    nom: 'Bezzecchi',
    prenom: 'Marco',
};

const classement = {
    eventId: 'event-1',
    piloteId: 'pilote-1',
    pointsCumules: 37,
    positionGenerale: 1,
};

// --- Mocks -------------------------------------------------------------------

describe('ListerRiderStandingsUseCase', () => {
    let riderStandingsRepository: { findAll: ReturnType<typeof vi.fn> };
    let riderRepository: { findAll: ReturnType<typeof vi.fn> };
    let raceEventRepository: { findAll: ReturnType<typeof vi.fn> };
    let circuitRepository: { findAll: ReturnType<typeof vi.fn> };
    let useCase: ListerRiderStandingsUseCase;

    beforeEach(() => {
        riderStandingsRepository = { findAll: vi.fn() };
        riderRepository = { findAll: vi.fn() };
        raceEventRepository = { findAll: vi.fn() };
        circuitRepository = { findAll: vi.fn() };

        useCase = new ListerRiderStandingsUseCase(
            riderStandingsRepository as unknown as RiderStandingsRepositoryPort,
            riderRepository as unknown as RiderRepositoryPort,
            raceEventRepository as unknown as RaceEventRepositoryPort,
            circuitRepository as unknown as CircuitRepositoryPort,
        );

        riderRepository.findAll.mockResolvedValue([pilote]);
        raceEventRepository.findAll.mockResolvedValue([evenement]);
        circuitRepository.findAll.mockResolvedValue([circuit]);
    });

    it('retourne un tableau vide sans interroger les autres repositories quand il n\'y a aucun classement', async () => {
        riderStandingsRepository.findAll.mockResolvedValue([]);

        const resultat = await useCase.execute();

        expect(resultat).toEqual([]);
        expect(riderRepository.findAll).not.toHaveBeenCalled();
        expect(raceEventRepository.findAll).not.toHaveBeenCalled();
        expect(circuitRepository.findAll).not.toHaveBeenCalled();
    });

    it('enrichit chaque ligne avec le pilote, l\'événement et le circuit', async () => {
        riderStandingsRepository.findAll.mockResolvedValue([classement]);

        const resultat = await useCase.execute();

        expect(resultat).toHaveLength(1);
        expect(resultat[0]).toMatchObject({
            eventId: 'event-1',
            piloteId: 'pilote-1',
            pointsCumules: 37,
            positionGenerale: 1,
            nom: 'Bezzecchi',
            prenom: 'Marco',
            nomEvent: 'Grand Prix de Thaïlande',
            dateEvent: new Date('2026-03-01T15:00:00.000Z'),
            circuitEvent: 'circuit-1',
            nomCircuit: 'Chang International Circuit',
            paysCircuit: 'Thaïlande',
        });
    });

    it('interroge chaque repository une seule fois, même avec plusieurs lignes', async () => {
        riderStandingsRepository.findAll.mockResolvedValue([
            classement,
            { ...classement, piloteId: 'pilote-2', positionGenerale: 2, pointsCumules: 20 },
        ]);

        await useCase.execute();

        expect(riderStandingsRepository.findAll).toHaveBeenCalledTimes(1);
        expect(riderRepository.findAll).toHaveBeenCalledTimes(1);
        expect(raceEventRepository.findAll).toHaveBeenCalledTimes(1);
        expect(circuitRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('conserve l\'ordre des lignes de classement', async () => {
        const pilote2 = { id: 'pilote-2', nom: 'Acosta', prenom: 'Pedro' };
        riderRepository.findAll.mockResolvedValue([pilote, pilote2]);
        riderStandingsRepository.findAll.mockResolvedValue([
            classement,
            { ...classement, piloteId: 'pilote-2', positionGenerale: 2, pointsCumules: 20 },
        ]);

        const resultat = await useCase.execute();

        expect(resultat.map((l) => l.piloteId)).toEqual(['pilote-1', 'pilote-2']);
    });

    it('laisse nom et prénom à undefined quand le pilote est introuvable', async () => {
        riderRepository.findAll.mockResolvedValue([]);
        riderStandingsRepository.findAll.mockResolvedValue([classement]);

        const resultat = await useCase.execute();

        expect(resultat[0].nom).toBeUndefined();
        expect(resultat[0].prenom).toBeUndefined();
        expect(resultat[0].nomEvent).toBe('Grand Prix de Thaïlande');
    });

    it('laisse les infos circuit à undefined quand le circuit est introuvable', async () => {
        circuitRepository.findAll.mockResolvedValue([]);
        riderStandingsRepository.findAll.mockResolvedValue([classement]);

        const resultat = await useCase.execute();

        expect(resultat[0].nomCircuit).toBeUndefined();
        expect(resultat[0].paysCircuit).toBeUndefined();
        expect(resultat[0].nomEvent).toBe('Grand Prix de Thaïlande');
    });

    it('laisse toutes les infos événement et circuit à undefined quand l\'événement est introuvable', async () => {
        raceEventRepository.findAll.mockResolvedValue([]);
        riderStandingsRepository.findAll.mockResolvedValue([classement]);

        const resultat = await useCase.execute();

        expect(resultat[0].nomEvent).toBeUndefined();
        expect(resultat[0].dateEvent).toBeUndefined();
        expect(resultat[0].nomCircuit).toBeUndefined();
        expect(resultat[0].paysCircuit).toBeUndefined();
        expect(resultat[0].nom).toBe('Bezzecchi');
    });

    it('propage l\'erreur si un repository échoue', async () => {
        riderStandingsRepository.findAll.mockResolvedValue([classement]);
        circuitRepository.findAll.mockRejectedValue(new Error('Erreur base de données'));

        await expect(useCase.execute()).rejects.toThrow('Erreur base de données');
    });
});