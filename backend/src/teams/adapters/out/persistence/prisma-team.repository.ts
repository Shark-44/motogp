import { PrismaClient } from '@prisma/client';
import { Team } from '../../../domaine/entities/team.entity.js';
import { TeamRepositoryPort } from '../../../domaine/ports/out/team-repository.port.js';

export class PrismaTeamRepository implements TeamRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Team[]> {
    const rows = await this.prisma.team.findMany();
    return rows.map(
      (row) =>
        new Team(row.id, row.nom, row.pays, row.constructeur, row.estOfficielle, row.logo),
    );
  }
}