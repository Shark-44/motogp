import { PrismaClient, RiderStandings as PrismaRiderStandings} from '@prisma/client';
import { RiderStandings } from '../../../domaine/entities/riderStandings.entity.js';
import { RiderStandingsRepositoryPort } from '../../../domaine/ports/out/riderStandings-repository.port.js';

export class PrismaRiderStandingsRepository implements RiderStandingsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(row: PrismaRiderStandings): RiderStandings {
    return new RiderStandings(
      row.id,
      row.eventId,
      row.piloteId,
      row.pointsCumules,
      row.positionGenerale
    );
  }

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

  async findByEventIds(eventIds: string[]): Promise<RiderStandings[]> {
    const rows = await this.prisma.riderStandings.findMany({
      where: {
        eventId: {
          in: eventIds,
        },
      },
      orderBy: [
        { eventId: 'asc' },
        { positionGenerale: 'asc' },
        { piloteId: 'asc' },
      ],
    });

    return rows.map((row) => this.toEntity(row));
  }

  async findByEventId(eventId: string): Promise<RiderStandings[]> {
    const rows = await this.prisma.riderStandings.findMany({
      where: { eventId },
      orderBy: {
        positionGenerale: 'asc',
      },
    });

    return rows.map((row) => this.toEntity(row));
  }
}
