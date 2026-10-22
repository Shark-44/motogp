import type { Circuit } from '../domain/Circuits'
import type { CircuitReader } from '../domain/CircuitRepository'

export type GetCircuits = () => Promise<Circuit[]>

export function createGetCircuits(repository: CircuitReader): GetCircuits {
  return async () => {
    const circuits = await repository.getAll()
   
    return [...circuits].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  }
}