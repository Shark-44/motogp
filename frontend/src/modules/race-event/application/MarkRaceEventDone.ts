// src/modules/race-event/application/MarkRaceEventDone.ts
import type { RaceEvent } from '../domain/RaceEvents'
import type { RaceEventWriter } from '../domain/RaceEventRepository'

export type MarkRaceEventDone = (id: string) => Promise<RaceEvent>

// Les règles métier (qui peut être terminé, et quand) restent côté back :
// ce cas d'usage ne fait que demander le passage à TERMINE.
export function createMarkRaceEventDone(
  repository: RaceEventWriter,
): MarkRaceEventDone {
  return (id) => repository.updateStatut(id, 'TERMINE')
}
