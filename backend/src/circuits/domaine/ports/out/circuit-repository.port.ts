import type { Circuit } from '../../entities/circuit.entity.js';

export interface CircuitRepositoryPort {
  findAll(): Promise<Circuit[]>;
}
