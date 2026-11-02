import type { RiderStanding } from '../domain/RiderStanding'
import type { RiderStandingRepository } from '../domain/RiderStandingRepository'

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
      return (await response.json()) as RiderStanding[]
    },


  }
}