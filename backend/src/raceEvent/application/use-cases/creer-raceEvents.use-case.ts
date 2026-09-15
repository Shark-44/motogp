import type { CreerRaceEventPort} from '../ports/in/creer-raceEvents.port.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';
import { StatutGP } from '../../domaine/entities/raceEvent.entity.js';

export class CreerRaceEventsUseCase implements CreerRaceEventPort {
  constructor(private readonly raceEventRepository: RaceEventRepositoryPort) {}

  async execute(nom: string, saison: number, date: Date, statut: StatutGP, circuitId: string) {
    const existant = await this.raceEventRepository.findByDate(date);
    
    if (existant) {
    throw new Error(`Un événement est déjà prévu à cette date : ${existant.nom}`);
    }

    return this.raceEventRepository.createEvent(nom, saison, date, statut, circuitId);
  }
}