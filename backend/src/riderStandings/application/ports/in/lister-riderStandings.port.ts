import type { RiderStandings } from '../../../domaine/entities/riderStandings.entity.js';


export interface ListerRiderStandingPort {
  execute(eventIds: string[]): Promise<RiderStandings[]>;
}

