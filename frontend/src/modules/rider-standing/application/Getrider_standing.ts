import type { RiderStanding } from '../domain/RiderStanding'
import type { RiderStandingReader } from '../domain/RiderStandingRepository'

export type GetRiderStanding = () => Promise<RiderStanding[]>

export function createGetRiderStanding(repository: RiderStandingReader): GetRiderStanding {
  return () => repository.getAll()
}