import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import type { ListerRiderStandingPort } from '../ports/in/lister-riderStandings.port.js'
import { RiderStandings } from '../../domaine/entities/riderStandings.entity.js';
import { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';


export class ListerRiderStandingsUseCase implements ListerRiderStandingPort {
    constructor(
        private readonly riderStandingsRepository: RiderStandingsRepositoryPort,
        private readonly riderRepository: RiderRepositoryPort,
        private readonly raceEventRepository: RaceEventRepositoryPort,
    ) {}

    async execute(eventIds: string[]): Promise<RiderStandings[]> {
        //1 Classement va recuperer un tableau d'objets trié
        const classement = await this.riderStandingsRepository.findByEventIds(eventIds);
        //2 Pilotes va donner les details de tout les pilotes
        const pilotes = await this.riderRepository.findAll(); 
        //3 Events details de evenements
        const evenements = await this.raceEventRepository.findAll();
        //contruction de tableau des détails
        const pilId = new Map(pilotes.map((p) => [p.id, p]));
        const evnId = new Map(evenements.map((e) => [e.id, e]))

        // Enrichi est le nouveau tableau avec les details que l'on veut ajouter.
        const enrichi = classement.map((ligne) => ({
            ...ligne,
            nom: pilId.get(ligne.piloteId)?.nom,
            prenom: pilId.get(ligne.piloteId)?.prenom,
            nomEvent: evnId.get(ligne.eventId)?.nom,
            dateEvent: evnId.get(ligne.eventId)?.date,
            circuitEvent: evnId.get(ligne.eventId)?.circuitId,
        }));
        
        
        return enrichi;
    }
}
