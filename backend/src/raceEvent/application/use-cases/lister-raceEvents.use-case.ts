import type { ListerRaceEventsPort } from '../ports/in/lister-raceEvents.port.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

export class ListerRaceEventsUseCase implements ListerRaceEventsPort {
  constructor(private readonly raceEventRepository: RaceEventRepositoryPort) {}

  async execute() {
    return this.raceEventRepository.findAll();
  }
}
