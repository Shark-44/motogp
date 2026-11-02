import type { Rider } from '../domain/Riders'
import type { RiderRepository } from '../domain/RiderRepository'

type RiderDto = Omit<Rider, 'dateAnniversaire'> & { dateAnniversaire: string }

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
      const data = (await response.json()) as RiderDto[]

      return data.map((item): Rider => ({
        ...item,
        dateAnniversaire: new Date(item.dateAnniversaire),
      }))
    },
  }
}