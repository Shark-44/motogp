import { PrismaClient } from '@prisma/client';
import { TeamStandings } from '../../../domaine/entities/teamStandings.entity.js';
import { TeamStandingsRepositoryPort } from '../../../domaine/ports/out/teamStandings-repository.port.js';

export class PrismaTeamStandingsRepository implements TeamStandingsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<TeamStandings[]> {
    const rows = await this.prisma.teamStandings.findMany();
    return rows.map(
      (row) => new TeamStandings(row.id, row.eventId, row.equipeId, row.pointsCumules, row.positionGenerale),
    );
  }

  async saveAll(classements: TeamStandings[]): Promise<TeamStandings[]> {
    const rows = await this.prisma.$transaction(
      classements.map((c) =>
        this.prisma.teamStandings.upsert({
          where: {
            eventId_equipeId: {
              eventId: c.eventId,
              equipeId: c.equipeId,
            },
          },
          create: {
            eventId: c.eventId,
            equipeId: c.equipeId,
            pointsCumules: c.pointsCumules,
            positionGenerale: c.positionGenerale,
          },
          update: {
            pointsCumules: c.pointsCumules,
            positionGenerale: c.positionGenerale,
          },
        }),
      ),
    );

    return rows.map(
      (row) => new TeamStandings(row.id, row.eventId, row.equipeId, row.pointsCumules, row.positionGenerale),
    );
  }
}