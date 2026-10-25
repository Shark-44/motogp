import type { Rider } from './Riders'
 
export interface RiderReader {
  getAll(): Promise<Rider[]>
}
 
export type RiderRepository = RiderReader