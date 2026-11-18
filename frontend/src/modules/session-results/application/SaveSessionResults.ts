// src/modules/session-results/application/SaveSessionResults.ts
import type { SessionResultEntry } from '../domain/SessionResult'
import type { SessionResultsWriter } from '../domain/SessionResultsRepository'

export type SaveSessionResults = (
  eventId: string,
  entries: SessionResultEntry[],
) => Promise<void>

// Garde-fous de saisie, côté front : ils évitent d'envoyer une saisie manifestement
// incohérente. Le back reste l'arbitre (il ne vérifie pas aujourd'hui les doublons
// ni les trous de position).
// Renvoie un message d'erreur, ou null si la saisie est cohérente.
export function validateSessionResults(
  entries: SessionResultEntry[],
): string | null {
  if (entries.length === 0) {
    return 'Aucun résultat à enregistrer : sélectionne au moins un pilote.'
  }

  const seen = new Set<string>()
  for (const entry of entries) {
    if (seen.has(entry.fimNumber)) {
      return `Le pilote #${entry.fimNumber} apparaît plusieurs fois.`
    }
    seen.add(entry.fimNumber)
  }

  const positions = new Set(entries.map((entry) => entry.position))
  const last = Math.max(...positions)
  for (let position = 1; position <= last; position++) {
    if (!positions.has(position)) {
      return `Il manque un pilote en P${position}.`
    }
  }

  return null
}

export function createSaveSessionResults(
  repository: SessionResultsWriter,
): SaveSessionResults {
  return async (eventId, entries) => {
    const problem = validateSessionResults(entries)
    if (problem) throw new Error(problem)
    await repository.saveAll(eventId, entries)
  }
}
