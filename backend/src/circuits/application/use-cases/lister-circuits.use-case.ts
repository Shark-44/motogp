import type { ListerCircuitsPort } from '../ports/in/lister-circuits.port.js';
import type { CircuitRepositoryPort } from '../../domaine/ports/out/circuit-repository.port.js';

export class ListerCircuitsUseCase implements ListerCircuitsPort {
  constructor(private readonly circuitRepository: CircuitRepositoryPort) {}

  async execute() {
    return this.circuitRepository.findAll();
  }
}
