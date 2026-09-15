import type { RaceEvent, StatutGP } from '../../../domaine/entities/raceEvent.entity.js';

export interface CreerRaceEventPort {
  execute( nom: string, saison: number, date: Date, statut: StatutGP, circuitId: string): Promise<RaceEvent>;
}