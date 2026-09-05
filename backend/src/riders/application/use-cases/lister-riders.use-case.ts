import type { ListerRidersPort } from '../ports/in/lister-riders.port.js';
import type { RiderRepositoryPort } from '../../domaine/ports/out/rider-repository.port.js';

export class ListerRidersUseCase implements ListerRidersPort {
  constructor(private readonly riderRepository: RiderRepositoryPort) {}

  async execute() {
    return this.riderRepository.findAll();
  }
}
