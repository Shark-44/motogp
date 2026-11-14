import type { ListerRaceEventsIncompletsPort } from '../ports/in/lister-raceEvents-incomplets.port.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';
import type { RaceEvent } from '../../domaine/entities/raceEvent.entity.js';

export class ListerRaceEventsIncompletsUseCase implements ListerRaceEventsIncompletsPort {
  constructor(private readonly raceEventRepository: RaceEventRepositoryPort) {}

  async execute(): Promise<RaceEvent[]> {
    return this.raceEventRepository.findIncompletedEvents();
  }
}