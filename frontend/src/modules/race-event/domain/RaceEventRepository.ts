// src/modules/race-event/domain/RaceEventRepository.ts
import type { RaceEvent, StatutGP } from './RaceEvents'

export interface RaceEventReader {
  getAll(): Promise<RaceEvent[]>
}

// Port d'écriture : séparé du port de lecture, comme pour tes deux familles de cas d'usage.
export interface RaceEventWriter {
  updateStatut(id: string, statut: StatutGP): Promise<RaceEvent>
}

export type RaceEventRepository = RaceEventReader & RaceEventWriter
