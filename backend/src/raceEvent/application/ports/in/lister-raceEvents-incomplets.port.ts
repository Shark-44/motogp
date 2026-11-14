import type { RaceEvent } from '../../../domaine/entities/raceEvent.entity.js'; 

export interface ListerRaceEventsIncompletsPort {
  execute(): Promise<RaceEvent[]>;
}