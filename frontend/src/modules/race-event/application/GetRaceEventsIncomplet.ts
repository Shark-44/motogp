// src/modules/race-event/application/GetRaceEventsIncomplet.ts
import type { RaceEvent } from '../domain/RaceEvents'
import type { RaceEventReader } from '../domain/RaceEventRepository'

export type GetRaceEventsIncomplet = () => Promise<RaceEvent[]>

export function createGetRaceEventsIncomplet(repository: RaceEventReader): GetRaceEventsIncomplet {
  return async () => {
    const raceEvents = await repository.findIncompletedEvents()
    return [...raceEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
  }
}