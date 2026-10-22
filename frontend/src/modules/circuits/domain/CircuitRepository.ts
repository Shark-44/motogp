import type { Circuit } from './Circuits'
 
export interface CircuitReader {
  getAll(): Promise<Circuit[]>
}
 
export type CircuitRepository = CircuitReader