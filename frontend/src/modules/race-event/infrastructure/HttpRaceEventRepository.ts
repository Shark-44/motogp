// src/modules/race-event/infrastructure/HttpRaceEventRepository.ts
import type { RaceEvent, StatutGP } from '../domain/RaceEvents'
import type { RaceEventRepository } from '../domain/RaceEventRepository'
import { authHeader } from '@/shared/infrastructure/authHeader'

// Le JSON du back transporte la date en texte : on la reconvertit en Date.
function toRaceEvent(item: Record<string, unknown>): RaceEvent {
  return {
    ...(item as Omit<RaceEvent, 'date'>),
    date: new Date(item.date as string),
  }
}

export function createHttpRaceEventRepository(
  baseUrl = '/api/raceEvents',
): RaceEventRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger le calendrier (erreur ${response.status}).`,
        )
      }

      const data = (await response.json()) as Record<string, unknown>[]
      return data.map(toRaceEvent)
    },

    async updateStatut(id: string, statut: StatutGP) {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ statut }),
      })

      if (!response.ok) {
        // Jeton absent, invalide ou expiré (à centraliser plus tard).
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
            `Échec de la mise à jour (erreur ${response.status}).`,
        )
      }

      return toRaceEvent((await response.json()) as Record<string, unknown>)
    },
  }
}
