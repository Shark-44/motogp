// src/modules/race-event/domain/RaceEventRepository.ts
import type { RaceEvent, StatutGP } from './RaceEvents'

export interface RaceEventReader {
  getAll(): Promise<RaceEvent[]>
  findIncompletedEvents(): Promise<RaceEvent[]>
}

export interface RaceEventWriter {
  updateStatut(id: string, statut: StatutGP): Promise<RaceEvent>
}

export type RaceEventRepository = RaceEventReader & RaceEventWriter
