import type { ListerTeamsPort } from '../ports/in/lister-teams.port.js';
import type { TeamRepositoryPort } from '../../domaine/ports/out/team-repository.port.js';

export class ListerTeamsUseCase implements ListerTeamsPort {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute() {
    return this.teamRepository.findAll();
  }
}
