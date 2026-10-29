import type { RaceEvent } from '../domain/RaceEvents'
import type { RaceEventRepository } from '../domain/RaceEventRepository'

export function createHttpRaceEventRepository(
  baseUrl = '/api/raceEvents',
): RaceEventRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger le calendrier (erreur ${response.status}).`,
        )
      }
      
      const data = (await response.json()) as Record<string, unknown>[]

      return data.map((item): RaceEvent => ({
        ...(item as Omit<RaceEvent, 'date'>),
        date: new Date(item.date as string), 
      }))
    },
  }
}