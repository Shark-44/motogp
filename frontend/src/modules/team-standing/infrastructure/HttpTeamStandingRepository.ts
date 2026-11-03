import type { TeamStanding } from '../domain/TeamStanding'
import type { TeamStandingRepository } from '../domain/TeamStandingRepository'

type TeamStandingDto = Omit<TeamStanding, 'dateEvent'> & { dateEvent: string }

export function createHttpTeamStandingRepository(
  baseUrl = '/api/teamStandings',
): TeamStandingRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger le classement des équipes (erreur ${response.status}).`,
        )
      }
      const data = (await response.json()) as TeamStandingDto[]

      return data.map((item): TeamStanding => ({
        ...item,
        dateEvent: new Date(item.dateEvent),
      }))
    },
  }
}