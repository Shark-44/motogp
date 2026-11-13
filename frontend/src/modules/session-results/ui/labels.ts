// src/modules/session-results/ui/labels.ts
import type { ResultStatus, SessionType } from '../domain/SessionResult'

export const SESSION_LABEL: Record<SessionType, string> = {
  SPRINT: 'Sprint',
  RACE: 'Course principale',
}

export const STATUS_LABEL: Record<ResultStatus, string> = {
  FINISHED: 'Classé / arrivé',
  DNF: 'Abandon (DNF / chute)',
  DSQ: 'Disqualifié (DSQ)',
}
