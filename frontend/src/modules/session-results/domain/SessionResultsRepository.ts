// src/modules/session-results/domain/SessionResultsRepository.ts
import type { SessionResultEntry } from './SessionResult'

export interface SessionResultsWriter {
  saveAll(eventId: string, entries: SessionResultEntry[]): Promise<void>
}

export type SessionResultsRepository = SessionResultsWriter
