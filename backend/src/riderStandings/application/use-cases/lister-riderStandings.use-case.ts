import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import type { ListerRiderStandingPort, DetailCircuitRiderStandings } from '../ports/in/lister-riderStandings.port.js';
import type { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { CircuitRepositoryPort } from '../../../circuits/domaine/ports/out/circuit-repository.port.js';




export class ListerRiderStandingsUseCase implements ListerRiderStandingPort {
    constructor(
        private readonly riderStandingsRepository: RiderStandingsRepositoryPort,
        private readonly riderRepository: RiderRepositoryPort,
        private readonly raceEventRepository: RaceEventRepositoryPort,
        private readonly circuitRepository: CircuitRepositoryPort, // 1. Injection du repository Circuit
    ) {}

    async execute(): Promise<DetailCircuitRiderStandings[]> {
        // 1. Récupération des classements
        const classements = await this.riderStandingsRepository.findAll();
        
        if (classements.length === 0) {
            return [];
        }

        // 2. Récupération parallèle des pilotes, évènements et circuits
        const [pilotes, evenements, circuits] = await Promise.all([
            this.riderRepository.findAll(),
            this.raceEventRepository.findAll(),
            this.circuitRepository.findAll(), 
        ]);

        // 3. Indexation avec Map pour un accès rapide en O(1)
        const piloteMap = new Map(pilotes.map((p) => [p.id, p]));
        const eventMap = new Map(evenements.map((e) => [e.id, e]));
        const circuitMap = new Map(circuits.map((c) => [c.id, c])); // 3. Map des circuits

        // 4. Enrichissement
        return classements.map((ligne) => {
            const pilote = piloteMap.get(ligne.piloteId);
            const event = eventMap.get(ligne.eventId);
            // 4. Récupération du circuit grâce à event.circuitId
            const circuit = event ? circuitMap.get(event.circuitId) : undefined;

            return {
                eventId: ligne.eventId,
                piloteId: ligne.piloteId,
                pointsCumules: ligne.pointsCumules,
                positionGenerale: ligne.positionGenerale,
                nom: pilote?.nom,
                prenom: pilote?.prenom,
                nomEvent: event?.nom,
                dateEvent: event?.date,
                // Remplacement de circuitEvent (l'ID) par les détails du circuit
                circuitEvent: circuit?.id,
                nomCircuit: circuit?.nom,
                paysCircuit: circuit?.pays,
            };
        });
    }
}