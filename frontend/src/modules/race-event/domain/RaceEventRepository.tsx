import type { RaceEvent } from './RaceEvents'
 
export interface RaceEventReader {
  getAll(): Promise<RaceEvent[]>
}
 
export type RaceEventRepository = RaceEventReader