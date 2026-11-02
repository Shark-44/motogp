import type { RiderStanding } from './RiderStanding'
 
export interface RiderStandingReader {
  getAll(): Promise<RiderStanding[]>
}
 
export type RiderStandingRepository = RiderStandingReader