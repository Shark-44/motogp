import type { Circuit } from '../../../domaine/entities/circuit.entity.ts';

export interface ListerCircuitsPort {
  execute(): Promise<Circuit[]>;
}
