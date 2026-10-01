import type { TeamStandings } from '../../../domaine/entities/teamStandings.entity.js';


export interface CalculerTeamStandingsPort {
  execute(eventId: string): Promise<TeamStandings[]>;
}
