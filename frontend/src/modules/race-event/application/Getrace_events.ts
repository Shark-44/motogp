import type { RaceEvent } from '../domain/RaceEvents'
import type { RaceEventReader } from '../domain/RaceEventRepository'

export type GetRaceEvents = () => Promise<RaceEvent[]>

export function createGetRaceEvents(repository: RaceEventReader): GetRaceEvents {
  return async () => {
    const raceEvents = await repository.getAll()
   
    return [...raceEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
  }
}