import type { Team } from '../domain/Teams'
import type { TeamRepository } from '../domain/TeamRepository'

export function createHttpTeamRepository(
  baseUrl = '/api/teams',
): TeamRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger les equipes (erreur ${response.status}).`,
        )
      }
      return (await response.json()) as Team[]
    },


  }
}