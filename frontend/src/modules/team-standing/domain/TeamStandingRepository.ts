import type { TeamStanding } from './TeamStanding'
 
export interface TeamStandingReader {
  getAll(): Promise<TeamStanding[]>
}
 
export type TeamStandingRepository = TeamStandingReader