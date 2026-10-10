import type { RiderStandings } from '../../entities/riderStandings.entity.js'

export interface RiderStandingsRepositoryPort {
  findAll(): Promise<RiderStandings[]>;
  saveAll(classements: RiderStandings[]): Promise<RiderStandings[]>;
  findByEventIds(): Promise<RiderStandings[]>
  findByEventId(eventId: string): Promise<RiderStandings[]>
}
