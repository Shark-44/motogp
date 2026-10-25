import type { Rider } from '../domain/Riders'
import type { RiderRepository } from '../domain/RiderRepository'

export function createHttpRiderRepository(
  baseUrl = '/api/riders',
): RiderRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger les pilotes (erreur ${response.status}).`,
        )
      }
      return (await response.json()) as Rider[]
    },


  }
}