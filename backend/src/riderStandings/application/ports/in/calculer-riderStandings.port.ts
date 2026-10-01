import type { RiderStandings } from '../../../domaine/entities/riderStandings.entity.js';


export interface CalculerRiderStandingsPort {
  execute(eventId: string): Promise<RiderStandings[]>;
}
