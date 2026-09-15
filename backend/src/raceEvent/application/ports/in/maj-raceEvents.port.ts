import type { RaceEvent } from '../../../domaine/entities/raceEvent.entity.js';

export interface MajRaceEventPort {
  execute( id: string, statut: string): Promise<RaceEvent>;
}