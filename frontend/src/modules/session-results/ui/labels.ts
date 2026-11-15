// src/modules/session-results/ui/labels.ts
import type { ResultStatus, SessionType } from '../domain/SessionResult'

export const SESSION_LABEL: Record<SessionType, string> = {
  SPRINT: 'Sprint',
  RACE: 'Course principale',
}

export const STATUS_LABEL: Record<ResultStatus, string> = {
  TERMINE: 'Classé / arrivé',
  ABANDON: 'Abandon (chute, panne…)',
  NON_PARTANT: 'Non-partant (forfait)',
}
