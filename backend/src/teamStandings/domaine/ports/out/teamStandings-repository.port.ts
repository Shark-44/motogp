import type { TeamStandings } from '../../entities/teamStandings.entity.js'

export interface TeamStandingsRepositoryPort {
  findAll(): Promise<TeamStandings[]>;
  saveAll(classements: TeamStandings[]): Promise<TeamStandings[]>;
}