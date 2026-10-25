import type { Rider } from '../domain/Riders'
import type { RiderReader } from '../domain/RiderRepository'

export type GetRiders = () => Promise<Rider[]>

export function createGetRiders(repository: RiderReader): GetRiders {
  return async () => {
    const riders = await repository.getAll()
   
    return [...riders].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  }
}