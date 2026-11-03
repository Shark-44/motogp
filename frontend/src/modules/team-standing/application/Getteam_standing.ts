import type { TeamStanding } from '../domain/TeamStanding'
import type { TeamStandingReader } from '../domain/TeamStandingRepository'

export type GetTeamStanding = () => Promise<TeamStanding[]>

export function createGetTeamStanding(repository: TeamStandingReader): GetTeamStanding {
  return () => repository.getAll()
}