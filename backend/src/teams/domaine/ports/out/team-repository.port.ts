import type { Team } from '../../entities/team.entity.js';

export interface TeamRepositoryPort {
  findAll(): Promise<Team[]>;
}
