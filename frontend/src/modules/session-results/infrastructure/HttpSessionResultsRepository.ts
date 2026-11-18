// src/modules/session-results/infrastructure/HttpSessionResultsRepository.ts
import type { SessionResultsRepository } from '../domain/SessionResultsRepository'
import { authHeader } from '@/shared/infrastructure/authHeader'

export function createHttpSessionResultsRepository(
  baseUrl = '/api/sessionResults',
): SessionResultsRepository {
  return {
    async saveAll(eventId, entries) {
      // Le contrôleur lit le corps tel quel : un tableau de lignes, sans enveloppe.
      const response = await fetch(`${baseUrl}/${encodeURIComponent(eventId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(entries),
      })

      if (!response.ok) {
        // Jeton absent, invalide ou expiré (à centraliser : 2e copie de ce bloc).
        if (response.status === 401) {
          throw new Error('Session expirée : reconnecte-toi pour continuer.')
        }
        // Le contrôleur répond { message }, le middleware { error } : on lit les deux.
        const body = (await response.json().catch(() => null)) as {
          message?: string
          error?: string
        } | null
        throw new Error(
          body?.message ??
            body?.error ??
            `Échec de l'enregistrement (erreur ${response.status}).`,
        )
      }
    },
  }
}
