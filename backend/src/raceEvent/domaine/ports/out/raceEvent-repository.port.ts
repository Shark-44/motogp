import type { RaceEvent } from '../../entities/raceEvent.entity.js';

export interface RaceEventRepositoryPort {
  findAll(): Promise<RaceEvent[]>;
}
