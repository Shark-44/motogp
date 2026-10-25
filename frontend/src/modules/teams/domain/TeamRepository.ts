import type { Team } from './Teams'
 
export interface TeamReader {
  getAll(): Promise<Team[]>
}
 
export type TeamRepository = TeamReader