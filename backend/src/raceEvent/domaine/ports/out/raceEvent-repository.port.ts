import type { RaceEvent, StatutGP } from '../../entities/raceEvent.entity.js';

export interface RaceEventRepositoryPort {
  findAll(): Promise<RaceEvent[]>;
  findByDate(date: Date): Promise<RaceEvent | null>;
  createEvent(nom: string, saison: number, date: Date, statut: StatutGP, circuitId: string): Promise<RaceEvent>;
}
