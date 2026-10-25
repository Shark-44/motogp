import type { Team } from '../domain/Teams'
import type { TeamReader } from '../domain/TeamRepository'

export type GetTeams = () => Promise<Team[]>

export function createGetTeams(repository: TeamReader): GetTeams {
  return async () => {
    const teams = await repository.getAll()
   
    return [...teams].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  }
}