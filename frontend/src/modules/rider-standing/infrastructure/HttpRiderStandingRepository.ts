import type { RiderStanding } from '../domain/RiderStanding'
import type { RiderStandingRepository } from '../domain/RiderStandingRepository'

type RiderStandingDto = Omit<RiderStanding, 'dateEvent'> & { dateEvent?: string }

export function createHttpRiderStandingRepository(
  baseUrl = '/api/riderStandings',
): RiderStandingRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger le classement pilotes (erreur ${response.status}).`,
        )
      }
      const data = (await response.json()) as RiderStandingDto[]

      return data.map((item): RiderStanding => ({
        ...item,
        dateEvent: item.dateEvent ? new Date(item.dateEvent) : undefined,
      }))
    },
  }
}