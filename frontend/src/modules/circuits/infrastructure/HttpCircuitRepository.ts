import type { Circuit } from '../domain/Circuits'
import type { CircuitRepository } from '../domain/CircuitRepository'

export function createHttpCircuitRepository(
  baseUrl = '/api/circuits',
): CircuitRepository {
  return {
    async getAll() {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error(
          `Impossible de charger les circuits (erreur ${response.status}).`,
        )
      }
      return (await response.json()) as Circuit[]
    },


  }
}