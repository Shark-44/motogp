import type { MajRaceEventPort} from '../ports/in/maj-raceEvents.port.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

export class MajRaceEventsUseCase implements MajRaceEventPort {
  constructor(private readonly raceEventRepository: RaceEventRepositoryPort) {}

  async execute(id: string) {
    const existant = await this.raceEventRepository.findById(id);
    
    if (!existant) {
    throw new Error(`Aucun evenement pour : ${id}`);
    }
    if (existant.date > new Date()) {
    throw new Error(`L'evenement n'a pas encore eu lieu : ${existant.date}`)
    }
    if (existant.statut == 'TERMINE')
    throw new Error(`L'evenement est déjà : ${existant.statut}`); 

    existant.statut = 'TERMINE';
    return this.raceEventRepository.updateEvent( existant);
  }
}