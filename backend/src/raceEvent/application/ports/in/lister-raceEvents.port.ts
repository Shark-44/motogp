import type { RaceEvent } from '../../../domaine/entities/raceEvent.entity.js';

export interface ListerRaceEventsPort {
  execute(): Promise<RaceEvent[]>;
}
