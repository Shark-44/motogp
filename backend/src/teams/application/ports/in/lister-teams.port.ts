import type { Team } from '../../../domaine/entities/team.entity.js';

export interface ListerTeamsPort {
  execute(): Promise<Team[]>;
}
