import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import { RiderRepositoryPort } from '../../../riders/domaine/ports/out/rider-repository.port.js';
import { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { 
    ListerDetailRiderStandingPort, 
    DetailRiderStandings 
  } from '../ports/in/listerDetail-riderStandings.port.js';



export class ListerDetailRiderStandingsUseCase implements ListerDetailRiderStandingPort {
    constructor(
        private readonly riderStandingsRepository: RiderStandingsRepositoryPort,
        private readonly riderRepository: RiderRepositoryPort,
        private readonly raceEventRepository: RaceEventRepositoryPort,
    ) {}

    async execute(eventId:string): Promise<DetailRiderStandings[]> {
        
        const classement = await this.riderStandingsRepository.findByEventId(eventId);
       
        const pilotes = await this.riderRepository.findAll(); 
        
        const evenement = await this.raceEventRepository.findById(eventId);
            if (!evenement) {
                throw new Error(`Aucun événement trouvé avec l'id ${eventId}`);
            }   
      
        const pilId = new Map(pilotes.map((p) => [p.id, p]));
        
       
        const enrichi = classement.map((ligne) => ({
            ...ligne,
            nom: pilId.get(ligne.piloteId)?.nom,
            prenom: pilId.get(ligne.piloteId)?.prenom,
            nomEvent: evenement.nom,
            dateEvent: evenement.date,
            circuitEvent: evenement.circuitId,
        }));
        
        
        return enrichi;
    }
}
