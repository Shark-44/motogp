import type { RaceEvent } from '../../../domaine/entities/raceEvent.entity.js';

export interface MajRaceEventPort {
  execute( id: string): Promise<RaceEvent>;
}