import { PrismaClient } from '@prisma/client';
import { RiderStandings } from '../../../domaine/entities/riderStandings.entity.js';
import { RiderStandingsRepositoryPort } from '../../../domaine/ports/out/riderStandings-repository.port.js';

export class PrismaRiderStandingsRepository implements RiderStandingsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<RiderStandings[]> {
    const rows = await this.prisma.riderStandings.findMany();
    return rows.map(
      (row) => new RiderStandings(row.id, row.eventId, row.piloteId, row.pointsCumules, row.positionGenerale),
    );
  }

  async saveAll(classements: RiderStandings[]): Promise<RiderStandings[]> {
    const rows = await this.prisma.$transaction(
      classements.map((c) =>
        this.prisma.riderStandings.upsert({
          where: { eventId_piloteId: { eventId: c.eventId, piloteId: c.piloteId } },
          create: {
            eventId: c.eventId,
            piloteId: c.piloteId,
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
      (row) => new RiderStandings(row.id, row.eventId, row.piloteId, row.pointsCumules, row.positionGenerale),
    );
  }
}
