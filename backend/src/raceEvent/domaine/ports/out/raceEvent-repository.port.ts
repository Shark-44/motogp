import type { RaceEvent, StatutGP } from '../../entities/raceEvent.entity.js';

export interface RaceEventRepositoryPort {
  findAll(): Promise<RaceEvent[]>;
  findByDate(date: Date): Promise<RaceEvent | null>;
  createEvent(nom: string, saison: number, date: Date, statut: StatutGP, circuitId: string): Promise<RaceEvent>;
  findById(id: string): Promise<RaceEvent | null>;
  updateEvent(raceEvent: RaceEvent): Promise<RaceEvent>;
  chercherDernierEventTermine():Promise<RaceEvent | null>;
  chercherProchainEventPlanifie(): Promise<RaceEvent | null>;
}
